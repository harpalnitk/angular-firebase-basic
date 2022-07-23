import { CoreService } from './../../../core/core.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { Post } from '../posts/post';
import { PostService } from '../posts/post.service';

@Component({
  selector: 'posts-for-user',
  templateUrl: './posts-for-user.component.html',
  styleUrls: ['./posts-for-user.component.scss']
})
export class PostsForUserComponent implements OnInit {
  isLoading$: Observable<boolean>;
  title = 'Posts for User';
  displayedColumns: string[] = ['index', 'title', 'body', 'category'];
 
  usernameFormControl = new FormControl('', [
    Validators.required
  ]);
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  postsForUser$ = this.postService.postsForUser$.pipe(
    map(posts => {
      if (posts.length === 0) {
        if(this.usernameFormControl.value){
          this.setErrorMessage(`No posts found for user ` + this.usernameFormControl.value);
        }
       
        return [] as Post[];
      }
      this.setErrorMessage('');
      return posts;
    }),
    tap(() => {
      //tap used because the observable is continous and finalize will be called only in case of error
      this.coreService.setIsLoading(false);
    }),
    finalize(() => {
      this.coreService.setIsLoading(false);
    }),
    catchError(err => {
      this.setErrorMessage(err);
      return [];
    })
  );

  constructor(private postService: PostService,private coreService: CoreService,) {
    this.isLoading$ = this.coreService.getIsLoading();
   }

  ngOnInit(): void {
  }

  getPosts(event:Event): void {
    //console.log(this.usernameFormControl);
   // const userName = (event.target as HTMLInputElement).value;
   this.coreService.setIsLoading(true);
    this.postService.selectedUserChanged(this.usernameFormControl.value);
  }

  setErrorMessage(message: string): void {
    this.errorMessageSubject.next(message);
  }
}
