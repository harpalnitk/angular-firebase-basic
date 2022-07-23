import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { PostService } from '../posts/post.service';

@Component({
  selector: 'posts-groupby',
  templateUrl: './posts-groupby.component.html',
  styleUrls: ['./posts-groupby.component.scss']
})
export class PostsGroupbyComponent implements OnInit {
  title = 'All Posts Grouped by Category';

  // Provide array of tuples
  //! this one is not working ; TODO check later
  postsGroupedByCategory$ = this.postService.postsGroupedByCategory$.pipe(
    tap(val=> console.log('val',val))
  );

  // Alternate: Provide key/value pairs
  postsGroupedByCategoryKeyValue$ = this.postService.postsGroupedByCategoryKeyValue$.pipe(
    tap(val=> console.log('val',val))
  );

  constructor(private postService: PostService) { }

  ngOnInit(): void {
  }

}
