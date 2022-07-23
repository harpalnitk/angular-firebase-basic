import * as functions from "firebase-functions";
import { db } from "./init";
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const os = require("os");
const gcs = new Storage();
// for creating temporary directory recursively from path provided
const mkdirp = require("mkdirp-promise");
//For command line invocation using promise based API
const spawn = require("child-process-promise").spawn;
//To delete temp directory on unix system
const rimraf = require('rimraf');

export const resizeThumbnail = functions.storage
  .object()
  .onFinalize(async (object, context) => {
    console.log(`resizeThumbnail:`);
    //this is the path in the firebase storage bucket where file has been uploaded
    //1. GETTING INFORMATION ABOUT UPLOADED FILE
    const fileFullPath = object.name || "",
      contentType = object.contentType || "",
      fileDir = path.dirname(fileFullPath),
      fileName = path.basename(fileFullPath),
      //this will be on node server
      tempLocalDir = path.join(os.tmpdir(), fileDir);

    console.log(
      `Thumbnail generation started:`,
      fileFullPath,
      fileDir,
      fileName,
      contentType
    );
    //To prevent infinite loop scond check after OR
    if (contentType.startsWith("image/") || fileName.startsWith('thumb_')) {
      console.log("Exiting image processing!!");
      return null;
    }
    // 2. mkdirp creates folder structure recursively as per the path provided
    await mkdirp(tempLocalDir);
    const bucket = gcs.bucket(object.bucket);
    //This(originalImageFile) is just reference
    const originalImageFile = bucket.file(fileFullPath);
    const tempLocalFile = path.join(os.tmpdir(), fileFullPath);
    console.log("Downloading Image To:", tempLocalFile);
    await originalImageFile.download({ destination: tempLocalFile });

    //3. Generate a thumbnail using ImageMagick COMMAND LINE TOOL

    const outputFilePath = path.join(fileDir, "thumb_" + fileName);
    const outputFile = path.join(os.tmpdir(), outputFilePath);
    console.log("Generating a thumbnail to: ", outputFile);
    await spawn(
      "convert",
      [tempLocalFile, "-thumbnail", "510x287 >", outputFile],
      {
        capture: ["stdout", "stderr"],
      }
    );

    //4. Upload the thumbnail file back to Storage

    const metadata = {
      contentType: object.contentType,
      cacheControl: "public, max-age=2592000, s-maxage=2592000",
    };
    console.log(
      "Uploading the thumbnail to Firebase Storage:",
      outputFile,
      outputFilePath
    );
    //max-age controls caching of image on user system(browser)
    //s-maxage controls caching of image on CDN (Firebase storage)
 const uploadedFiles = await bucket.upload(outputFile, {
   destination: outputFilePath, metadata
 });
 //The above upload will again trigger the execution of this function and
 // we might enter a infinite loop

 //5. To delete the temp file created locally
 
 // Basically we want to run on the unix system this command
 //>rm -rf tempLocalDir
 //To run above command from cloud function we need to install a package rimraf
  rimraf.sync(tempLocalDir);   

  //6. To Delete original uploaded file by thye USER
  await originalImageFile.delete();

  //7. Create link to uploaded file
  const thumbnail = uploadedFiles[0];
  // Get signed URL is Google Cloud IAM(CLOUD IDENTITY AND ACCESS MANAGEMENT) API
  const url = await thumbnail.getSignedUrl({action:'read', expires: new Date(3000,0,1)})
  console.log('Generated signed Url: ', url);
  
  //8. save thumbnail link in database
  //we are saving images in /courses/{courseId} folder therefore from url we can get course id
  const frags = fileFullPath.split('/'),
  courseId = frags[1];

  console.log('Saving thumbnail Url to database', courseId);
  //await db.doc(`courses/${courseId}`).update({uploadedImageUrl:url});
 //OR
 return db.doc(`courses/${courseId}`).update({uploadedImageUrl:url});
 // The function will return a promise which will be evaluated
 //once the execution of function completes on firebase servers
 
 //return null;
  });



  //GOOGLE CLOUD FUNCTIONS ARE ACCESSING THE DATABASE
  //THROUGH SERVICE ACCOUNT

  //For running this line i.e. getting signed url of image from cloud function
  //const url = await thumbnail.getSignedUrl({action:'read', expires: new Date(3000,0,1)})
  //go to https://cloud.google.com/iam
  //and sign in NOTE: IT REQUIRES CREDIT CARD

  //go to iam tab, search for project, edit,
  //select service management from dropdown,
  // select cloud function service agent from the 
  //second dropdown
