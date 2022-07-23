import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of, Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

/* start */

const IPDATA_API_ENDPOINT = 'https://api.ipdata.co/1.1.1.1?api-key=150731c1daac573655cad56e9fce2f193d9e5f66a0954e400b465277';
const FALLBACK_CITY = 'Mumbai';
const FALLBACK_COUNTRY = 'IN';
/* end */

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private ipData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  ipData: any;

  constructor(private httpClient: HttpClient) { }

  ipDataGetter() {
    return this.ipData$.asObservable();
  }

  ipDataSetter(changedIpData: any) {
    this.ipData$.next(changedIpData);
  }

  getIPData() {
    console.log('Inside GetIPData', this.ipData);
    if (this.ipData) {
      return of(this.ipData);
    } else {
      console.log('calling IPDATA_API_ENDPOINT', this.ipData);
      return this.httpClient.jsonp(IPDATA_API_ENDPOINT, 'callback')
        .pipe(
          catchError(this.handleError),
          tap((ipData: any) => {
            console.log('ipData', ipData);
            // TODO fallback to be removed
            if (!ipData.city || ipData.city === 'Ghatkopar') {
              ipData.city = FALLBACK_CITY;
              ipData.country_code = FALLBACK_COUNTRY;
            }
            this.ipData = ipData;
            this.ipData$.next(ipData);
           
          }),
          catchError(this.handleError)
        )
    }
  }

  private handleError(err: any): Observable<never> {
    console.log('error',err);
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
