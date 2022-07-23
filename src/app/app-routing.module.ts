import { WelcomeComponent } from './core/welcome/welcome.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    { path: 'home', component: WelcomeComponent },
    { path: '',   redirectTo: '/home', pathMatch: 'full' },
    { path: 'about', loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule) },
    { path: 'inventory', loadChildren: () => import('./pages/inventory/inventory.module').then(m => m.InventoryModule) },
    { path: 'courses', loadChildren: () => import('./pages/courses/courses.module').then(m => m.CoursesModule) },
    { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
    { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) },
    { path: 'blog', loadChildren: () => import('./pages/blog/blog.module').then(m => m.BlogModule) },
    { path: 'products', loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule) },
    { path: 'lazy-loading', loadChildren: () => import('./pages/lazy-loading/lazy-loading.module').then(m => m.LazyLoadingModule) },
    { path: 'forms', loadChildren: () => import('./pages/forms/forms.module').then(m => m.ExampleFormModule) },
    { path: 'reactive-code-animations', loadChildren: () => import('./pages/reactive-code-animations/reactive-code-animations.module').then(m => m.ReactiveCodeAnimationsModule) },
    { path: 'rxjs-course', loadChildren: () => import('./pages/rxjs-course/rxjs-course.module').then(m => m.RxjsCourseModule) },
    {
        path: "**",
        redirectTo: '/home'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
