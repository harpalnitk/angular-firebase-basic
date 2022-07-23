import { InventoryConfigService, SelectValues } from './inventory-config/inventory-config.service';
import { User } from './../../model/user';
import { InventoryHistory } from './../../model/inventory-history';

import {convertSnaps} from '../../services/db-utils';
import { CoreService } from './../../core/core.service';

import { Inventory } from './../../model/inventory';

import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  Query
} from '@angular/fire/firestore';

import { from, Observable, of, Subject, throwError, combineLatest, BehaviorSubject } from 'rxjs';

import { catchError, finalize, first, map, switchMap, tap } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  inventoryCollection: AngularFirestoreCollection<Inventory>;
  user: User;



  //history$
   history$ = new Subject()

   // Input Parameters for fetching inventory
   selectedColumnSubject = new BehaviorSubject<string>('createdOn');
   selectedColumn$ = this.selectedColumnSubject.asObservable();
   selectedColumnChanged(column: string): void {
    this.selectedColumnSubject.next(column);
  }
   //Acsendinf Descending
   selectedOrderSubject = new BehaviorSubject<'asc'|'desc'>('desc');
   selectedOrder$ = this.selectedOrderSubject.asObservable();
   selectedOrderChanged(order: 'asc'|'desc'): void {
    this.selectedOrderSubject.next(order);
  }
   allInventoryQuery$ = combineLatest([
     this.selectedColumn$,
     this.selectedOrder$
   ]).pipe(
      switchMap(([column,order])=> { 
        console.log(`column:${column} order:${order}`)
        return this.db.collection<Inventory>('inventory',
      (ref) => ref.orderBy(column, order)).snapshotChanges()
   }
      )
   )

   allInventory$ = this.allInventoryQuery$
   .pipe(
     tap(val=> console.log('query', val)),
    map((snaps) => convertSnaps<Inventory>(snaps)),
    tap(val=> console.log('snaps', val)),
    //first(), // we don't want observable to continuously run
    catchError(this.handleError)
  );

    // Match up inventory with their make, type and subType ViewValues.
    allInventoryForView$ = combineLatest([
      this.allInventory$ ,
      this.inventoryConfigService.allMakes$,
      this.inventoryConfigService.allTypes$
    ]).pipe(
      //first(), // we don't want observable to continuously run
      map(([inventories, makes, types]) => this.mapInventoriesForView(inventories, makes,types)),

    );

    mapInventoriesForView(inventories: Inventory[], makes: SelectValues[], types: SelectValues[]): Inventory[] {
      return inventories.map(inventory =>  this.mapInventoryForView(inventory, makes, types));
    }
    mapInventoryForView(inventory: Inventory, makes: SelectValues[], types: SelectValues[]): Inventory {
      console.log('mapInventoryForView Data',inventory);
        let makeView = makes.find(c => inventory.make === c.value)?.viewValue || 'No Make';
        let type = types.find(c => inventory.type === c.value);
        let typeView = type?.viewValue || 'No Type';
        let subTypeView = type.subType.find(c => inventory.subType === c.value)?.viewValue || 'No Sub Type';
        return ({
        ...inventory,
        makeView,
        typeView,
        subTypeView
        }) as Inventory 
    }


  getHistoryEventNotification(){
     return this.history$.asObservable();
  }

  constructor(private db: AngularFirestore,
    private afAuth: AngularFireAuth,
     private coreService: CoreService,
     private inventoryConfigService: InventoryConfigService) {

    this.inventoryCollection = this.db.collection<Inventory>('inventory');

    this.afAuth.authState.subscribe(user=> this.user = user);
   }

  //  loadAllInventory(): Observable<Inventory[]> {
   
  //   return this.db
  //     .collection(
  //       "inventory",
  //       (ref) => ref.orderBy("createdOn", "desc")
  //       // ref.where("seqNo","==",5)
  //       // .where("lessonsCount",=)
  //     )
  //     .snapshotChanges()
  //     .pipe(
  //       map((snaps) => convertSnaps<Inventory>(snaps)),
  //       first(),
  //       map(val=> val.map(inventory => this.inventoryConfigService.convertInventoryForView(inventory)))
  //       // if we add first rxjs operator here then
  //       //the observable will complete after fetching
  //       //valuse from firestore and behave like normal http
  //       //observable; firebase continous changes will not be recorded
  //       //take(5)///////////////////
  //       // will receive only first 5 changes and after that if any changes are made in server
  //       //the same will not be reflected
  //     );
  // }


   addInventory(
    name: string,
    type: string,
    subType:string,
    make: string,
    count:number = 0
  ) {
    console.log('In add inventory', this.user);
    this.coreService.setIsLoading(true);
    if (this.user) {
     // this.uiService.presentLoading('Submitting Complaint...');
      const newInventory = {name, type,subType,make,count, createdOn: new Date(), createdBy: this.user.uid}
      //delete newComplaint.id;
      console.log('In add inventory', JSON.stringify(newInventory));
      return from(this.inventoryCollection.add({ ...newInventory }));

    } else {
      this.coreService.presentSnackbar('Please Login to add inventory item!');
      return;
    }
  }

  addEventToItemHistory(
    inventoryItemId: string,
    action: string,
    qty:string
  ) {
    console.log('In  addEventToItemHistory', this.user);
      const newEvent = {
        action: action,
        qty ,
        userId: this.user.uid,
        userName: this.user.displayName ? this.user.displayName : `User`,
        date: new Date() 
      }
      console.log('In  addEventToItemHistory', JSON.stringify(newEvent));
      return from(this.getInventory(inventoryItemId).collection('history').add({ ...newEvent }))
      .pipe(
        first()
      ).subscribe(()=>{
       this.history$.next();
       console.log('Event History updated succesfully');
      },
      err=>{
        console.log('Error in updating Event History ',err);
      }
      );
 }


   getInventory(id: string) {
    return this.db.doc<Inventory>(`inventory/${id}`);
  }
  
  getInventoryData(id): Observable<Inventory> {
    console.log('getInventory Data');
    return combineLatest([
      this.getInventory(id).valueChanges({ idField: 'id' }),
      this.inventoryConfigService.allMakes$,
      this.inventoryConfigService.allTypes$
    ]).pipe(
      first(), // Item resolver shows data only when observable completes.
      map(([inventory, makes, types]) => this.mapInventoryForView(inventory, makes,types)),
    );
  }





  delete(id: string) {
    if(this.user){
      return  from(this.getInventory(id).delete());
    }else{
      this.coreService.presentSnackbar('Please Login to delete inventory item!');
    }
  }
  updateInventory(id: string, data: Partial<Inventory>) {
    if(this.user){
      return  from(this.getInventory(id).update({...data, updatedOn: new Date(), updatedBy: this.user.uid}));
    }else{
      this.coreService.presentSnackbar('Please Login to update inventory item!');
    }
  }





  async runTransaction(id: string, changedCount:number) {


    if(this.user){
      this.coreService.setIsLoading(true);
      try {
        const newCount = await this.db.firestore.runTransaction(
          async (transaction) => {
            console.log("Running Tansaction (Inventory Count Change)...");
            const inventoryRef = this.db.doc(`/inventory/${id}`).ref;
            //get document snapshot
            const snap = await transaction.get(inventoryRef);
            const inventory = <Inventory>snap.data();
            const count = changedCount;
            //write count back to database
            transaction.update(inventoryRef, { count });
            //always pass result through return
            //and never assign new value to component level variables
            return count;
          }
        );
        this.addEventToItemHistory(id,'QUANTITY CHANGED',""+newCount);
        this.coreService.setIsLoading(false);
        return newCount;
      } catch (error) {
        this.coreService.setIsLoading(false);
        console.log('Error in changing inventory Count', error);
        this.coreService.setMessage('Error in changing inventory Count!!');
      }
    }else{
      this.coreService.presentSnackbar('Please Login to change inventory count!');
    }
  }

  loadInventoryItemHistory(inventoryItemId: string){
    return this.getInventory(inventoryItemId)
      .collection(
        "history",
        (ref) => ref.orderBy("date", "desc")
      )
      .snapshotChanges()
      .pipe(
        map((snaps) => convertSnaps<InventoryHistory>(snaps)),
        first()
      );
  }















    //Use only once for loading data on firebase server
  //then delete it
  saveConfigData(){
    const data ={
    types:  [
      { value: "t-0", viewValue: "Part", subType: [
        { value: "st-0", viewValue: "Winshield" },
        { value: "st-1", viewValue: "Bonnet" },
        { value: "st-2", viewValue: "Mirror" },
        { value: "st-3", viewValue: "Seats" },
      ] },
      { value: "t-1", viewValue: "Denting", subType: [
        { value: "st-0", viewValue: "Paint" },
        { value: "st-1", viewValue: "Spray" },
        { value: "st-2", viewValue: "Color" },
        { value: "st-3", viewValue: "Brush" },
      ]  },
      { value: "t-2", viewValue: "Accessory" , subType: [
        { value: "st-0", viewValue: "Seat Cover" },
        { value: "st-1", viewValue: "Lights" },
        { value: "st-2", viewValue: "Door Wiser" },
        { value: "st-3", viewValue: "Rims" },
      ] },
      { value: "t-3", viewValue: "Oil", subType: [
        { value: "st-0", viewValue: "Coolant" },
        { value: "st-1", viewValue: "Engine Oil" },
        { value: "st-2", viewValue: "Brake Oil" },
        { value: "st-3", viewValue: "Clutch Oil" },
      ]  },
    ],
    makes:  [
      { value: "m-0", viewValue: "Honda" },
      { value: "m-1", viewValue: "Toyota" },
      { value: "m-2", viewValue: "Maruti Suzuki" },
      { value: "m-3", viewValue: "Hyundai" },
      { value: "m-4", viewValue: "Fiat" },
      { value: "m-5", viewValue: "Mahindra" },
      { value: "m-6", viewValue: "Tata" },
      { value: "m-7", viewValue: "Cheverolet" },
      { value: "m-8", viewValue: "Nissan" },
      { value: "m-9", viewValue: "Ford" },
      { value: "m-10", viewValue: "Datsun" },
      { value: "m-11", viewValue: "Kia" },
      { value: "m-12", viewValue: "MG Hector" },
      { value: "m-13", viewValue: "BMW" },
      { value: "m-14", viewValue: "Audi" },
      { value: "m-15", viewValue: "Skoda" },
      { value: "m-16", viewValue: "Bosch" },
      { value: "m-17", viewValue: "Veedol" },
      { value: "m-18", viewValue: "Mobil" },
      { value: "m-19", viewValue: "MFC" },
      { value: "m-19", viewValue: "Castrol" },
    ]
  }
  
  
      return this.db
      .collection(
        "configData",
        //(ref) => ref.orderBy("seqNo")
        // ref.where("seqNo","==",5)
        // .where("lessonsCount",=)
      )
      .add(data)
      .then(value => {
        console.log('configData',value);
      });
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
