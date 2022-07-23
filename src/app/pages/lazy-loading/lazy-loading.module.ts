import { DynamicFormControlComponent } from './dynamic-form-control/dynamic-form-control.component';
import { DynamicSimpleFormComponent } from './dynamic-simple-form/dynamic-simple-form.component';
import { DynamicComponentLoadingScamComponent } from './dynamic-component-loading-scam/dynamic-component-loading-scam.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyLoadingRoutingModule } from './lazy-loading-routing.module';
import { LazyLoadingComponent } from './lazy-loading.component';
import { HomeComponent } from './home/home.component';
import { BusinessCardComponent } from './lazy/business-card/business-card.component';
import { UserListComponent } from './lazy/user-list/user-list.component';
import { DynamicComponentLoadingComponent } from './dynamic-component-loading/dynamic-component-loading.component';
import { DynamicComplexFormComponent } from './dynamic-complex-form/dynamic-complex-form.component';
import { DynamicIoModule } from 'ng-dynamic-component';


@NgModule({
  declarations: [
    LazyLoadingComponent,
    HomeComponent,
    BusinessCardComponent,
    UserListComponent,
    DynamicComponentLoadingComponent,
    DynamicComponentLoadingScamComponent,
    DynamicSimpleFormComponent,
    DynamicComplexFormComponent,
    DynamicFormControlComponent,
  ],
  imports: [
    SharedModule,
    LazyLoadingRoutingModule,
    DynamicIoModule // needed for dynamic complex form component
  ]
})
export class LazyLoadingModule { }
