import { Course } from './../../model/course';

import { AngularFirestore } from "@angular/fire/firestore";
import { Component, OnInit } from "@angular/core";
import { of } from "rxjs";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
})
export class AboutComponent implements OnInit {
  constructor(private db: AngularFirestore) {}

  ngOnInit() {
    //Firebase Refrece variable

    // const courseRef = this.db
    //   .doc(`/courses/4aJzDKNN8Ex7ggqh5nUl`)
    //   .snapshotChanges()
    //   .subscribe((snap) => {
    //     const course: any = snap.payload.data();
    //     console.log("course.relatedCourseRef", course.relatedCourseRef);
    //   });

    //   const relatedCourseRef = this.db.doc(`courses/EXHihjQnJrKsnW6SUhJ4`)
    //   .snapshotChanges()
    //   .subscribe(
    //     doc=> console.log('ref', doc.payload.ref)
    //   );
  }

  // runBatch() {
  //   const course1Ref = this.db.doc(`/courses/4aJzDKNN8Ex7ggqh5nUl`).ref;
  //   const course2Ref = this.db.doc(`/courses/EXHihjQnJrKsnW6SUhJ4`).ref;
  //   const batch = this.db.firestore.batch();
  //   batch.update(course1Ref, {
  //     titles: {
  //       description: "Angular Security Course - Web Security Fundamentals_1",
  //     },
  //   });
  //   batch.update(course2Ref, {
  //     titles: { description: "Angular for Beginners_1" },
  //   });
  //   const batch$ = of(batch.commit());
  //   console.log("before subscribing batch commit");
  //   batch$.subscribe();
  // }
  // async runTransaction() {
  //   const newCounter = await this.db.firestore.runTransaction(
  //     async (transaction) => {
  //       console.log("Running Tansaction...");
  //       const course1Ref = this.db.doc(`/courses/4aJzDKNN8Ex7ggqh5nUl`).ref;
  //       //get document snapshot
  //       const snap = await transaction.get(course1Ref);
  //       const course = <Course>snap.data();
  //       const lessonsCount = course.lessonsCount + 1;
  //       //write count back to database
  //       transaction.update(course1Ref, { lessonsCount });
  //       //always pass result through return
  //       //and never assign new value to component level variables
  //       return lessonsCount;
  //     }
  //   );
  //   console.log("Result lessons count", newCounter);
  // }

  //advantage of runTransaction
  //imagine this method is being run be several clients concurrently
  //if the value of lessonsCount changes during the transaction
  //the transaction will be rolled back.
}
