import { CoursesService } from './courses.service';



import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Course} from "../../model/course";
import {Observable, of} from 'rxjs';



@Injectable()
export class CourseResolver implements Resolve<Course> {

    constructor(private coursesService: CoursesService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {
        const courseUrl = route.paramMap.get('courseUrl');
        //resolver automatically subscribes and return the data of observable
        //but observable needs to complete
        //in firebase observable does not complete
        return this.coursesService.findCourseByUrl(courseUrl);
    }

}

