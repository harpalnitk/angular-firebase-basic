import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import * as firebaseui from "firebaseui";
import firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";

@Component({
  selector: "auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit, OnDestroy {
  ui: firebaseui.auth.AuthUI;
  constructor(private afAuth: AngularFireAuth,
     private router: Router,
     private ngZone: NgZone) {}
 

  ngOnInit() {
    const uiConfig = {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: this.onLoginSuccessfull.bind(this),
      },
    };
    //bind(this) binds the function to the component
    this.ui = new firebaseui.auth.AuthUI(firebase.auth());
    this.ui.start("#firebaseui-auth-container", uiConfig);
  }
  onLoginSuccessfull() {
    //without ngZone we will get an error in console
    //as this method is not called by angular 
    //but by an outside service
   // this.router.navigateByUrl("/courses");
   this.ngZone.run(()=> this.router.navigateByUrl("/inventory"));
  }
  ngOnDestroy(): void {
    this.ui.delete();
   }
}
