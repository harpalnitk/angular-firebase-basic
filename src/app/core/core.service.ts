import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

export interface Message {
  msg: string;
  msgClass: string;
}

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  homeURL = '/api/';

  message$ = new BehaviorSubject<Message>({
    msg: null,
    msgClass: 'msg-error',
  });

  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    public breakpointObserver: BreakpointObserver,
    private _snackBar: MatSnackBar) {}

    presentSnackbar(message:string,action:string = 'Message', duration: number = 4000) {
      this._snackBar.open(message, action, {
        duration: duration,
      });
    }
  getMessage() {
    return this.message$.asObservable();
  }

  getIsLoading() {
    return this.isLoading$.asObservable();
  }

  setMessage(msg: string, msgClass: string = 'msg-error') {
    this.message$.next({ msg, msgClass });
  }
  setIsLoading(value: boolean) {
    this.isLoading$.next(value);
  }

  // getCSRFToken() {
  //   const requestURL = `${this.homeURL}`;
  //   return this.http
  //     .get<void>(requestURL)
  //     .pipe(take(1))
  //     .subscribe(
  //       (res) => {
  //         console.log(`Setting CSRF Token`, res);
  //       },
  //       (err) => {
  //         console.log(`Error in setting CSRF Token`, err);
  //       }
  //     );
  // }
 
  getWidth() {
    if (this.breakpointObserver.isMatched('(max-width: 37.5em)')) {
      //console.log('breakpoint 37.5em!');
      return '90vw';
    }
    else if (this.breakpointObserver.isMatched('(max-width: 50em)')) {
      //console.log('breakpoint 50em!');
      return '60vw';
    }
    else if (this.breakpointObserver.isMatched('(max-width: 62.5em)')) {
      //console.log('breakpoint 62.5em!');
      return '50vw';
    }
    else if (this.breakpointObserver.isMatched('(max-width: 75em)')) {
      //console.log('breakpoint 75em!');
      return '40vw';
    } else {
      return  '50vw';
    }
  }
}
