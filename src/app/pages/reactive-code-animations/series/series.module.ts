import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';


import { SeriesRoutingModule } from './series-routing.module';
import { SeriesComponent } from './series.component';


@NgModule({
  declarations: [
    SeriesComponent
  ],
  imports: [
    SharedModule,
    SeriesRoutingModule
  ]
})
export class SeriesModule { }
