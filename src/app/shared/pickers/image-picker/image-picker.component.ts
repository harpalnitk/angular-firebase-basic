import { CoreService } from "./../../../core/core.service";
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  Input,
  OnDestroy,
} from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable, of, Subscription } from "rxjs";
import { concatMap, finalize, last, map, shareReplay, take } from "rxjs/operators";
import { Md5 } from "ts-md5";

@Component({
  selector: "app-image-picker",
  templateUrl: "./image-picker.component.html",
  styleUrls: ["./image-picker.component.scss"],
})
export class ImagePickerComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  uploadPercent$: Observable<boolean>;
  downloadUrl$: Observable<string>;

  selectedImage: string;
  //THE IMAGE DOWNLOADABLE URL TO BE EMITTED
  //AFTER THE IMAGE FILE HAS BEEN UPLOADED ON FirebaseStorage
  @Output() outputImageURL = new EventEmitter<string>();

  @Input() inputPath: string = "uploads";
  @Input() inputMetaData: any = {};

  uploads: AngularFirestoreCollection<any>;

  // To clear the image and static location pictures when
  // we visit the form page of new-place entry again
  @Input() image: string;
  showPreview = false;
  constructor(
    private fs: AngularFireStorage,
    private afs: AngularFirestore,
    private coreService: CoreService
  ) {}

  ngOnInit() {
    this.showPreview = !!this.image;
  }

  // fallback method of choosing file when device does not have camera
  onFileChosen(event: Event) {
    console.log(event);
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      //show an alert message
      return;
    }

    this.uploadFile(pickedFile);
  }

  public uploadFile(file: File) {
    console.log("Input path", this.inputPath);

    const nameHash = Md5.hashStr(file.name + new Date().getTime());
    const fileExt = file.type.split("/")[1];
    const fileName = `${nameHash}.${fileExt}`;
    console.log("fileName", fileName);
    const filePath = `${this.inputPath}/${fileName}`;
    const task = this.fs.upload(filePath, file);

    this.uploads = this.afs.collection(this.inputPath);
    // observe the percentage changes
    this.uploadPercent$ = task.percentageChanges()
    .pipe(
      shareReplay(),
      //uploadPercent is a number from 0 to 100 and not boolean
      //therefore when reaching 100 it will evaluate to true and progress spinner will show
      map((val)=>{
        console.log(val);
        if(val < 100){
          return true;
        }else {
          return false;
        }
      })
      );
    this.downloadUrl$ = task.snapshotChanges().pipe(
      last(),
      concatMap(() => this.fs.ref(filePath).getDownloadURL())
    );
    const saveUrl$ = this.downloadUrl$.pipe(
      concatMap((url: any) =>
        // IF WE WANT TO SAVE URL IN DATABASE HERE
        // this.coursesService
        // .saveCourse(
        //     this.course.id,
        //      {uploadedImageUrl: url}
        //     )
        {
          console.log("Download Url", url);
          return of(url);
        }
      )
    );
    saveUrl$.subscribe(
      (url) => {
        console.log("Download URL", url);
        this.image = url;
        this.outputImageURL.emit(url);
      },
      (err) => {
        console.log("Error in uploading image");
        this.coreService.setMessage("Error in uploading image");
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      // console.log('Subscription in image picker being destroyed', sub);
      sub.unsubscribe();
    });
  }
}
