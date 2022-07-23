
import { CoreService } from './../../../core/core.service';

import { Inventory } from './../../../model/inventory';
import { InventoryQtyDialogComponent } from './../inventory-qty-dialog/inventory-qty-dialog.component';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { InventoryDialogComponent } from "../inventory-dialog/inventory-dialog.component";
import { Observable, Subject } from "rxjs";
import { InventoryService } from '../inventory.service';

@Component({
  selector: "inventory-item",
  templateUrl: "./inventory-item.component.html",
  styleUrls: ["./inventory-item.component.scss"],
})
export class InventoryItemComponent implements OnInit {
  inventory: Inventory;
  width: string;
  isLoading$: Observable<boolean>;
  showHistoryButton = true;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private coreService: CoreService,
    private inventoryService: InventoryService
  ) {
    this.isLoading$ = this.coreService.getIsLoading();
  }

  ngOnInit(): void {
    this.width = this.coreService.getWidth();
    this.inventory = this.route.snapshot.data["item"];
    console.log("Inside inventory item", this.inventory);
    this.coreService.setIsLoading(false);
  }

getDialogConfig(){
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = this.width;
  dialogConfig.data = this.inventory;
  return dialogConfig;
}

  editInventory() {
    const dialogConfig =this.getDialogConfig();
    this.dialog
      .open(InventoryDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        if (val === "edit") {
          //reload inventory
          this.reloadInventory();
        }
      });
  }

  changeInventoryQuantity(val: number){
    const dialogConfig = this.getDialogConfig();
    dialogConfig.data = {inventory: this.inventory, add: val};
    this.dialog
    .open(InventoryQtyDialogComponent, dialogConfig)
    .afterClosed()
    .subscribe((val) => {
      if (val === "edit") {
        //reload inventory
         this.reloadInventory();
      }
    });
  }

  private reloadInventory(){
    this.inventoryService.getInventoryData(this.inventory.id).subscribe(
      (val) => {
        this.inventory = val;
      },
      (err) => {
        console.log(err);
        this.coreService.presentSnackbar(
          "Error in updating the page after update"
        );
      }
    );
  }
  showHistory(){
   // this.router.navigate(['inventory',this.inventory.id, 'history']);
   //OR
    this.router.navigate(['history', {id: this.inventory.id}], { relativeTo: this.route });
    this.showHistoryButton = false;
  }

}
