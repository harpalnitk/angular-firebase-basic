import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RxjsCourseRoutingModule } from './rxjs-course-routing.module';
import { RxjsCourseComponent } from './rxjs-course.component';
import { BasicComponent } from './basic/basic.component';


@NgModule({
  declarations: [
    RxjsCourseComponent,
    BasicComponent
  ],
  imports: [
    CommonModule,
    RxjsCourseRoutingModule
  ]
})
export class RxjsCourseModule { }
