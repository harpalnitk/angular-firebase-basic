import { ProductSupplier } from './product-supplier';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { CoreService } from './../../../core/core.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import {convertSnaps} from '../../../services/db-utils';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductSupplierService {

  constructor(private db: AngularFirestore,
    private afAuth: AngularFireAuth,
     private coreService: CoreService,) { }

     allSuppliers$ = this.db.collection("productsSupplier").snapshotChanges()
     .pipe(
       map((snaps) => convertSnaps<ProductSupplier>(snaps)),
       catchError(this.handleError),
       shareReplay(1) // shareReplay will cache the values and thus server will be accessed only once
     );
 

 // Sort the suppliers for the type ahead display
 allSuppliersSorted$ = this.allSuppliers$.pipe(
   map(suppliers => this.sortSuppliers(suppliers)),
   shareReplay(1)
 );
 sortSuppliers(suppliers: ProductSupplier[]): ProductSupplier[] {
  return suppliers.sort((a, b) => a.name < b.name ? -1 : 1);
}

//SupplierForAGivenId

getSupplier(supplierId: string){
  console.log('Inside getSupplier',supplierId);
  return this.db.doc<ProductSupplier>(`productsSupplier/${supplierId}`).valueChanges({idField: 'id'});
}
 
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
  console.error(err);
  return throwError(errorMessage);
}
}
