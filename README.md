## Generate lazu loaded module

ng g m pages/about --routing --route about --module app

It will generate about component also

For generating Components
ng g c pages/products/productlist --skip-tests --module products



# Firestore

every document needs to be in a collection
a document is the basic level of storage in firebase

## advantages of firestore auto generated Ids

1. can be generated on clent side through firebase SDK
2. Performance: concurrent operation of millions of user can also be handled while generating such Ids
3. The server while generating unique identifier make all other clients wait

## valueChanges()

Use it when you need to display only data

## snapshotChanges()

return id ,data and all metadata of document

## stateChanges()

return array of socuments which change not all documents of collection are returned

## queris

1. this.db.collection('courses',
   ref=> ref.orderBy('seqNo)
   .where('seqNo',"==", 2)
   )

this will not work as multiple values having same seqNo;
ordering them will not be possible

2. this.db.collection('courses',
   ref=> ref.orderBy('seqNo)
   .where('seqNo',">", 0)  
   .where('seqNo',"<=", 5)
   )

OR

this.db.collection('courses',
ref=> ref.orderBy('seqNo)
.startAfter(0).endAt(5)
)

3. this.db.collection('courses',
   ref=> ref.orderBy('seqNo)
   .startAt(0).endAt(5)
   )

4. this.db.collection('courses',
   ref=> ref.where('categories',"array-contains", "BEGINNER")
   )

5. this.db.collection('courses',
   ref=> ref.orderBy('seqNo')
   )

## For single fields indexes are automatically created by firestore

Cloud Firestore creates the indexes defined by your automatic index settings for each field you add, enabling most simple queries by default. You can add exemptions to manually set how a specific field is indexed.
Ascending
Descending
Arrays

### Composite queries give error

    //ref.orderBy('seqNo')
    ref.where("seqNo","==",5)
    .where("lessonsCount",">=", 5)

    in Browser click on the error
    you will be rdirected to firebase console and there set composite index

### Not allowed composite queries

    ref.where("seqNo",">=",5)
    .where("lessonsCount",">=", 5)

    Error: Filters with inequality(>, >=,<,<=, >=) must be on same field

    In Firestore
    FieldsIndexed
    seqNo Ascending lessonsCount Ascending

    First Field needs an exact match for composite queries

#### This is allowed

    ref.where("seqNo",">=",5)
    .where("seqNo","<=", 10)

###

    ref.where("seqNo",">=",5)
    .where("lessonsCount","==", 5)

    will be allowed but it will need another index

        In Firestore
    FieldsIndexed
    lessonsCount Ascending seqNo Ascending

    FIRST FIELD NEEDS TO BE AN EXACT MATCH

# For offline features

in app.module.ts file
change
AngularFirestoreModule,
to
AngularFirestoreModule.enablePersistence(),

Note: Offline features are availbale only on first opened tab of the application. Close all otehr tabs

# Difference between Transaction and Batch writes

# Authentication

install package "firebaseui": "^4.8.0",
for ui buttons of login

//Using firbaseui npm package for login functionality
//and needing its styles on the login page
@import "~firebaseui/dist/firebaseui.css";

# Firebase security Rules

rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
match /{document=\*\*} {
allow read, write: if
request.time < timestamp.date(2021, 5, 1);
}
}
}

## Path should always be to document and not collection

rules_version = '2';
service cloud.firestore {
(courseId} here is a path to document
match /databases/{database}/documents/courses/{courseId}{
allow read;
allow write: if false;
}
}

The abve rule allows only to read courses collection and not read from it
Further, nested collections can also be not read.lessons collection cannot be read

## SECURITY RULES DO NOT CASCADE NESTED COLLECTIONS

match /databases/{database}/documents/courses/4aJzDKNN8Ex7ggqh5nUl{
allow read;
allow write;
}

ALLOWS READ WRITE TO PARTICULAR DOCUMENT IN COLLECTION

IF BOTH THE RULES ARE WRITTEN(IN ANY ORDER) AND PARTICULAR DOCUMENT IS WRITTEN TO
IT WILL BE ALLOWED

match /databases/{database}/documents/courses/{courseId}{
allow read;
allow write: if courseId == '4aJzDKNN8Ex7ggqh5nUl';
}
The above rule is same as before it two rules combined

allow read; is equivalent to allow get,list;

where get is for a particular document in collection
and list is reading of complete list

allow write; is equivalent to allow create, update, delete;

e.g.

allow create;
allow delete: if false;
allow update: if courseId == '4aJzDKNN8Ex7ggqh5nUl';

means anu user can create document
No user can delete document
updates only allowed for one document with given id

# NESTED MATCH BLOCKS

match /databases/{database}/documents{

    match /courses/{courseId}{

allow read;
allow write: if courseId == '4aJzDKNN8Ex7ggqh5nUl';
}

    match /users/{userId}{

    }

    match /{restOfPath=**}{
        // This will match all collections and documents
    }

}

## Adding schema in firebase by firebase rules

////////////////////////////////////////////////////
RULES FILE ON THE FOREBASE SERVER
//////////////////////////////////////////////////
// rules_version = '2';
// service cloud.firestore {
// match /databases/{database}/documents {
// match /{document=\*\*} {
// allow read, write: if
// request.time < timestamp.date(2021, 5, 1);
// }
// }
// }

rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {

function isAuthenticated(){
return request.auth.uid != null;
}

// true only if user is authenticated
//and user id exists as document in users collection
//where we manually saved the user id copied from
//firebase authentication into our own users collection
// in users collection we did not use auto generated ids
//instead we copied authentication uid to create our own whitelisted user
//documents
function isKnownUser(){
return
isAuthenticated()
&& exists(/databases/$(database)/documents/users/$(request.auth.uid));
}

function isAdmin(){
return
isAuthenticated()
&& get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
}

function isNonEmptyString(fieldName){
return request.resource.data[fieldName] is string
&& request.resource.data[fieldName].size() > 0;
}
// request.resource is new document
// only resource is old document in database
function isValidCourse(){
return request.resource.data.seqNo is number
&& request.resource.data.lessonsCount is number
&& request.resource.data.lessonsCount > 0
&& isNonEmptyString("url");
}

match /users/{userId}{
allow read,write: if false;
// Nobody can read or write this whitelist of users
}
match /courses/{courseId} {
allow read: if isAuthenticated();
allow write:
if isAdmin()
&& isValidCourse()
//&& resource.data.status == 'draft';
//rules van also be set for comparison
//with current value of fields in documents
//as here the update will only happen
// if the staus field has value draft
//staus field is manually created by us on document
match /lessons/{lessonId} {
//allow read: if request.auth.uid != null;
//Using Function
allow read: if isKnownUser();
allow write: if isAdmin();
}
}
// match /courses/{courseId}/lessons/{lessonId} {
// allow read: if request.auth.uid != null;
// nested above
// }
}
}
///////////////////////////////////////////////////

# DEPLOY RULES FROM LOCAL ENVIRONMENT TO SERVER

npm install -g firebase-tools

> firebase login

login using your google account

> firebase init

and select Firestore and proceed

Select file for firebase indexes
firestore.indexes.json

> firebase deploy

firebase deploy --only hosting     
For only hosting

firebase deploy --only functions     
For only functions

to deploy rules and indexes

1. firebase.indexes.json and
2. firestore.rules file to the firebase server

# DEPLOYING THE APPLICATION

in package.json file add production build scrit

"build:prod": "./node_modules/.bin/ng build --prod"

This will create some files in the dist folder

## To deploy again run firebase init to load deploy package in our project

instead of public as output directory use dist
in single page application choose yes

## firebase.json file will now have hosting section

RUN command

> firebase deploy to deploy the application

In the firebase console in hosting tab; you can also connect your doamin by clicking on Connect Domain Button and use your custom domain url to access the file

# FIREBASE CLOUD STORAGE

run

> firebase init

select storage

storage.rules file will be created and storage section will be added to firebase.json file

> firebase deploy --only "storage"
> To deploy only storage

Go to firebase console storage tab
create folder courses and upload image

# Fire Storage

allow read;
allow write: if request.auth!=null && request.resource.size < 2* 1024 * 1024;

      ## change rules in firestore.rules file to force size limitation on files uploaded

# Firebase functions

> firebase init
> and select firebase functions
> selct language as typescript
> npm install and finally changes will be made in firebase.json

"functions": {
"predeploy": [
"npm --prefix \"$RESOURCE_DIR\" run lint",
"npm --prefix \"$RESOURCE_DIR\" run build"
]
}

i.e. now whenever we deploy firebase function before that
run lint and run build in firebase functions directory will be run

ile and new functions folder will be created

cd to functions folder
and do npm install

then run npm run build to build the file

> npm run build

This command will generate lib folder in functions folder and in that folder there will be index.js file which will be deployed to firebase

## Note ESLINT will give errors

so from firebase.json file in root folder
remove this line from functions
"npm --prefix \"$RESOURCE_DIR\" run lint",

# Firebase emulators

> firebase init
> and seelct firebase functions
> firebase emulators:start
> TO STRAT THE EMULATORS
> Note: Emulators require JAVA to be installed

## View Firebase Emulator UI in

http://localhost:4000/

firebase emulators:start --only functions  
To RUN emulator only for functions

now in functions folder make changes to index.ts file and run

> npm run build

the function will be automatically deployed to the emulator

URL To access Functions

## https://localhost:5001/$PROJECT/us-central1/helloWorld

https://localhost:5001/udemy-ng-http-59d8a/us-central1/helloWorld

add "noImplicitAny": false
in the tsconfig.json file to supress any errors

## Anothe approach

From inside functions folder RUN

> npm run serve

It will build the project and also start functions emulator

### Logs

from functions folder if we run

> npm run logs
> then we see the same logs as are there on the server


# Firebase Database Trigeer with cloud function

To deploy only sepcific functions
>firebase deploy --only fucntions:onAddLesson, functions:onDeleteLesson

# For image /file processing inside functions

from inside functions run
>npm install --save @google-cloud/storage

## "ng-dynamic-component": "^8.0.1",

needed for adding dynamic inputs to dynamically created form controls in lazy loading recipes

## chart.js

required only for reactive animations-code module