import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

const SECONDS_END_TIME: number = 59;
const MINUTES_END_TIME: number = 3540 + SECONDS_END_TIME;
const HOURS_END_TIME: number = 356400 + MINUTES_END_TIME;

@Component({
  selector: 'prism-timer',
  templateUrl: './prism-timer.component.html',
  styleUrls: ['./prism-timer.component.less']
})
export class PrismTimerComponent implements OnInit, OnDestroy {

  @Input() displayHours: boolean = true;
  @Input() displayMinutes: boolean = true;

  ticks: number = 0;

  minutes: number = 0;
  hours: number = 0;
  seconds: number = 0;

  timerSub: Subscription;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  private startTimer() {

    let timer = Observable.timer(1, 1000);
    this.timerSub = timer.subscribe(
      t => {
        this.ticks = t;
        this.seconds = this.getSeconds(this.ticks);
        this.minutes = this.getMinutes(this.ticks);
        this.hours = this.getHours(this.ticks);

        // 59 seconds
        if (!this.displayHours && !this.displayMinutes && t === SECONDS_END_TIME) {
          this.stopTimer();
        }
        // 59:59 59 minutes, 59 seconds
        else if (!this.displayHours && this.displayMinutes && t === MINUTES_END_TIME) {
          this.stopTimer();
        }
        // 99:59:59 99 hours, 59 minutes, 59 seconds
        else if (t === HOURS_END_TIME){
          this.stopTimer();
        }
      }
    );
  }

  private stopTimer(): number {
    this.timerSub.unsubscribe();
    return this.ticks;
  }

  private getSeconds(ticks: number) {
    return this.pad(ticks % 60);
  }

  private getMinutes(ticks: number) {
    return this.pad((Math.floor(ticks / 60)) % 60);
  }

  private getHours(ticks: number) {
    return this.pad(Math.floor((ticks / 60) / 60));
  }

  private pad(digit: any) {
    return digit <= 9 ? '0' + digit : digit;
  }
}
