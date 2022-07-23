import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { InventoryTableComponent } from './inventory-table/inventory-table.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { InventoryDialogComponent } from './inventory-dialog/inventory-dialog.component';
import { InventoryQtyDialogComponent } from './inventory-qty-dialog/inventory-qty-dialog.component';
import { InventoryItemComponent } from './inventory-item/inventory-item.component';
import { SharedModule } from 'app/shared/shared.module';
import { InventoryItemHistoryComponent } from './inventory-item/inventory-item-history/inventory-item-history.component';


@NgModule({
  declarations: [
    InventoryComponent,
    InventoryTableComponent,
    InventoryDialogComponent,
    InventoryItemComponent,
    InventoryQtyDialogComponent,
    InventoryItemHistoryComponent
  ],
  imports: [
    SharedModule,
    InventoryRoutingModule
  ]
})
export class InventoryModule { }
