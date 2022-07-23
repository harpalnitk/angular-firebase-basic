import { User } from './../../model/user';
import { filter, shareReplay, startWith } from 'rxjs/operators';
import { ProductCategoryService } from './product-category/product-category.service';
import { ProductSupplierService } from './product-supplier/product-supplier.service';
import { switchMap, distinctUntilChanged, mergeMap, toArray, first } from 'rxjs/operators';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from './product';
import { CoreService } from './../../core/core.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError, combineLatest, from, forkJoin, EMPTY, of } from 'rxjs';
import {convertSnaps} from '../../services/db-utils';
import { CdkAccordion } from '@angular/cdk/accordion';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  user: User;
  productCollection: AngularFirestoreCollection<Product>;
 //selectedCategoryId = 'BSOy1yi3rApCuBpOdoBf';
  constructor(private db: AngularFirestore,
    private afAuth: AngularFireAuth,
     private coreService: CoreService,
     private productSupplierService:ProductSupplierService,
     private productCategoryService:ProductCategoryService) {
      this.afAuth.authState.subscribe((user) => (this.user = user));
      this.productCollection = this.db.collection<Product>("products");
      }



   //Category Selection
   //Observable is unicast
   //Subject is multicast
   private categorySubject = new Subject<string>();
   categorySelectedAction$ = this.categorySubject.asObservable();

   selectedCategoryChanged(categoryId:string):void{
     console.log('selectedCategoryChanged in service',categoryId);
     this.categorySubject.next(categoryId);
   }

//    products1$ = this.db.collection<Product>('products',
//    (ref) => ref.orderBy('title', 'desc')).snapshotChanges().pipe(
//    map((snaps) => convertSnaps<Product>(snaps)),
//    tap(val=> console.log('product snaps', val)),
//    catchError(this.handleError)
//  );

 getProductQuery(catId: string){
 return this.db.collection<Product>('products',
 (ref) => ref.where('categoryId','==', catId)).snapshotChanges()
 }

 allProductQuery(){
  return this.db.collection<Product>('products').snapshotChanges()
  }

  allProducts$ = this.allProductQuery().pipe(
    tap(()=> console.log('Inside all product query')),
    catchError(this.handleError),
    map((snaps) => convertSnaps<Product>(snaps)),
    tap((data)=> console.log('Products:', JSON.stringify(data))),
    shareReplay(),//because products$ observable is used in two more pipes and both will call database on subscription
    );

    // RxJS OPerator shareReplay
    //shares its input observable with other subscribers
    //replays the defined number of emissions on subscription
    //shareReplay(1)
    //used for
    //1. Sharing Observables
    //2. Caching Data in the application
    //3. Replaying emissions to Late subscribers

    //shareReplay is a multicast operator
    //Returns a Subject that share a single subscription to
    //the underlying source.
    //Takes in an optional buffer size, which is the number of items cached a
    //and replayed
    //On a subscribe , it replays the specified number of emmissions
    //the items stays cached forever, even after there are
    //no more subscribers

    allProductsWithCategory$ = combineLatest([this.allProducts$,this.productCategoryService.allCategories$]).pipe(
      map(([products,categories]) => 
        products.map(product=> ({
          ...product,
           searchKey: product.name,
          category: categories.find(c => product?.categoryId === c.id)?.name ?? 'No category'} as Product))       
      ),
      tap(val => console.log('Products with category:',JSON.stringify(val))),
      shareReplay()
      );

      allProductsWithCategoryFilter$ = combineLatest([this.allProductsWithCategory$,this.categorySelectedAction$.pipe(
        startWith('all')
      )]).pipe(
        map(([products, selectedCategoryId]) => 
        {
          console.log('selectedCategoryId:', selectedCategoryId);
          return products.filter(product => 
            (selectedCategoryId && selectedCategoryId != 'all') ? product.categoryId === selectedCategoryId: true)
          } )
      
      ); 

      //! IN FIREBASE SINCE product$ stream is live updated by firebase database
      // we don't need an add product scanner, however if it's an http products get then we can use below code
      //private productInsertedSubject = new Subject<Product>();
      //productInsertedAction$ = this.productInsertedSubject.asObservable();
      // allProductsWithAdd$ = merge(
       // this.allProducts$,
       // this.productInsertedAction$
      //).pipe(
      //   scan((acc,value) =>
      //    (value instanceof Array) ? [...value]: [...acc,value], [] as Product[])
      // );
      //
      // then use allProductsWithAdd$ instead of allProducts$ 

 products$ = this.categorySelectedAction$.pipe(
  switchMap(catId => this.getProductQuery(catId)),
  catchError(this.handleError),
  map((snaps) => convertSnaps<Product>(snaps)),
  map(products => products.map(product=> ({...product, searchKey: product.name} as Product))),
  shareReplay(),//because products$ observable is used in two more pipes and both will call database on subscription
  );
 //product selection
 private productSelectedSubject = new Subject<string>();
 productSelectedAction$ = this.productSelectedSubject.asObservable();
 //Use Combination Operators
 //1. combineLatest : emit combined value when any of the observables emit;won't emit until all observables have emitted at least once
 //2. merge : emits the one value when any of the observables emit ; use when customers from one end point and potential customers from another end point
 //3. forkJoin : when all observables complete, emit the last value from each observable into an array

 selectedProductChanged(productId:string):void{
  this.productSelectedSubject.next(productId);
}

