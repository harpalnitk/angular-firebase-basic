import { AuthService } from './../../../pages/auth/auth.service';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { Observable } from 'rxjs';
import {  shareReplay } from 'rxjs/operators';

import * as fromRoot from '../../../app.reducer';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth$: Observable<boolean>;
 
  constructor(private authService: AuthService,
    private store: Store<fromRoot.State>,) {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth)
    .pipe(
      shareReplay()
    );
  }

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth).pipe(
      shareReplay()
    );
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onSignOut() {
    this.authService.signOut();
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
