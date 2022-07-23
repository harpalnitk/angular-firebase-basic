import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveCodeAnimationsComponent } from './reactive-code-animations.component';

const routes: Routes = [{ path: '', component: ReactiveCodeAnimationsComponent,
children:[
  { path: 'click-counter', loadChildren: () => import('./click-counter/click-counter.module').then(m => m.ClickCounterModule) },
   { path: 'carousel', loadChildren: () => import('./carousel/carousel.module').then(m => m.CarouselModule) }, 
   { path: 'series', loadChildren: () => import('./series/series.module').then(m => m.SeriesModule) }
  ] },
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReactiveCodeAnimationsRoutingModule { }
