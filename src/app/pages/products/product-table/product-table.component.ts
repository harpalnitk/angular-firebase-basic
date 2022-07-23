import { CoreService } from './../../../core/core.service';
import { ProductDataSource } from './product.datasource';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { ProductsService } from '../products.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ProductCategory } from '../product-category/product-category';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';

@Component({
  selector: 'product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductTableComponent implements OnInit {

  displayedColumns: string[] = [
    "index",
    "title",
    "price", 
    "desc",
    "category"

  ];
  width: string;

  dataSource: ProductDataSource;
  @ViewChild(MatSort) sort: MatSort;
  //@ViewChild(MatPaginator) paginator: MatPaginator;

  category$ : Observable<ProductCategory[]> = this.productCategoryService.allCategoriesSorted$;

  constructor(
    private productsService: ProductsService,
    private coreService: CoreService,
    private dialog: MatDialog,
    private productCategoryService:ProductCategoryService
  ) {
    this.width = this.coreService.getWidth();
    // this.isLoading$ = this.coreService.getIsLoading().pipe(
    //   shareReplay()
    // );
  }

  ngOnInit(): void {
   
    //this.loadProduct();
   // this.productAdminService.allProductForView$.subscribe(val => console.log('Val',val));
   this.dataSource = new ProductDataSource(this.productsService);
        this.dataSource.loadProduct();
  }

      //Code for displaying Table
      categorySelected(event,category: ProductCategory): void {
        //console.log('category selected in ts file', event.isUserInput);
        if(event.isUserInput) {
        //this.coreService.setIsLoading(true);
        this.productsService.selectedCategoryChanged(category.id);
      }
      }
  

  // loadProduct(){
  //   this.coreService.setIsLoading(true);
  //   this.productAdminService
  //     .loadAllProduct()
  //     .pipe(
  //       finalize(() => {
  //         this.coreService.setIsLoading(false);
  //       })
  //     )
  //     .subscribe((value) => {
  //       console.log(value);
  //       this.dataSource = new MatTableDataSource(value);
  //       this.dataSource.sort = this.sort;
  //     },
  //     err=>{
  //       console.log(err);

  //     }
  //     );
  // }

  addProduct() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = this.width;

    //dialogConfig.data = {};

    this.dialog.open(ProductDialogComponent, dialogConfig)
    .afterClosed()
    .subscribe(val=>{
         // this.loadProduct();
    });
  }


  ngAfterViewInit() {
    // if (this.dataSource) {
    //   this.dataSource.sort = this.sort;
    // }
    // this.paginator.page
    // .pipe(
    //     tap(() => this.loadProductPage())
    // )
    // .subscribe();
    this.sort.sortChange
    .pipe(
        tap(() => this.loadProductPage())
    )
    .subscribe();
  }

  loadProductPage() {
    this.dataSource.changeProductLoadParams(
        '',
        this.sort.active,
        this.sort.direction);
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
   // this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // onDeleteProduct(id: string){
  //   this.coreService.setIsLoading(true);
  //     this.productService.delete(id)
  //     .pipe(
  //       finalize(() => {
  //         this.coreService.setIsLoading(false);
  //       })
  //     )
  //     .subscribe((value) => {
  //       this.coreService.presentSnackbar('Product item deleted successfully');
  //      // this.loadProduct();
  //     },
  //     err=>{
  //       console.log(err);
  //     }
  //     );;
  // }
}
