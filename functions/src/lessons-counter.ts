//File created by us for
//running example of database triggers

import * as functions from "firebase-functions";
import { db } from "./init";

// export const onAddLesson = functions.firestore
//   .document(`courses/{courseId}/lessons/{lessonsId}`)
//   .onCreate(async (snap, context) => {
//     const courseId = context.params.courseId;
//     console.log("Runnin onAddLesson trigger...", courseId);

//     return db.runTransaction(async (transaction) => {
//       const courseRef = snap.ref.parent.parent;
//       const courseSnap = await transaction.get(courseRef);
//       const course = courseSnap.data();
//       const changes = { lessonsCount: course.lessonsCount + 1 };
//       transaction.update(courseRef, changes);
//     });
//   });

export const onAddLesson = functions.firestore
  .document(`courses/{courseId}/lessons/{lessonsId}`)
  .onCreate(async (snap, context) => {
    const courseId = context.params.courseId;
    console.log("Runnin onAddLesson trigger...", courseId);
    courseTransaction(snap, (course) => {
      return { lessonsCount: course.lessonsCount + 1 };
    });
  });
  export const onDeleteLesson = functions.firestore
  .document(`courses/{courseId}/lessons/{lessonsId}`)
  .onDelete(async (snap, context) => {
    const courseId = context.params.courseId;
    console.log("Runnin onDeleteLesson trigger...", courseId);
    courseTransaction(snap, (course) => {
      return { lessonsCount: course.lessonsCount - 1 };
    });
  });

  //Modulerize helper function
function courseTransaction(snap, cb: Function) {
  return db.runTransaction(async (transaction) => {
    const courseRef = snap.ref.parent.parent;
    const courseSnap = await transaction.get(courseRef);
    const course = courseSnap.data();
    const changes = cb(course);
    transaction.update(courseRef, changes);
  });
}
