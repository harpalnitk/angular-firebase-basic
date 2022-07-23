import { UserService } from './../../../services/user.service';
import { User } from './../../../model/user';
import { PostCategoryService } from '../post-categories/post-category.service';

import { Post } from './post';
import { CoreService } from './../../../core/core.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of, Subject, throwError, zip } from 'rxjs';
import { catchError, concatAll, concatMap, groupBy, map, mergeMap, switchMap, tap, toArray } from 'rxjs/operators';
import {convertSnaps} from '../../../services/db-utils';
import { PostCategory } from '../post-categories/post-category';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  

  user: User;
  constructor(private db: AngularFirestore,
    private coreService: CoreService,
    private categoryService: PostCategoryService,
    private userService: UserService) { 
    
    }


    //!POSTS GROUPBY CATEGORY CODE
  allPosts$ = this.db.collection<Post>('post').snapshotChanges()
  .pipe(
    map((snaps) => convertSnaps<Post>(snaps)),
    catchError(this.handleError)
  );

  // Match up posts with their category name and sort by the category name.
  postsWithCategorySorted$ = combineLatest([
    this.allPosts$,
    this.categoryService.allCategories$
  ]).pipe(
    // Match up each post's category id with the category name
    map(([posts, categories]) => this.mapCategories(posts, categories)),
    // Sort posts by category name
    map(posts => posts.sort((a, b) => (a.category || '') < (b.category || '') ? -1 : 1))
  );

    // Use the groupBy RxJS operator
  // Group all posts by category, sorted on the category name
  // Returns an array where each array element is a tuple
  // containing the categoryId and array of posts
  postsGroupedByCategory$ = this.postsWithCategorySorted$.pipe(
    // concatAll Emit the posts one by one for the groupBy as the groupBy operator 
    //expects input one by one whereas postsWithCategorySorted$ emit an array
    //therefore we use concatAll() to covert array to individual posts
    //emitted one by one
    concatAll(),
    // Emit GroupedObservable, one for each key (categoryId)
    // Key selector; Element selector
    tap(v=>console.log('1',v)),
    groupBy(post => post.categoryId, post => post),
    //tap(v=>console.log('2',v)),
    // Merge each grouped set of posts
    // For each group, zip combines the Observables
    // and emits a tuple with two elements: [number, Post[]]
    // Using toArray ensures that mergeMap doesn't emit until
    // the groupBy is done emitting.
    mergeMap(group => zip(of(group.key), group.pipe(toArray()))),
    tap(v=>console.log('3',v)),
    // Also works with combineLatest
    // mergeMap(group => combineLatest([of(group.key), group.pipe(toArray())])),
    // Emit the tuples into a single array [number, Post[]][]
    toArray(),
    tap(v=>console.log('4',v)),
    //[2,Array(2)],   where 2 is categoryId and Array(2) is array of posts
    //[3,Array(1)]
    //[6,Array(3)]
    //[8,Array(1)]
  );


    // Use array reduce
  // Group all posts by category, sorted on the category name
  // Returns a key/value pair object
  postsGroupedByCategoryKeyValue$ = this.postsWithCategorySorted$.pipe(
    map(posts => posts.reduce((acc: { [key: string]: Post[] }, cur) => {
      // spread the current posts 👇 if there are any for this category
      acc[cur.category || ''] = [...(acc[cur.category || ''] || []), cur];
      return acc;
    }, {}))
  );




  //!POSTS BY USER CODE
     userSubject = new Subject<string>();
     enteredUser$ = this.userSubject.asObservable();

     selectedUserChanged(userName: string): void {
      this.userSubject.next(userName);
    }

     postsForUser$ = this.enteredUser$.pipe(
      switchMap(userName => this.userService.getUserId(userName)),
      switchMap(userId => this.getPostsForUser(userId))
    );

    private getPostsForUser(userId: string): Observable<Post[]> {
      console.log('userId', userId)
      const posts$ = this.db.collection<Post>('post',
      (ref) => ref.where("userId","==",userId)
     ).snapshotChanges()
      .pipe(
          map((snaps) => convertSnaps<Post>(snaps)),
          catchError(this.handleError)
     );
     // combine Latest will not emit unless both posts$ and categories$ have emitted atleast once
      return combineLatest([
        posts$,
        this.categoryService.allCategories$
      ]).pipe(
        map(([posts, categories]) => this.mapCategories(posts, categories)),
      );
    }
    mapCategories(posts: Post[], categories: PostCategory[]): Post[] {
      return posts.map(post => ({
        ...post,
        category: categories.find(c => post.categoryId === c.id)?.name || 'No category'
      }) as Post);
    }

    //!POSTS FOR CATEGORY CODE
    selectedCategorySubject = new BehaviorSubject<number>(0);
    selectedCategory$ = this.selectedCategorySubject.asObservable();
  
    postsForCategory$ = combineLatest([
      this.selectedCategory$,
      this.categoryService.allCategoriesSorted$
    ]).pipe(
      switchMap(([categoryId, categories]) => (categoryId === 0) ? of([]) :
      this.db.collection<Post>('post',
      (ref) => ref.where("categoryId","==",categoryId)).snapshotChanges()
      .pipe(
        catchError(this.handleError),
        map((snaps) => convertSnaps<Post>(snaps)),
        map(posts => this.mapCategories(posts, categories))
       
      ))
    );
    selectedCategoryChanged(categoryId: number): void {
      this.selectedCategorySubject.next(categoryId);
    }

    private handleError(err: any): Observable<never> {
      // in a real world app, we may send the server to some remote logging infrastructure
      // instead of just logging it to the console
      let errorMessage: string;
      if (err.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        errorMessage = `An error occurred: ${err.error.message}`;
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
      }
      console.error(err);
      return throwError(errorMessage);
    }








    //!CODE NOT USED

    // Use the groupBy RxJS operator
  // Group all posts by category, sorted on the category name
  // Returns an array where each array element is an *object*
  // containing the key and array of posts
  // Not currently used.
  postsGroupedByCategory2$ = this.postsWithCategorySorted$.pipe(
    // Emit the array elements one by one for the groupBy
    concatMap(posts => posts),
    groupBy(post => post.categoryId, post => post),
    // Merge each grouped set of posts
    mergeMap(
      group => zip(of(group.key), group.pipe(toArray())).pipe(
        map(([key, posts]) => ({ key, posts }))
      )
    ),
    // Emit one array of the grouped results
    toArray()
  );

  // Use array reduce
  // Group all posts by category, sorted on the category name
  // Returns the same result as the RxJS groupby
  // Not currently used
  postsGroupedByCategory3$ = this.postsWithCategorySorted$.pipe(
    map(posts => posts.reduce((acc: [number, Post[]][], cur) => {
      const index = acc.findIndex(a => a && a[0] === cur.categoryId);
      let postsArray: Post[] = [];
      if (index === -1) {
        postsArray.push(cur);
        acc[acc.length] = [cur.categoryId, postsArray];
      } else {
        // Pull the posts from the second element of the array
        postsArray = acc[index][1];
        postsArray.push(cur);
      }
      // Add the current post to it
      return acc;
    }, []))
  );

  // Use array reduce and Map()
  // Group all posts by category, sorted on the category name
  // Returns the same result as the RxJS groupby
  // Not currently used
  postsGroupedByCategory4$ = this.postsWithCategorySorted$.pipe(
    map(posts => {
      const groupedByCategoryMap = posts.reduce((groupedMap, post) => {
        const postsForCategory = groupedMap.get(post.categoryId);
        groupedMap.set(
          post.categoryId,
          postsForCategory ? [...postsForCategory, post] : [post]
        );
        return groupedMap;
      }, new Map<number, Post[]>());
      return groupedByCategoryMap.entries();
    })
  );

  // Use array reduce (longer form)
  // Group all posts by category, sorted on the category name
  // Returns a key/value pair object
  // Not currently used
  postsGroupedByCategoryKeyValue2$ = this.postsWithCategorySorted$.pipe(
    map(posts => posts.reduce((acc: { [key: string]: Post[] }, cur) => {
      const key = cur.category || 'undefined';
      const currentPostsForCategory = [...(acc[key] || [])];
      acc[key] = [...currentPostsForCategory, cur];
      return acc;
    }, {})),
    tap(x => console.log(x))
  );

    // Retrieving multiple sets of related data
  // Returns { posts: Post[], todos: Todo[] }
  // This could be in a different service
  // Not currently used
  dataForUser$ = this.enteredUser$.pipe(
    switchMap(userName => this.userService.getUserId(userName)),
    switchMap(userId => forkJoin({
      posts: this.getPostsForUser(userId),
      //toDos: this.todoService.getTodosForUser(userId)
    }))
  );
}
