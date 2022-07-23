import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { ArrayToStringWithDelimiter } from './pipes/array-to-string-with-delimiter';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [ArrayToStringWithDelimiter, ImagePickerComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule
  ],
  exports: [
    CommonModule,
    SharedRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    ArrayToStringWithDelimiter,
    ImagePickerComponent,
    HttpClientModule,
    HttpClientJsonpModule, // used onli in lazy-loading-recipe module
  ]
})
export class SharedModule { }
