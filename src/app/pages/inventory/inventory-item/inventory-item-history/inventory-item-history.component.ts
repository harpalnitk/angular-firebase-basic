import { InventoryHistory } from "./../../../../model/inventory-history";
import { InventoryService } from "./../../inventory.service";
import { CoreService } from "./../../../../core/core.service";
import { Observable, Subscription } from "rxjs";
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { finalize } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "inventory-item-history",
  templateUrl: "./inventory-item-history.component.html",
  styleUrls: ["./inventory-item-history.component.scss"],
})
export class InventoryItemHistoryComponent
  implements OnInit, AfterViewInit, OnDestroy {
  isLoading$: Observable<boolean>;
  displayedColumns: string[] = ["index", "action", "qty", "date", "userName"];
  dataSource: MatTableDataSource<InventoryHistory>;
  @ViewChild(MatSort) sort: MatSort;
  inventoryId;
  sub: Subscription;

  constructor(
    private coreService: CoreService,
    private inventoryService: InventoryService,
    private route: ActivatedRoute
  ) {
    this.isLoading$ = this.coreService.getIsLoading();
  }

  ngOnInit(): void {
    //On changes in history reload the data
    this.sub = this.inventoryService
      .getHistoryEventNotification()
      .subscribe(() => {
        if (this.inventoryId) {
          this.loadInventoryItemHistory(this.inventoryId);
        }
      });

    this.route.paramMap.subscribe((params) => {
      this.inventoryId = params.get("id");
      this.loadInventoryItemHistory(this.inventoryId);
    });
  }
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  loadInventoryItemHistory(id: string) {
    this.coreService.setIsLoading(true);
    this.inventoryService
      .loadInventoryItemHistory(id)
      .pipe(
        finalize(() => {
          this.coreService.setIsLoading(false);
        })
      )
      .subscribe(
        (value) => {
          console.log(value);
          this.dataSource = new MatTableDataSource(value);
          this.dataSource.sort = this.sort;
        },
        (err) => {
          console.log(err);
        }
      );
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
