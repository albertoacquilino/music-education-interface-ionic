import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const DEFAULT_FREQUENCY = 440;

@Injectable({
  providedIn: 'root'
})
export class RefFreqService {

  private refFrequency$: BehaviorSubject<number>;
  private storageKey = 'refFreq';

  constructor() {
    const storedValue = localStorage.getItem(this.storageKey);
    const initialValue = storedValue ? parseInt(storedValue) : DEFAULT_FREQUENCY;
    this.refFrequency$ = new BehaviorSubject<number>(initialValue);
  }

  setRefFrequency(value: number): void {
    localStorage.setItem(this.storageKey, value.toString());
    this.refFrequency$.next(value);
  }

  getRefFrequency(): Observable<number> {
    return this.refFrequency$.asObservable();
  }

  getCurrentRefFrequency(): number {
    return this.refFrequency$.getValue();
  }
}




