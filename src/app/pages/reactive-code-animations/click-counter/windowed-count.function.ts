import { Observable, timer } from 'rxjs';
import { mergeMap, take, map, scan, startWith, tap } from 'rxjs/operators';

export function windowedCount<T>(windowLength: number) {
  return function (incoming: Observable<T>): Observable<number> {
    return incoming.pipe(
     // tap(val=> console.log('before mergemap in windowed count',val)), //input is PointerEvent i.e. Button Click
      mergeMap(() =>
        timer(0, windowLength).pipe(
          take(2),
          map((_, i) => (i === 0 ? ('start' as const) : ('stop' as const)))
        )
      ),
     //tap(val=> console.log('Before scan',val)),
      scan((acc, signal) => (signal === 'start' ? acc + 1 : acc - 1), 0),
      startWith(0),
      //tap(val=> console.log('Output of windowed count',val)), //output is 1,2,3,4,3,2,1,0
    );
  };
}


// In contrast, mergeMap allows for multiple inner 
// subscriptions to be active at a time. Because of
//  this, one of the most common use-case for
//   mergeMap is requests that should not be
//    canceled, think writes rather than reads.
//     Note that if order must be maintained concatMap is a better option.

//Timer : After given duration, emit numbers in sequence every specified duration
/*
  timer takes a second argument, how often to emit subsequent values
  in this case we will emit first value after 1 second and subsequent
  values every 2 seconds after
*/
//const source = timer(1000, 2000);
//output: 0,1,2,3,4,5......