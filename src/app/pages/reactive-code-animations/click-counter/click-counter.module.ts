import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClickCounterRoutingModule } from './click-counter-routing.module';
import { ClickCounterComponent } from './click-counter.component';
import { LineChartComponent } from './line-chart/line-chart.component';


@NgModule({
  declarations: [
    ClickCounterComponent,
    LineChartComponent
  ],
  imports: [
    CommonModule,
    ClickCounterRoutingModule
  ]
})
export class ClickCounterModule { }
