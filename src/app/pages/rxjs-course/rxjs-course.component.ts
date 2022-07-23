import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rxjs-course',
  templateUrl: './rxjs-course.component.html',
  styleUrls: ['./rxjs-course.component.scss']
})
export class RxjsCourseComponent implements OnInit {
  pageTitle = 'RXJS Product Management';
  constructor() { }

  ngOnInit(): void {
  }

}
