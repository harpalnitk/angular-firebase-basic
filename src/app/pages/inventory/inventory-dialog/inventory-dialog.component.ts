import { CoreService } from './../../../core/core.service';
import { InventoryService } from './../inventory.service';

import { Inventory } from './../../../model/inventory';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { finalize, tap } from "rxjs/operators";
import { InventoryConfigService, SelectValues } from '../inventory-config/inventory-config.service';



@Component({
  selector: "inventory-dialog",
  templateUrl: "./inventory-dialog.component.html",
  styleUrls: ["./inventory-dialog.component.scss"],
})
export class InventoryDialogComponent implements OnInit, AfterViewInit {
  inventory: Inventory;
  form: FormGroup;
  isLoading$: Observable<boolean>;
  editMode = false;

  selectedType: string;
  selectedMake: string;

  // types: SelectValues[] = [
  //   { value: "t-0", viewValue: "Part" },
  //   { value: "t-1", viewValue: "Denting" },
  //   { value: "t-2", viewValue: "Accessory" },
  //   { value: "t-2", viewValue: "Oil" },
  // ];

  // makes: SelectValues[] = [
  //   { value: "m-0", viewValue: "Honda" },
  //   { value: "m-1", viewValue: "Toyota" },
  //   { value: "m-2", viewValue: "Maruti" },
  //   { value: "m-3", viewValue: "Hyundai" },
  // ];

  types$ : Observable<SelectValues[]>;
  subTypes$: Observable<SelectValues[]> = this.inventoryConfigService.subTypesForTypeSorted$.pipe(
    tap(val=> console.log('Sub Types received', val))
  );
  makes$: Observable<SelectValues[]>;

  constructor(
    private dialogRef: MatDialogRef<InventoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) inventory: Inventory,
    private inventoryService: InventoryService,
    private inventoryConfigService: InventoryConfigService,
    private router: Router,
    private coreService: CoreService,
    private cdRef: ChangeDetectorRef
  ) {
    this.initForm();
    this.inventory = inventory;
    this.isLoading$ = this.coreService.getIsLoading();
    this.makes$ = this.inventoryConfigService.allMakesSorted$;
    this.types$ = this.inventoryConfigService.allTypesSorted$;
    // this.subTypes$ = this.inventoryConfigService.subTypesForTypeSorted$.pipe(
    //   tap(val=> console.log('Sub Types received', val))
    // );
  }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    if (this.inventory) {
      this.editMode = true;
      this.patchForm();
    }
    this.cdRef.detectChanges(); 
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      type: new FormControl(null, { validators: [Validators.required] }),
      subType: new FormControl(null, { validators: [Validators.required] }),
      make: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  patchForm() {
    this.loadSubType(this.inventory.type);
    this.form.patchValue({
      name: this.inventory.name,
      type: this.inventory.type,
      subType: this.inventory.subType,
      make: this.inventory.make,
    });
   
  }

  loadSubType(type: string){
    console.log('loadSubType called', type);
    this.inventoryConfigService.selectedTypeChanged(type);
  }



  save() {
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;
    console.log("Form Data", data);
    this.coreService.setIsLoading(true);
    if (this.inventory) {
      //EDIT INVENTORY
      this.inventoryService
        .updateInventory(this.inventory.id, data)
        .pipe(
          finalize(() => {
            this.dialogRef.close('edit');
            this.coreService.setIsLoading(false);
           
          })
        )
        .subscribe(
          (res) => {
            this.inventoryService.addEventToItemHistory(this.inventory.id,'INVENTORY EDITED','NA');
            this.coreService.presentSnackbar("Inventory updated successfully!");
          },
          (err) => {
            console.log("Error in updating inventory", err);
            this.coreService.setMessage(
              "Error in adding inventory. Please try again!"
            );
          }
        );
    } else {
      //ADD INVENTORY
      this.inventoryService
        .addInventory(data.name, data.type, data.subType, data.make)
        .pipe(
          finalize(() => {
            console.log(" in add inventory before closing dialog");
            this.dialogRef.close();
            this.coreService.setIsLoading(false);
          })
        )
        .subscribe(
          (res) => {
            console.log("Response in add inventory", res);
            this.coreService.presentSnackbar("Inventory added successfully!");
          },
          (err) => {
            console.log("Error in adding inventory", err);
            this.coreService.presentSnackbar(
              "Error in adding inventory. Please try again!"
            );
          }
        );
    }
  }

  close() {
    this.dialogRef.close();
  }
}
