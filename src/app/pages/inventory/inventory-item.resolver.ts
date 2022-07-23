import { CoreService } from './../../core/core.service';
import { Inventory } from './../../model/inventory';

import { InventoryService } from './inventory.service';
import { Injectable } from '@angular/core';
import {
   Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryItemResolver implements Resolve<Inventory> {

  constructor(private inventoryService: InventoryService,
    private coreService: CoreService){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Inventory> {
    const inventoryId = route.paramMap.get('id');
    console.log('Inside InventoryItemResolver', inventoryId);
    //resolver automatically subscribes and return the data of observable
    //but observable needs to complete
    //in firebase observable does not complete
    this.coreService.setIsLoading(true);
    return this.inventoryService.getInventoryData(inventoryId);
  }
}
