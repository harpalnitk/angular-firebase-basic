import { FormsModule } from '@angular/forms';
import { CastPipe } from './reactive-form/cast.pipe';
import { NgModule } from '@angular/core';

import { FormsRoutingModule } from './forms-routing.module';
import { FormsComponent } from './forms.component';
import { TeamComponent } from './team/team.component';
import { CustomerComponent } from './customer/customer.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';
import { FormModalComponent } from './reactive-form/form-modal/form-modal.component';
import { TemplateFormComponent } from './template-form/template-form.component';
import { ValidateMusicalNumberDirective } from './template-form/validate-musical-number.directive';



@NgModule({
  declarations: [
    FormsComponent,
    TeamComponent,
    CustomerComponent,
    ReactiveFormComponent,
    FormModalComponent,
    CastPipe,
    TemplateFormComponent,
    ValidateMusicalNumberDirective
  ],
  imports: [
    SharedModule,
    FormsModule,
    FormsRoutingModule
  ]
})
export class ExampleFormModule { }
