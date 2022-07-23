import { CoursesService } from './../courses.service';

import { Lesson } from './../../../model/lesson';
import { Course } from './../../../model/course';

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {finalize, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  course: Course;
  lessons: Lesson[];
  lastPageLoaded = 0;
  loading =false;

  displayedColumns = ['seqNo', 'description', 'duration'];

  dataSource:any;


  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService) {


  }

  ngOnInit() {

    this.course = this.route.snapshot.data['course'];
    this.loading = true;
    this.coursesService.findLessons(this.course.id).pipe(
      finalize(()=>{
//runs both in error and result condition
this.loading = false;
      })
    )
    .subscribe(lessons => this.lessons = lessons );



  }

  loadMore() {
 this.lastPageLoaded++;
 this.loading = true;
 this.coursesService.findLessons(this.course.id, 'asc', this.lastPageLoaded)
 .pipe(finalize(()=>this.loading=false))
 .subscribe(lessons=> this.lessons = this.lessons.concat(lessons));
  }


}
