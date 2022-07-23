import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RxjsCourseComponent } from './rxjs-course.component';

const routes: Routes = [{ path: '', component: RxjsCourseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RxjsCourseRoutingModule { }
