import { CoreService } from './../../core/core.service';
import { ProfileService } from './profile.service';
import { Profile } from './profile.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  id;
  profile: Profile;
  isLoading$: Observable<boolean>;
  width: string;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private coreService: CoreService,
    private dialog: MatDialog,

  ) { 
    this.width = this.coreService.getWidth();
    this.isLoading$ = this.coreService.getIsLoading();
  }

  getDialogConfig(){
    const dialogConfig = new MatDialogConfig();
  
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = this.width;
    dialogConfig.data = this.profile;
    return dialogConfig;
  }

  ngOnInit(): void {
    this.coreService.setIsLoading(true);
    this.route.data.pipe(switchMap((data) => data.profile)).subscribe(
      (profile: Profile) => {
        if (profile) {
          this.coreService.setIsLoading(false);
          this.profile = profile;
        } else {
          this.coreService.setIsLoading(true);
         // this.coreService.presentSnackbar('Please wait a little more!!!');
        }
      },
      (err) => {
        console.log(`Error in fecthing Profile`, err);
        this.coreService.setIsLoading(false);
      }
    );
  }
  onEdit(){
    const dialogConfig =this.getDialogConfig();
    this.dialog
      .open(ProfileDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        if (val === "edit") {
          //reload inventory
          this.reloadProfile();
        }
      });
  }

  reloadProfile(){

  }

}
