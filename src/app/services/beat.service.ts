import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, TimeInterval } from 'rxjs';
import { interval, take } from 'rxjs';
import { MAXTEMPO, MAX_CYCLES, MINTEMPO } from '../constants';

const DEFAULT_TEMPO = 80;

export type AppBeat = { playing: boolean, measure: number, beat: number, cycle: number };

@Injectable({
  providedIn: 'root'
})
export class BeatService {
  public tempo$ = new BehaviorSubject<number>(DEFAULT_TEMPO);
  public playing$ = new BehaviorSubject<boolean>(false);
  public tick$ = new EventEmitter<AppBeat>();
  
  private _interval!: Subscription;

  private set _playing(value: boolean){
    this.playing$.next(value);
  }

  private get _playing(): boolean {
    return this.playing$.value;
  }

  private _beat: number = -1;
  private _measure: number = -1;
  private _cycle: number = -1;

  constructor() { }
  

  public setTempo(value: number){
    if (this._playing) return;

    if(value > MAXTEMPO || value < MINTEMPO) return;

    this.tempo$.next(value);
  }

  public start(){
    if (this._playing) return;
    if (this._interval) this._interval.unsubscribe();

    this._playing = true;
    this._cycle = 0;
    this._beat = -1;
    this._measure = -1;

    this._interval = interval(60000 / this.tempo$.value)
      .pipe(take(MAX_CYCLES * 4))
    .subscribe(() => {
      this._beat = (this._beat + 1) % 4;
      if (this._beat == 0) {
        this._measure = (this._measure + 1) % 3;
        if (this._measure == 0) {
          this._cycle += 1;
          if (this._cycle == MAX_CYCLES) {
            this.stop();
          }
        }
      }

      this.tick$.emit(({
        playing: true,
        measure: this._measure,
        beat: this._beat,
        cycle: this._cycle
      }));
    });
  }

  public stop(){
    if(!this._playing) return;
    
    this._playing = false;

    if (!this._interval) return;

    this._interval.unsubscribe();
    this.tick$.emit(({
      playing: false,
      measure: this._measure,
      beat: this._beat,
      cycle: this._cycle
    }))
  }

}
