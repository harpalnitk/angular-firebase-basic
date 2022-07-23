import { catchError, map, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User } from '../model/user';
import {convertSnaps} from './db-utils';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFirestore) { }


  getUserId(userName: string): Observable<string> {
    // Get the users that match the defined user name.
    // (There should only be one)
    // Use regex ^ and $ to find exact matches.
    // If there are no matches, return an id of 0
    // return this.http.get<User[]>(`${this.usersUrl}?userName=^${userName}$`).pipe(
    //   catchError(this.handleError),
    //   map(users => (users.length === 0) ? 0 : users[0].id)
    // );
console.log('userName',userName);
    return this.db.collection<User>('users',(ref) => ref.where("displayName","==",userName)).snapshotChanges()
  .pipe(
    catchError(this.handleError),
    map((snaps) => convertSnaps<User>(snaps)),
    tap(val => console.log('snaps', val)),
    map(users => (users.length === 0) ? null : users[0].uid)
  );
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
    
 
}

