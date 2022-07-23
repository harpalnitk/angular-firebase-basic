import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveCodeAnimationsRoutingModule } from './reactive-code-animations-routing.module';
import { ReactiveCodeAnimationsComponent } from './reactive-code-animations.component';


@NgModule({
  declarations: [
    ReactiveCodeAnimationsComponent
  ],
  imports: [
    CommonModule,
    ReactiveCodeAnimationsRoutingModule
  ]
})
export class ReactiveCodeAnimationsModule { }
