import { PostService } from './pages/blog/posts/post.service';
import { PostCategoryService } from './pages/blog/post-categories/post-category.service';
import { AuthService} from './pages/auth/auth.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { Component, OnInit } from "@angular/core";
import { map, shareReplay } from "rxjs/operators";
import { Observable } from "rxjs";



import * as fromRoot from './app.reducer';
import { Store } from '@ngrx/store';
import { User } from './model/user';
import { InventoryConfigService } from './pages/inventory/inventory-config/inventory-config.service';


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  isAuth$: Observable<boolean>;
  user$: Observable<User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private inventoryConfigService: InventoryConfigService,
    private store: Store<fromRoot.State>,
    private authService: AuthService,
    private postCategoryService: PostCategoryService,
     private postService: PostService
  ) {

//! No API in firebase to tell that internet connection is off
//! It has to be done here on APP level
//TODO 
    this.initializeApp();
  }

  initializeApp() {
    this.authService.initAuthListener();
  }

  ngOnInit(): void {
   //this.inventoryService.saveConfigData();
   // this.postCategoryService.saveConfigData();
   //this.postCategoryService.allCategories$.subscribe(val=> console.log('Catgories:', val));
   //this.postService.allPosts$.subscribe(val=> console.log('Posts:', val));
   //this.inventoryConfigService.loadConfigData();
  }

  logout() {
    this.afAuth.signOut();
  }
}
