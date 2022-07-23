import { DataService } from './data.service';
import { FormModalComponent } from './form-modal/form-modal.component';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss']
})
export class ReactiveFormComponent implements OnInit {

  public FormArray = FormArray;
  public FormGroup = FormGroup;
  public myForm = new FormGroup({
    myFavorites: new FormGroup({
      musical: new FormControl({value: '', disabled: false}),
      number: new FormControl({value: '', disabled: true})
    }),
    cast: new FormArray([
      new FormGroup({
        role: new FormControl({value: '', disabled: false}, Validators.required),
        actor: new FormControl({value: '', disabled: false}, Validators.required)
      })
    ])
  });

  public musicalList = this.musicalService.getMusicals();

  constructor(private musicalService: DataService, private dialog: MatDialog) { }

  ngOnInit(): void {
    const musicalControl = this.myForm.get('myFavorites')?.get('musical');

    musicalControl?.valueChanges.subscribe((value) => {
      const numberControl = this.myForm.get('myFavorites')?.get('number') as FormControl;
      if(value) {
        numberControl.enable();
        numberControl.setValidators(this.validateMusicalNumber(value));
      }
      else {
        numberControl.disable();
        numberControl.clearValidators();
      }
      numberControl.updateValueAndValidity();
    });

  }

  validateMusicalNumber(musical: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isInMusical = this.musicalService.getNumbers(musical)?.includes(control.value);
      return isInMusical ? null: {wrongNumber: {value: control.value}}
    };
  }

  addCastMember(): void {
    const castArray = this.myForm.get('cast') as FormArray;
    const newFormGroup = new FormGroup({
      role: new FormControl({value: '', disabled: false}, Validators.required),
      actor: new FormControl({value: '', disabled: false}, Validators.required)
    })
    castArray.push(newFormGroup);
  }

  removeCastMember(i: number): void {
    const castArray = this.myForm.get('cast') as FormArray;
    castArray.removeAt(i);
  }

  submitForm():void {
    this.dialog.open(FormModalComponent, {
      width: '600px',
      data: {formData: this.myForm.value}
    });
  }

}
