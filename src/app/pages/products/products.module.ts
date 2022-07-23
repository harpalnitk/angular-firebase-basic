import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductByCategoryComponent } from './product-by-category/product-by-category.component';
import { ProductTableComponent } from './product-table/product-table.component';
import {ProductDialogComponent} from './product-dialog/product-dialog.component';




@NgModule({
  declarations: [
    ProductsComponent,
    ProductByCategoryComponent,
    ProductTableComponent,
    ProductDialogComponent,
  ],
  imports: [
    SharedModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
