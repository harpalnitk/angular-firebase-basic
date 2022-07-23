import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Injectable } from '@angular/core';
import { Profile } from './profile.model';

import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';
import { from } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  //profileCollection: AngularFirestoreCollection<Complaint>;
  profileDoc: AngularFirestoreDocument<Profile>;
  currentUserId;

  constructor(
    private authService: AuthService,
    private db: AngularFirestore,
    private store: Store<fromRoot.State>

  ) {
    this.store
    .select(fromRoot.getUserId)
    .subscribe((userId) => (this.currentUserId = userId));
  }

  getProfile() {
    return this.db.doc<Profile>(`users/${this.currentUserId}`);
  }

  getProfileByUserId(id: string) {
    return this.db.doc<Profile>(`users/${id}`);
  }
  getProfileData() {
    return this.getProfile().valueChanges();
  }

  getProfileDataByUserId(id) {
    return this.getProfileByUserId(id).valueChanges();
  }

  deleteProfile(id: string) {
    return this.getProfile().delete();
  }
  deleteProfileByUserId(id: string) {
    return this.getProfileByUserId(id).delete();
  }
  updateProfile(data: any) {
    return from(this.getProfile().update(data));
  }
  updateProfileByUserId(id: string, data: any) {
    return this.getProfileByUserId(id).update(data);
  }
}
