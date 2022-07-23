import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

//const functions = require("firebase-functions");
import { db } from "./init";
const cors = require('cors');



//const express = require("express");
import * as express from 'express';
const app = express();
//allow cross origin requests for this REST API
app.use(cors({origin:true}));



app.get("/courses", async (request, response) => {
  functions.logger.info("Hello logs GET /courses!", { structuredData: true });
  const snaps = await db.collection("courses").get();
  const courses: any[] = [];
  snaps.forEach(snap => courses.push(snap.data()));
  response.status(200).json({ courses });
});


export const getCourses = functions.https.onRequest(app);

export {onAddLesson, onDeleteLesson} from './lessons-counter';

export {resizeThumbnail} from './image-upload';



// export const helloWorld = functions.https.onRequest((request:any, response:any) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!!!");
// });


// exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
//     .onCreate((snap: any, context: any) => {
//       const original = snap.data().original;
//       console.log('Uppercasing', context.params.documentId, original);
//       const uppercase = original.toUpperCase();
//       return snap.ref.set({uppercase}, {merge: true});
//     });