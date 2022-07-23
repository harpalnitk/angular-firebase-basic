import { CoreService } from './../../../core/core.service';

import { Inventory } from './../../../model/inventory';

import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { MatSliderChange } from "@angular/material/slider";
import { InventoryService } from '../inventory.service';


@Component({
  selector: 'inventory-qty-dialog',
  templateUrl: './inventory-qty-dialog.component.html',
  styleUrls: ['./inventory-qty-dialog.component.scss']
})
export class InventoryQtyDialogComponent implements OnInit {

  inventory: Inventory;
  form: FormGroup;
  isLoading$: Observable<boolean>;
  add;
  min;
  max;
 



  constructor(
    private dialogRef: MatDialogRef<InventoryQtyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private inventoryService: InventoryService,
    private coreService: CoreService
  ) {
    this.isLoading$ = this.coreService.getIsLoading();
    
    this.inventory = data.inventory;
    this.add = data.add;
  }

  ngOnInit(): void {
    //this.patchForm();
    if(this.add){
      this.min = this.inventory.count;
      this.max = 100;
    }else{
      this.min = 0;
      this.max = this.inventory.count;
    }
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      count: new FormControl(this.inventory.count, { validators: 
        [
          Validators.required,
            Validators.pattern(/^[0-9]+$/),
             Validators.min(this.min ),
            Validators.max(this.max)]}),
    });
  }

  patchForm() {
    this.form.patchValue({
      count: this.inventory.count,
    });
 
  }


  async save() {
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;
 
    console.log("Form Data", data);
    const newCount = await this.inventoryService.runTransaction(this.inventory.id, data.count);
    // It will update in the parent calling component fro where the dialog was called
    // as reference was passed and we did not
    //Mutate the object here
    if(newCount){
      this.inventory.count = newCount;
    }
    console.log('newCount', newCount);
    this.dialogRef.close();
}

  close() {
    this.dialogRef.close();
  }

}
