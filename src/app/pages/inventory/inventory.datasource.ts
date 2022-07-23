import { InventoryService } from './inventory.service';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of} from "rxjs";

import {catchError, finalize} from "rxjs/operators";
import { Inventory } from '../../model/inventory';



export class InventoryDataSource implements DataSource<Inventory> {

    private inventoriesSubject = new BehaviorSubject<Inventory[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private inventoryService: InventoryService) {

    }

    loadInventory() {

        this.loadingSubject.next(true);

        // this.coursesService.findLessons(courseId, filter, sortDirection,
        //     pageIndex, pageSize).pipe(
        //         catchError(() => of([])),
        //         finalize(() => this.loadingSubject.next(false))
        //     )
        //     .subscribe(lessons => this.lessonsSubject.next(lessons));
        this.inventoryService.allInventoryForView$.pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)) 
        ).subscribe(inventories => this.inventoriesSubject.next(inventories));

    }

    changeInventoryLoadParams(                
        filter?:string,
        sortColumn?:string,
        sortDirection?:any,
        pageIndex?:number,
        pageSize?:number){

        console.log(`filter:${filter} sortColumn:${sortColumn} sortDirection:${sortDirection} pageIndex:${pageIndex} pageSize:${pageSize}`)
         this.inventoryService.selectedColumnChanged(sortColumn);
         this.inventoryService.selectedOrderChanged(sortDirection);
    }

    connect(collectionViewer: CollectionViewer): Observable<Inventory[]> {
        console.log("Connecting data source");
        return this.inventoriesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.inventoriesSubject.complete();
        this.loadingSubject.complete();
    }

}