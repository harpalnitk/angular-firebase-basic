import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { PostsComponent } from './posts/posts.component';
import { PostsForUserComponent } from './posts-for-user/posts-for-user.component';
import { PostsGroupbyComponent } from './posts-groupby/posts-groupby.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BlogComponent,
    PostsComponent,
    PostsForUserComponent,
    PostsGroupbyComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
