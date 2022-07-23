import { User } from './../../../model/user';
import { AuthService } from './../../../pages/auth/auth.service';

import {
  Component,
  EventEmitter,
  
  OnInit,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';

import { shareReplay } from 'rxjs/operators';


import * as fromRoot from '../../../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();

  isAuth$: Observable<boolean>;
  user$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>,
  ) {
    // console.log('Before fetching CSRF Token');
    // this.coreService.getCSRFToken();
    // this.isAuth$ = this.afAuth.authState.pipe(map((user) => !!user));
    // this.pictureUrl$ = this.afAuth.authState.pipe(
    //   map((user) => user?.photoURL)
    // );
    this.isAuth$ = this.store.select(fromRoot.getIsAuth).pipe(
      //because auth is subscribed many times on the screen
      //shareReplay() shares the result of one subscription across all instances
      shareReplay()
    );
    this.user$ = this.authService.user$.pipe(shareReplay());
  }

  ngOnInit() {}

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onSignOut() {
    this.authService.signOut();
  }
}