//productsWithCategor$ = this.product$.pipe(withLatestFrom(this.productCategories$))
//cannot be used because if the source observable (products$) complete before the
//observable this.productCategories$ the result output will complete
//without emitting any value

selectedProduct$ = combineLatest([this.products$,this.productSelectedAction$,this.productCategoryService.allCategories$]).pipe(
  map(([products,selectedProductId,categories]) => {
    const product = products.find((product:any) =>  product?.id === selectedProductId);

      return {...product,
        category: categories.find(c => product?.categoryId === c.id)?.name ?? 'No category',
        searchKey: product?.name} as Product 

     
  }),
  tap(val => console.log('selected product',val)),
  shareReplay()
  );

//Get supplier for product

//For products having single supplier// NOT USED

// productSupplier$ = this.selectedProduct$.pipe(
//   switchMap(product => this.productSupplierService.getSupplier(product.suppliers[0]))
// )


//For Products having Multiple suppliers
//First kind of Implementation: Not ideal but works

//NOT USED

// productSuppliers1$ = this.selectedProduct$.pipe(
//   tap(val => console.log('selected product in suppliers',val)),
//   switchMap((product:Product) => 
//       //from function creates an inner observable which emits its array value and completes
//        // if from is not used then since  selectedProduct$ is an observbale which never completes
//        // our observable stream will never complete
//  // this technique is also used to encapsulate operations which may generate error
//   // and we dont want error to complete our outer observables
//     from(product.suppliers).pipe(
//       mergeMap((supplierId: string) => this.productSupplierService.getSupplier(supplierId)),
//       //if we do not use toArray(); it will give stream of Obaservable<Supplier>
//       toArray()
//     )
// )
// )



//Second implementation
//forkJoin combines multiple input observables and emit only the
//last emitted value from each of the input observables as an array
   //doesnt emit untill all observables completes
   //Only emit one time

   //Use: 
   //1. To process several http requests
productSuppliers$ = this.selectedProduct$.pipe(
  //Boolean will return true if value is true and false if value is false,undefined or null
  filter(product => Boolean(product)),
  tap(val => console.log('selected product in suppliers',val)),
  switchMap(product =>
    {
      console.log('product',product);
return product?.suppliers ? forkJoin(product.suppliers.map(supplierId => this.productSupplierService.getSupplier(supplierId).pipe(first()))) : of([])
  }
   
     ),
  //first() used because forkJoin only works for observables that complete and firebase get request never completes
  //in case of http request first() was not required
  tap(val => console.log('selected product in suppliers1',val)),
)

   private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error('Inside handle error');
    console.error(err);
    //All 3 return statements below are correct
    return throwError(errorMessage);
    //return throwError(()=> new Error('Could not retrieve'));
   // throw new Error('Could not retrieve');
  }

  addProduct(
    name: string,
    productCode:string,
    desc: string,
    categoryId: string,
    price:number,
    quantityInStock:number,
    suppliers: [string]
  ) {
    console.log("In add product", this.user);
    this.coreService.setIsLoading(true);
    if (this.user) {
      // this.uiService.presentLoading('Submitting Complaint...');
      const newProduct = {
        name,
        productCode,
        desc,
        categoryId,
        price,
        quantityInStock,
        suppliers,
        createdOn: new Date(),
        createdBy: this.user.uid,
      };
      //delete newComplaint.id;
      console.log("In add product", JSON.stringify(newProduct));
      return from(this.productCollection.add({ ...newProduct }));
    } else {
      this.coreService.presentSnackbar("Please Login to add product item!");
      return;
    }
  }
  getProduct(id: string) {
    return this.db.doc<Product>(`products/${id}`);
  }
  updateProduct(id: string, data: Partial<Product>) {
    if (this.user) {
      return from(
        this.getProduct(id).update({
          ...data,
          updatedOn: new Date(),
          updatedBy: this.user.uid,
        })
      );
    } else {
      this.coreService.presentSnackbar("Please Login to update product item!");
    }
  }

}
