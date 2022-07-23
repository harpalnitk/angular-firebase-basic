import { InventoryDataSource } from './../inventory.datasource';
import { CoreService } from './../../../core/core.service';
import { Inventory } from './../../../model/inventory';


import { InventoryDialogComponent } from "./../inventory-dialog/inventory-dialog.component";

import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { finalize, shareReplay, tap } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { InventoryService } from '../inventory.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: "inventory-table",
  templateUrl: "./inventory-table.component.html",
  styleUrls: ["./inventory-table.component.scss"],
})
export class InventoryTableComponent implements OnInit, AfterViewInit {
 // isLoading$: Observable<boolean>;
  displayedColumns: string[] = [
    "index",
    "name",
    "type", //not useing typeView because insorting need column name which is in database
    "make",
    "createdOn",
    "count",
    "actions",
  ];
  width: string;

  dataSource: InventoryDataSource;
  @ViewChild(MatSort) sort: MatSort;
  //@ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private inventoryService: InventoryService,
    private coreService: CoreService,
    private dialog: MatDialog,
  ) {
    this.width = this.coreService.getWidth();
    // this.isLoading$ = this.coreService.getIsLoading().pipe(
    //   shareReplay()
    // );
  }

  ngOnInit(): void {
   
    //this.loadInventory();
   // this.inventoryService.allInventoryForView$.subscribe(val => console.log('Val',val));
   this.dataSource = new InventoryDataSource(this.inventoryService);
        this.dataSource.loadInventory();
  }

  // loadInventory(){
  //   this.coreService.setIsLoading(true);
  //   this.inventoryService
  //     .loadAllInventory()
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

  addInventory() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = this.width;

    //dialogConfig.data = {};

    this.dialog.open(InventoryDialogComponent, dialogConfig)
    .afterClosed()
    .subscribe(val=>{
         // this.loadInventory();
    });
  }


  ngAfterViewInit() {
    // if (this.dataSource) {
    //   this.dataSource.sort = this.sort;
    // }
    // this.paginator.page
    // .pipe(
    //     tap(() => this.loadInventoryPage())
    // )
    // .subscribe();
    this.sort.sortChange
    .pipe(
        tap(() => this.loadInventoryPage())
    )
    .subscribe();
  }

  loadInventoryPage() {
    this.dataSource.changeInventoryLoadParams(
        '',
        this.sort.active,
        this.sort.direction);
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
   // this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onDeleteInventory(id: string){
    this.coreService.setIsLoading(true);
      this.inventoryService.delete(id)
      .pipe(
        finalize(() => {
          this.coreService.setIsLoading(false);
        })
      )
      .subscribe((value) => {
        this.coreService.presentSnackbar('Inventory item deleted successfully');
       // this.loadInventory();
      },
      err=>{
        console.log(err);
      }
      );;
  }
}
