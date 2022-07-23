import { ProductsService } from './../products.service';
import { CoreService } from './../../../core/core.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Product } from './../product';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ProductCategory } from '../product-category/product-category';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductSupplier } from '../product-supplier/product-supplier';
import { ProductSupplierService } from '../product-supplier/product-supplier.service';




@Component({
  selector: "product-dialog",
  templateUrl: "./product-dialog.component.html",
  styleUrls: ["./product-dialog.component.scss"],
})
export class ProductDialogComponent implements OnInit, AfterViewInit {
  product: Product;
  form: FormGroup;
  isLoading$: Observable<boolean>;
  editMode = false;


  category$ : Observable<ProductCategory[]> = this.productCategoryService.allCategoriesSorted$.pipe(
    //Do Not display All category in the dropdown
    map(categories => categories.filter(category => category.id !== 'all'))
  );

  suppliers$: Observable<ProductSupplier[]> = this.productSupplierService.allSuppliersSorted$;


  constructor(
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) product: Product,
    private productsService: ProductsService,
    private productCategoryService: ProductCategoryService,
    private productSupplierService: ProductSupplierService,
    private router: Router,
    private coreService: CoreService,
    private cdRef: ChangeDetectorRef
  ) {
    this.initForm();
    console.log('injected product in product dialog component',product)
    this.product = product;
    this.isLoading$ = this.coreService.getIsLoading();
  }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    if (this.product) {
      this.editMode = true;
      this.patchForm();
    }
    console.log('before detectchanges');
    this.cdRef.detectChanges(); 
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      productCode: new FormControl(null, { validators: [Validators.required] }),
      desc: new FormControl(null),
      categoryId:new FormControl(null, { validators: [Validators.required] }),
      price: new FormControl(null, { validators: [Validators.required] }),
      quantityInStock:new FormControl(null, { validators: [Validators.required] }),
      suppliers: new FormControl('', { validators: [Validators.required] }),
    });
  }



  patchForm() {
    console.log("patchForm in product dialog component" );
    this.form.patchValue({
      name: this.product.name,
      productCode: this.product.productCode,
      desc: this.product.desc,
      categoryId: this.product.categoryId,
      price: this.product.price,
      quantityInStock: this.product.quantityInStock,
      suppliers: this.product.suppliers
    });
   
  }



  save() {
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;
  //  console.log("Form Data", data);
    this.coreService.setIsLoading(true);
    if (this.product) {
      //EDIT PRODUCT
      this.productsService
        .updateProduct(this.product.id, data)
        .pipe(
          finalize(() => {
            this.dialogRef.close('edit');
            this.coreService.setIsLoading(false);
          })
        )
        .subscribe(
          (res) => {
            this.coreService.presentSnackbar("Product updated successfully!");
          },
          (err) => {
            console.log("Error in updating product", err);
            this.coreService.setMessage(
              "Error in updating product. Please try again!"
            );
          }
        );
    } else {
      //ADD PRODUCT
      this.productsService
        .addProduct(data.name, data.productCode,data.desc,data.categoryId,data.price,data.quantityInStock,data.suppliers )
        .pipe(
          finalize(() => {
         //   console.log(" in add product before closing dialog");
            this.dialogRef.close();
            this.coreService.setIsLoading(false);
          })
        )
        .subscribe(
          (res) => {
            console.log("Response in add product", res);
            this.coreService.presentSnackbar("Product added successfully!");
          },
          (err) => {
            console.log("Error in adding product", err);
            this.coreService.presentSnackbar(
              "Error in adding product. Please try again!"
            );
          }
        );
    }
  }


  close() {
    this.dialogRef.close();
  }
}


