import { CoreService } from './../../../core/core.service';
import { ProductSupplier } from '../product-supplier/product-supplier';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductCategory } from '../product-category/product-category';
import { ProductsService } from '../products.service';
import { Product } from '../product';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'productlist',
  templateUrl: './product-by-category.component.html',
  styleUrls: ['./product-by-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductByCategoryComponent implements OnInit {

  products$ : Observable<Product[]> = this.productsService.products$.pipe(
    tap( products => {
     //whenever product list changes; details for the first product in the list is shown automatically
     //without clicking
     if(products?.length > 0){
       this.onProductSelect(products[0])
     }else{
       this.coreService.setMessage('No products for the Selected Category');
     }
     
   }),
   catchError(err => {
     this.coreService.setMessage(err);
     return EMPTY;
   })
   );


  selectedProduct$ : Observable<Product | undefined> = this.productsService.selectedProduct$;
     //ancilliary stream
     pageTitle$ = this.selectedProduct$.pipe(
      map(p => p ? `Product detail for : ${p.name}`: null )
    )
  category$ : Observable<ProductCategory[]> = this.productCategoryService.allCategoriesSorted$.pipe(
    //Do Not display All category in the dropdown
    map(categories => categories.filter(category => category.id !== 'all'))
  );
  suppliers$: Observable<ProductSupplier[]> = this.productsService.productSuppliers$;

  constructor(private productsService: ProductsService,
    private productCategoryService: ProductCategoryService,
    private coreService: CoreService) { }

  ngOnInit(): void { }
  onProductSelect(product){
    this.productsService.selectedProductChanged(product.id);
  }
    //Code for displaying Table
    categorySelected(event,category: ProductCategory): void {
      console.log('category selected in ts file')
      if(event.isUserInput) {
      //this.coreService.setIsLoading(true);
      this.productsService.selectedCategoryChanged(category.id);
    }
    }

}
