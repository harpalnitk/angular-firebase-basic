import { ProductsService } from './../products.service';
import { Product } from '../product';


import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of, EMPTY} from "rxjs";

import {catchError, finalize, tap} from "rxjs/operators";




export class ProductDataSource implements DataSource<Product> {

    private productsSubject = new BehaviorSubject<Product[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private productService: ProductsService) {

    }

    loadProduct() {

        this.loadingSubject.next(true);

        this.productService.allProductsWithCategoryFilter$.pipe(
                catchError((err) => {
                    console.error('Error in product DataSource',err);
                    return of([])
                    //return EMPTY;     
                 }),
                tap(() => this.loadingSubject.next(false)) 
               
        ).subscribe(products => this.productsSubject.next(products));

    }

    changeProductLoadParams(                
        filter?:string,
        sortColumn?:string,
        sortDirection?:any,
        pageIndex?:number,
        pageSize?:number){

        console.log(`filter:${filter} sortColumn:${sortColumn} sortDirection:${sortDirection} pageIndex:${pageIndex} pageSize:${pageSize}`)
        // this.productService.selectedColumnChanged(sortColumn);
         //this.productService.selectedOrderChanged(sortDirection);
    }

    connect(collectionViewer: CollectionViewer): Observable<Product[]> {
       //console.log("Connecting data source");
        return this.productsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.productsSubject.complete();
        this.loadingSubject.complete();
    }

}