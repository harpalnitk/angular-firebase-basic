import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, Observable, throwError } from 'rxjs';
import { catchError, debounceTime, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { PostCategory } from './post-category';
import {convertSnaps} from '../../../services/db-utils';

@Injectable({
  providedIn: 'root'
})
export class PostCategoryService {
  private postCategoriesUrl = 'api/postCategories';

  // allCategories$ = this.http.get<PostCategory[]>(this.postCategoriesUrl).pipe(
  //   catchError(this.handleError),
  //   shareReplay(1)
  // );

  allCategories$ = this.db.collection("postConfigData").snapshotChanges()
      .pipe(
        map((snaps) => convertSnaps<any>(snaps)),
        map(val => val[0].postCategories),
        catchError(this.handleError),
        shareReplay(1) // shareReplay will cache the values and thus server will be accessed only once
      );
  

  // Sort the categories for the type ahead display
  allCategoriesSorted$ = this.allCategories$.pipe(
    map(categories => this.sortCategories(categories)),
    shareReplay(1)
  );

  // Manual autocomplete the categories going to the server each time
  // Not currently used
  textEnteredSubject = new BehaviorSubject<string>('');
  textEntered$ = this.textEnteredSubject.asObservable();

  filteredCategories$ = this.textEntered$.pipe(
    debounceTime(200),
    switchMap(enteredText => this.getCategorySuggestions(enteredText)),
    map(categories => this.sortCategories(categories)),
    tap(result => console.log(JSON.stringify(result)))
  );

  // Manual autocomplete the categories going to the server one time
  // Not currently used
  filteredCategories2$ = combineLatest([
    this.allCategoriesSorted$,
    this.textEntered$.pipe(
      debounceTime(200),
      tap(text => console.log('Entered', text))
    )
  ]).pipe(
    map(([categories, enteredText]) => categories.filter(category =>
      category.name.toLocaleLowerCase().indexOf(enteredText.toLocaleLowerCase()) === 0))
  );

  constructor(private http: HttpClient,
    private db: AngularFirestore,) { }

  private getCategorySuggestions(enteredText: string): Observable<PostCategory[]> {
    return this.http.get<PostCategory[]>(this.postCategoriesUrl + '?name=^' + enteredText);
  }

  processEnteredText(text: string): void {
    // Emit the entered text
    this.textEnteredSubject.next(text);
  }

  sortCategories(categories: PostCategory[]): PostCategory[] {
    return categories.sort((a, b) => a.name < b.name ? -1 : 1);
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





      //Use only once for loading data on firebase server
  //then delete it
  saveConfigData(){
    console.log('Inside save post category config data');
    const data = {postCategories : [
      {
        id: 1,
        name: 'Production',
        description: 'Review of the musical production'
      },
      {
        id: 2,
        name: 'Songs',
        description: 'Review on the music'
      },
      {
        id: 3,
        name: 'Suggestions',
        description: 'Suggestions for improvement'
      },
      {
        id: 5,
        name: 'Facilities',
        description: 'Feedback on the facilities'
      },
      {
        id: 6,
        name: 'Story',
        description: 'Review of the story'
      },
      {
        id: 8,
        name: 'Characters',
        description: 'Feedback about any of the characters'
      },
      {
        id: 9,
        name: 'Sadness',
        description: 'Comments on the sadness in the story'
      },
      {
        id: 10,
        name: 'Satisfaction',
        description: 'Satisfaction with the experience'
      }
    ]};
  
  
      return this.db
      .collection(
        "postConfigData",
      )
      .add(data)
      .then(value => {
        console.log('configData',value);
      });
    }
}
