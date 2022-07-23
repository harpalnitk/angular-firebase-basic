import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarouselRoutingModule } from './carousel-routing.module';
import { CarouselExampleComponent } from './carousel-example.component';
import { CarouselComponent } from './carousel/carousel.component';
import { CarouselItemComponent } from './carousel-item/carousel-item.component';


@NgModule({
  declarations: [
    CarouselExampleComponent,
    CarouselComponent,
    CarouselItemComponent
  ],
  imports: [
    CommonModule,
    CarouselRoutingModule
  ]
})
export class CarouselModule { }
