import { catchError } from 'rxjs/operators';
import { from, fromEvent, interval, of, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, VERSION } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements OnInit, OnDestroy {
name = 'Angular ' + VERSION.major;
  constructor() { }
// Subscriptions
sub1: Subscription;
sub2 : Subscription;
  ngOnInit(): void {
    //Subscribe to Observable
     this.sub1 = this.apples$.subscribe(this.observer); 
    // shortcut: we can pass next or next,error or 
    //next,error,complete methods directly to subscribe
     this.sub2 = this.apples$.subscribe(
      apple => console.log(`Apple emitted ${apple}`)
    ); 

    /// from creation method of observables
    from([20,15,10,5]).subscribe({
      next: (item) => console.log(`Emitted item: ${item}`),
      //if an error occurs observable stops and complete
      //method is not called
      error: err => console.log(`Error occured: ${err}`),
      complete: ()=> console.log(`From Observable complete!`)
    });


    //RXJS OPERATORS
    //1. Used to manipulate emitted values
    of(2,4,6,8,10).pipe(
      map(item => item*2),
      tap(item => console.log('Item in tap: ',item)),
      take(3)
    ).subscribe(item=> console.log('Item in subscription',item))

    //take is a filtering operator
    //it(take(2)) completes after taking 2 values from the observable


    //RXJS filter operator
    //is a transformation operator
    //filters to the items that match criteria specified in a 
    //provided function
    //similar to array filter method
    //of ('A','B','A').pipe(filter(item => item == 'A'))  will emit 'A','A'

    //RxJS SCAN operator
    //accumulates items in an Observable
    //scan((acc,curr) => acc + curr)
    //For each emitted item
    //the accumulator function is applied
    //the result is buffered and emitted
    //Used For
    //1. encapsulating and managing State
    //2. Totalling Amounts
    //3. Accumulating items into an Array
    //of(2,5,9).pipe(scan((acc,curr) => acc + curr))
    // .subscribe(x=> console.log(x))
    //2,7,16
       
    //of(2,5,9).pipe(scan((acc,curr) => acc + curr,10))
    // .subscribe(x=> console.log(x))
    //12,17,26  : 10 used a sthe provided seed value as initial State

        //of(2,5,9).pipe(scan((acc,curr) => [...acc + curr],[] as number[]))
    // .subscribe(x=> console.log(x))
    //[2],[2,5],[2,5,9]
    //[] array empty used as initial value
    //then accumulated value is spread using spread operator
    //and new value is added to the end of array


    //ERROR HANDLING
    //1. use javascript throw statement to propagate error
    //2. use throwError()  to throw an empty observable
    // throwError(() => err); we pass in a function that returns desired error
    //3. return EMPTY    //EMPTY is a constant and 
    //observable which emits nothing
    of(2,4,6).pipe(
      map(i=> {
        if(i== 6){
          throw 'Error!';
        }
        return i;
      }),
      catchError(err => of('six'))
      ).subscribe({
        next: x=> console.log(x),
        error: err=> console.error(err)
      })
  }

  //Observable emits values
   apples$ = new Observable(appleSubscriber => {
    appleSubscriber.next('Apple1');
    appleSubscriber.next('Apple2');
    //calling complete ends subscription
    appleSubscriber.complete();
  });

  //Observer observes onservables for emitted values 
  //and has 3 methods: next,error,complete
  observer = {
    next: apple => console.log(`Apple emitted ${apple}`),
    error: err => console.log(`Error occured: ${err}`),
    complete: ()=> console.log(`No more apples, Go Home!`)
  }



  //Creating Observables
   //Using built in creation functions
  apples1$ = of('Apple1','Apple2'); //it completes after emitting two strings
  apples2$ = from(['Apple1','Apple2']);//it completes after emitting two strings

// from events
@ViewChild('para') par: ElementRef;
ngAfterViewInit(): void {
const parStream = fromEvent(this.par.nativeElement, 'click').subscribe(console.log);
  
}

//from interval
num$ = interval(1000); // will emit 0,1,2,3 after every 1 second
numSub:Subscription = this.num$.pipe(take(10)).subscribe(console.log);

  //How to unsubscribe from the observable
  //1. call complete() on the subscriber
  //2. use an operator that automatically completes
  //3. Throw an error
  //4. Call unsubscribe() on the subscription:: 
  //Note: unsubscribe does not call complete() method
  ngOnDestroy(): void {
    if(this.sub1){
      this.sub1.unsubscribe()
    }
    if(this.sub2){
     this.sub2.unsubscribe()
   }
   if(this.numSub){
     this.numSub.unsubscribe();
   }
   }

   //COMBINATION OPERATORS

   //A,B
   //1,2
   //combine to a single observable result
   //merge,concat : A,B,1,2

   //RxJS merge operator
   //combines multiple observables by merging their emissions
   //merge($a,$b,$c)
   //Static creation function, not a pipeable opeartor
   //Used for:
   //1. Combining sequences of similar types to
   //blend their emitted values
   //merge is a combination creation function
   //when an item is emitted from any input Observable
   //the same item is emitted to the output observable
    //merge completes when all input observables commplete

   //[A,B]
   //[1,2]
   //flatten higher order observables
   //mergeAll : A,B,1,2

   //A,B
   //1,2
   //Emit a combined value (Combination functions)
   //combineLates,forkJoin,withLatestFrom: [A,1] [B,2]
   
   //combineLatest:
   //1. Create an observable whose values are defined using the latest values from
   //each input observable
   //2. combineLatest([$a, $b, $c])
   //3. static creation function, not a pipeable operator
   //4. combineLatest([audience$,online$,pipe$]): Latest bid values from 
   //each bidding source is used to give a observable having 3 value array

   //doesnt emit untill all observables enit atleast one value
   //completes when all input observables complete

   //Use: 
   //1. To work with multiple data sets
   //2. To reevaluate state when an action occurs


      //forkJoin:
   //1. Create an observable whose values are defined using the last values from
   //each input observable
   //2. forkJoin([$a, $b, $c])
   //3. static creation function, not a pipeable operator
   //4. forkJoin([you$,wife$,daughter$]): color choices selection for painting house 
   //will emit when each has finally decided his/her color

   //doesnt emit untill all observables completes
   //Only emit one time

   //Use: 
   //1. To process several http requests
   //2. dont use with action streams

         //withLatestFrom:
   //1. Create an observable whose values are defined using the latest values from each input observables
   //but it emits only when the source observable emits
   //2. a$.pipe(withLatestFrom($b,$c))
   //3. static creation function, not a pipeable operator
   //4. apples$.pipe(withLatestFrom(sticks$,sauce$))  will emit only when apple$ emit
   //with latest values of stick and sauce

   //doesnt emit untill all observables have emitted at least once
   //combines value into an array
   //completes when the source observable completes

   //Use: 
   //1. To react to changes in only one of the observables
   //2. to regulate the output of other observables


   //!HIGHER ORDER OBSERVABLES
   //OBSERVABLES WHICH EMIT OBSERVABLES
   // of(3,7).pipe(
  //    map(id=> this.http.get<Supplier>(`${this.url}/${id}`))
  //    .subscribe(o => o.subscribe());
  //  )
  //Family of operators xxxMap()
  //Map each value
  //- from a source (outer) Observable
  //- To a new (inner) Observable
  //Automatically subscribe to/unsubscribe from innner observable
  //flatten the result
  //Emit the resulting value to he output observable


  //concatMap
  //Higher Order Mapping + Concatenation
  //Transform each emitted item to a new (inner) Observable
  //as defined by function
  //concateMap (i => of(i))
  //It waits for each Inner Observable to complete before processing the next one
  //Concatenates their result in sequence
  //consider it as relay race
  //-runners are queued
  //-only one runners run at a time
  //-A runner must complete before the next runner can execute
  //-runners retain their order
  //Use
  //1. To wait for prior Observable to complete before starting the next one
  //2. To process items in sequence
  //e.g. from a set of IDs get data in sequence from the server
  //e.g. from a set of IDS update data in sequence

    //mergeMap
  //Higher Order Mapping + merging
  //Transform each emitted item to a new (inner) Observable
  //as defined by function
  //mergeMap (i => of(i))
  //It executes innner observables in parallel
  //and merge their results
  //consider it as 800 metre race
  //-runners start concurrently
  //-the runners complete based on how quickly they finish
  //Use
  //1. To process in parallel
  //2. When order doesnt matter
  //e.g. from a set of IDs retrieve data and order of retrieved data doesnt matter
 

   //switchMap
  //Higher Order Mapping + switching
  //Transform each emitted item to a new (inner) Observable
  //as defined by function
  //mergeMap (i => of(i))
  //It unsubscribes the prior inner observable and switches to the new inner observable
  // Inner observable emmissions are merged to the Output Observables
  //consider it as Changing who's running
  //-the coach changes their mind as to which runner will run
  //-only one runner will run
  //Use
  //1. To stop any prior Observable before swithing to next one
  //e.g. type ahead or auto completion
  //e.g. User selection from a list
}
