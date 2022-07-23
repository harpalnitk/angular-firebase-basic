
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductByCategoryComponent } from './product-by-category/product-by-category.component';
import { ProductTableComponent } from './product-table/product-table.component';


import { ProductsComponent } from './products.component';

const routes: Routes = [{ 
  path: '', 
  component: ProductsComponent ,
  children:[
  { path: 'list', component: ProductTableComponent },
  { path: 'category', component: ProductByCategoryComponent }
           ],
                         },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
