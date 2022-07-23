import { CoreService } from './../../../core/core.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject,combineLatest, OperatorFunction } from 'rxjs';
import {  catchError, debounceTime, distinctUntilChanged, filter, finalize, map, merge, startWith, switchMap, tap } from 'rxjs/operators';
import { PostCategory } from '../post-categories/post-category';
import { PostCategoryService } from '../post-categories/post-category.service';
import { Post } from './post';
import { PostService } from './post.service';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  isLoading$: Observable<boolean>;
  title = 'Posts by Category';
  displayedColumns: string[] = ['index', 'title', 'body', 'category'];

  constructor(private postService: PostService,
    private postCategoryService: PostCategoryService,
    private coreService: CoreService,) {
      this.isLoading$ = this.coreService.getIsLoading();
     }
    
  categoryFormControl = new FormControl<PostCategory|null>(null);

  options$ = this.postCategoryService.allCategoriesSorted$;
  filteredOptions$: Observable<PostCategory[]>;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  postsForCategory$ = this.postService.postsForCategory$.pipe(

    map((posts:any) => {
     
      if (posts.length === 0) {
        if(this.categoryFormControl.value.name)
        {
          this.setErrorMessage(`No posts found for category ` + this.categoryFormControl.value.name);
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
  );;

  ngOnInit() {
    this.filteredOptions$ = this.categoryFormControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        switchMap(name => name ? this.filter(name || '') : this.options$)
      );
  }

  displayFn(postCategory: PostCategory): string {
    return postCategory && postCategory.name ? postCategory.name : '';
  }

  filter(val: string): Observable<PostCategory[]> {
    return this.options$.pipe(
      map(response => response.filter(option => { 
        return option.name.toLowerCase().indexOf(val.toLowerCase()) > -1
     }))
    );
  }

  //Code for displaying Table
  categorySelected(event,category: PostCategory): void {
    if(event.isUserInput) {
    this.coreService.setIsLoading(true);
    this.postService.selectedCategoryChanged(category.id);
  }
  }
  setErrorMessage(message: string): void {
    this.errorMessageSubject.next(message);
  }


}
