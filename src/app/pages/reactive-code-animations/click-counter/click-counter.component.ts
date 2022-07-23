import { ChartData, createChartData } from './chart-data.function';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { scan, startWith, tap } from 'rxjs/operators';
import { windowedCount } from './windowed-count.function';

function createClickObservable(target: ElementRef): Observable<MouseEvent> {
  return fromEvent(target.nativeElement, 'click');
}

function count<T>(incoming: Observable<T>): Observable<number> {
  return incoming.pipe(
    //scan(accumulator: function, seed: any): Observable
    //const source = of(1, 2, 3);
// basic scan example, sum over time starting with zero
//const example = source.pipe(scan((acc, curr) => acc + curr, 0));
// log accumulated values
// output: 1,3,6
    scan((acc) => acc + 1, 0),
    startWith(0)
  );
}

@Component({
  selector: 'click-counter',
  templateUrl: './click-counter.component.html',
  styleUrls: ['./click-counter.component.scss']
})
export class ClickCounterComponent implements OnInit {

  @ViewChild('button', { static: true }) button: ElementRef;
  private _buttonClicks$: Observable<MouseEvent>;
  clickCounter$: Observable<number>;
  lastSecondCounter$: Observable<number>;
  lastFiveSecondsCounter$: Observable<number>;
  lastFifteenSecondsCounter$: Observable<number>;
  chartData$: Observable<ChartData>;

  ngOnInit(): void {
    this._buttonClicks$ = createClickObservable(this.button);
    this.clickCounter$ = this._buttonClicks$.pipe(count);
   this.lastSecondCounter$ = this._buttonClicks$.pipe(windowedCount(1000));
    this.lastFiveSecondsCounter$ = this._buttonClicks$.pipe(
      windowedCount(5000)
    );
     this.lastFifteenSecondsCounter$ = this._buttonClicks$.pipe(
       windowedCount(15000)
     );
    this.chartData$ = createChartData({
      oneSecondWindow: this.lastSecondCounter$,
      fiveSecondWindow: this.lastFiveSecondsCounter$,
      fifteenSecondWindow: this.lastFifteenSecondsCounter$,
    });
  }

}
