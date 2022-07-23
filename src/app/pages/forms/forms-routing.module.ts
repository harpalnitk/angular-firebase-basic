import { ReactiveFormComponent } from './reactive-form/reactive-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsComponent } from './forms.component';
import { CustomerComponent } from './customer/customer.component';
import { TeamComponent } from './team/team.component';
import { TemplateFormComponent } from './template-form/template-form.component';

const routes: Routes = [{ path: '', component: FormsComponent,
children:[
  { path: 'team', component: TeamComponent },
  { path: 'customer', component: CustomerComponent },
  { path: 'reactive', component: ReactiveFormComponent },
  { path: 'template', component: TemplateFormComponent }
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
