import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClickCounterComponent } from './click-counter.component';

const routes: Routes = [{ path: '', component: ClickCounterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClickCounterRoutingModule { }
