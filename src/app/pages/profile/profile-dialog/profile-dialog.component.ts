import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CoreService } from 'app/core/core.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Profile, ProfileConstants } from '../profile.model';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
  profile: Profile;
  form: FormGroup;
  isLoading$: Observable<boolean>;
  genders = ProfileConstants.GENDERS;
  constructor(
    private dialogRef: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) profile: Profile,
    private profileService: ProfileService,
    private router: Router,
    private coreService: CoreService
  ) { 
    this.initForm();
    this.profile = profile;
    this.isLoading$ = this.coreService.getIsLoading();
  }
  ngOnInit(): void {
    this.patchForm();
  }

  initForm() {
    this.form = new FormGroup({
      displayName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.minLength(5), Validators.maxLength(40)],
      }),
      firstName: new FormControl(null, {
        updateOn: 'blur',
      }),
      lastName: new FormControl(null, {
        updateOn: 'blur',
      }),
      gender: new FormControl('F'),
      about: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.maxLength(400)],
      }),
      address: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.maxLength(100)],
      }),
      contact: new FormGroup({
        phones: new FormArray([]),
      }),
      photoURL: new FormControl(null),
    });
  }

  patchForm() {
    this.form.patchValue({
      firstName: this.profile.firstName || null,
      lastName: this.profile.lastName || null,
      about: this.profile.about || null,
      displayName: this.profile.displayName || null,
      gender: this.profile['gender'] ? this.profile['gender'] : 'F',
      address: this.profile.address || null,
      photoURL: this.profile.photoURL || null,
    });

    if (this.profile['contact'] && this.profile.contact['phones']) {
      for (let i = 0; i < this.profile.contact.phones.length; i++) {
        this.phones.setControl(
          i,
          new FormControl(this.profile.contact.phones[i], [
            Validators.required,
            Validators.pattern(/^[0-9]+[0-9]*$/),
          ])
        );
      }
    }
  }

  get phones() {
    return this.form.get('contact.phones') as FormArray;
  }

  onAddPhone() {
    this.phones.push(
      new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]+[0-9]*$/),
      ])
    );
  }

  onDeletePhone(index: number) {
    this.phones.removeAt(index);
  }
  onImagePicked(imageURL: string) {
    console.log('imageURL in new complaint Component'), imageURL;
    this.form.patchValue({ photoURL: imageURL });
  }

  save(){
   
    console.log('Profile Form before Submit', this.form);
    if (!this.form.valid) {
      return;
    }
    this.coreService.setIsLoading(true);
    let newProfile: Profile = {
      firstName: this.form.value['firstName'],
      lastName: this.form.value['lastName'],
      gender: this.form.value['gender'],
      about: this.form.value['about'],
      userType: 'SU',
      photoURL: this.form.value['photoURL'],
      displayName: this.form.value['displayName'],
      address: this.form.value['address'],
      contact: this.form.value['contact'],
      official: null,
      email: this.profile.email,
      uid: this.profile.uid,
    };
    delete newProfile.uid; // unique can't be updated as per this APP POLICY
    delete newProfile.email; // unique can't be updated as per this APP POLICY
    this.profileService.updateProfile(newProfile).pipe(
      finalize(()=>{
        this.coreService.setIsLoading(false);
        this.dialogRef.close('edit');
      })).subscribe(
        ()=>{
          this.coreService.presentSnackbar('Profile updated successfully');
        },
        err =>{
          console.log('Error in updating profile');
          this.coreService.setMessage('Error in updating User Profile');
        }
      );
  }

  close() {
    this.dialogRef.close();
  }

}
