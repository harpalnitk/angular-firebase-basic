import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../reactive-form/data.service';
import { FormModalComponent } from '../reactive-form/form-modal/form-modal.component';

@Component({
  selector: 'template-forms',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent implements OnInit {

  public myFormModel = {
    myFavorites: {
      musical: '',
      number: ''
    },
    castMembers: [{
      role: '',
      actor: ''
    }]
  }
  public musicalList = this.musicalService.getMusicals();

  constructor(private musicalService: DataService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  removeCastMember(i: number): void {
    this.myFormModel.castMembers.splice(i,1);
  }


  addCastMember(): void {
    this.myFormModel.castMembers = [
      ... this.myFormModel.castMembers,
      {
        role: '',
        actor: ''
      }
    ]
  }

  submitForm():void {
    this.dialog.open(FormModalComponent, {
      width: '600px',
      data: {formData: this.myFormModel}
    });
  }

}
