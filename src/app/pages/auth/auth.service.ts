import { User } from './../../model/user';

import { CoreService } from "./../../core/core.service";

import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { switchMap, take } from "rxjs/operators";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Md5 } from "ts-md5/dist/md5";
//NGRX IMPORTS
import * as fromRoot from "../../app.reducer";
import { Store } from "@ngrx/store";
import * as AuthActions from "./store/auth.actions";



@Injectable({
  providedIn: "root",
})
export class AuthService {
  user$: Observable<User | null>;
  authState: any = null;

  isAuth$ = new BehaviorSubject<boolean>(false);
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private coreService: CoreService,
    private store: Store<fromRoot.State>
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        console.log("In user$ observable", user);
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  getIsAuth(): Observable<boolean> {
    return this.isAuth$.asObservable();
  }

  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      console.log("In initAuthListener observable", user);
      this.authState = user;
      if (user) {
        // Update User Data has to be done only once after signup
        // here since we are using signup of 3rd party we need to check in pudate 

        //function if user exists or not in our own users table
        this.updateUserData(user);
        this.store.dispatch(new AuthActions.SetAuthenticated(user.uid));
        this.router.navigate(["/home"]);
      } else {
        this.store.dispatch(new AuthActions.SetUnauthenticated(null));
        //this.trainingService.cancelSubscriptions();
        this.router.navigate(["/auth"]);
      }
    });
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );
    return userRef
      .get()
     // .pipe(take(1))    //Not needed as get() gets user doc only once
      .subscribe((userInFirebase) => {
        if (!userInFirebase.exists) {
          console.log(`User does not exists in Firebase`);
          const data: User = {
            uid: user.uid,
            email: user.email || null,
            displayName: user.displayName,
            photoURL:
              user.photoURL ||
              "http://gravatar.com/avatar/" +
                Md5.hashStr(user.uid) +
                "?d=identicon",
          };
          userRef.set(data, { merge: true });
          return true;
        }
        return false;
      });
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      this.coreService.presentSnackbar("You have successfully logged out!");
      // this.complaintsService.cancelSubscriptions();
      this.router.navigate(["/"]);
    });
  }
}
