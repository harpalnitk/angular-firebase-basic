import { DynamicComplexFormComponent } from './dynamic-complex-form/dynamic-complex-form.component';
import { DynamicComponentLoadingScamComponent } from './dynamic-component-loading-scam/dynamic-component-loading-scam.component';
import { DynamicComponentLoadingComponent } from './dynamic-component-loading/dynamic-component-loading.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LazyLoadingComponent } from './lazy-loading.component';
import { DynamicSimpleFormComponent } from './dynamic-simple-form/dynamic-simple-form.component';

const routes: Routes = [
  { 
    path: '', component: LazyLoadingComponent,
    children:[{path: 'home', component: HomeComponent},
              {path: 'dynamic-component-loading', component: DynamicComponentLoadingComponent },
              {path: 'dynamic-component-loading-scam', component: DynamicComponentLoadingScamComponent },
              {path: 'dynamic-complex-form', component: DynamicComplexFormComponent },
              {path: 'dynamic-simple-form', component: DynamicSimpleFormComponent },
              {path: '', redirectTo: 'home', pathMatch: 'full'}] 
},
{ path: '', redirectTo: '', pathMatch: 'full' },
{ path: '**', component: LazyLoadingComponent }
]
;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LazyLoadingRoutingModule { }
