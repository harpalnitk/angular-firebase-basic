import { PostsGroupbyComponent } from './posts-groupby/posts-groupby.component';
import { PostsForUserComponent } from './posts-for-user/posts-for-user.component';
import { PostsComponent } from './posts/posts.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog.component';

const routes: Routes = [{ path: '', component: BlogComponent,
children: [
{ path: 'posts', component: PostsComponent },
{ path: 'user', component: PostsForUserComponent},
{ path: 'grouped', component: PostsGroupbyComponent}
] },

{ path: '', redirectTo: '', pathMatch: 'full' },
{ path: '**', component: BlogComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
