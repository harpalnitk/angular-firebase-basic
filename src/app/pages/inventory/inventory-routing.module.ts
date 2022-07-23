import { InventoryItemHistoryComponent } from './inventory-item/inventory-item-history/inventory-item-history.component';
import { InventoryItemResolver } from './inventory-item.resolver';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryItemComponent } from './inventory-item/inventory-item.component';
import { InventoryComponent } from './inventory.component';

const routes: Routes = [
  { path: '', component: InventoryComponent },
  {
    path: ':id',
    component: InventoryItemComponent,
    resolve: {
        item: InventoryItemResolver
    },
    children: [
      {
        path: 'history', // child route path
        component: InventoryItemHistoryComponent, // child route component that the router renders
      },
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
