import { Lesson } from './../../model/lesson';
import { Course } from './../../model/course';

import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { first, map } from "rxjs/operators";

import { convertSnaps } from "../../services/db-utils";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor(private db: AngularFirestore) {}

  loadAllCourses(): Observable<Course[]> {
    return this.db
      .collection(
        "courses",
        (ref) => ref.orderBy("seqNo")
        // ref.where("seqNo","==",5)
        // .where("lessonsCount",=)
      )
      .snapshotChanges()
      .pipe(
        map((snaps) => convertSnaps<Course>(snaps)),
        first()
        // if we add first rxjs operator here then
        //the observable will complete after fetching
        //valuse from firestore and behave like normal http
        //observable; firebase continous changes will not be recorded
        //take(5)///////////////////
        // will receive only first 5 changes and after that if any changes are made in server
        //the same will not be reflected
      );
  }

  findCourseByUrl(courseUrl: string): Observable<Course> {
    return this.db
      .collection("courses", (ref) => ref.where("url", "==", courseUrl))
      .snapshotChanges()
      .pipe(
        map((snaps) => {
          const courses = convertSnaps<Course>(snaps);
          return courses.length == 1 ? courses[0] : undefined;
        }),
        first()
      );
  }

  //sortOrder:any    change to sortOrder:OrderByDirection but where to import it not known
  findLessons(
    courseId: string,
    sortOrder: any = "asc",
    pageNumber = 0,
    pageSize = 3
  ): Observable<Lesson[]> {
    return this.db
      .collection(`courses/${courseId}/lessons`, (ref) =>
        ref
          .orderBy("seqNo", sortOrder)
          .limit(pageSize)
          .startAfter(pageNumber * pageSize)
      )
      .snapshotChanges()
      .pipe(
        map((snaps) => convertSnaps<Lesson>(snaps)),
        first()
      );

    //THIS METHOD OF PAGINATION DEALS WITH STORING AN EXTRA FIELD OF 'seqNo' WHENEVER A NEW LESSON IS CREATED
    //WHICH CAN BE DONE LIKE THIS ON CLOUD FUNCTIONS
    //https://fireship.io/lessons/firestore-pagination-guide/

    //MOREOVER TOTAL COUNT OF DOCUMENTS CAN ALSO BE SAVED IN FIRESTORE DATABASE
    // IN SOME FORM OF META TABLES FOR EACH COLLECTION

    //          const functions = require('firebase-functions');
    // const admin = require('firebase-admin');
    // admin.initializeApp();

    // const db = admin.firestore();

    // exports.keepCount = functions.firestore
    //   .document('customers/{customerId}')
    //   .onCreate((snapshot, context) => {

    //     return db.runTransaction(async transaction => {

    //         // Get the metadata and incement the count.
    //         const metaRef = db.doc('metadata/customers');
    //         const metaData = ( await transaction.get( metaRef ) ).data();

    //         const number = metaData.count + 1;

    //         transaction.update(metaRef, {
    //             count: number
    //         });

    //         // Update Customer
    //         const customerRef = snapshot.ref;

    //         transaction.set(customerRef, {
    //             number,
    //         },
    //          { merge: true }
    //         );

    //     });

    //   });
  }
  //partial as the course data is not complete only title changes rae there
  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    //set replaces the document
    //update only updates the changes
    //from for conversion of promise to observable
    return from(this.db.doc(`courses/${courseId}`).update(changes));
  }
}
