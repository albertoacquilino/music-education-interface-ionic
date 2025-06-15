/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const DEFAULT_FREQUENCY = 440; // Default reference frequency in Hz

@Injectable({
  providedIn: 'root'
})
/**
 * Service for managing the reference frequency used in the application.
 */
export class RefFreqService {
  private refFrequency$: BehaviorSubject<number>; // Observable for the reference frequency
  private storageKey = 'refFreq'; // Key for local storage

  /**
   * Initializes the reference frequency service.
   * Retrieves the stored reference frequency from local storage or sets it to the default value.
   */
  constructor() {
    const storedValue = localStorage.getItem(this.storageKey);
    const initialValue = storedValue ? parseInt(storedValue) : DEFAULT_FREQUENCY;
    this.refFrequency$ = new BehaviorSubject<number>(initialValue);
  }

  /**
   * Sets the reference frequency and stores it in local storage.
   * @param value - The new reference frequency value in Hz.
   * @returns void
   * @example
   * refFreqService.setRefFrequency(440);
   */
  setRefFrequency(value: number): void {
    localStorage.setItem(this.storageKey, value.toString());
    this.refFrequency$.next(value);
  }

  /**
   * Returns an observable of the current reference frequency.
   * @returns {Observable<number>} An observable that emits the current reference frequency.
   * @example
   * refFreqService.getRefFrequency().subscribe(freq => {
   *   console.log('Current reference frequency:', freq);
   * });
   */
  getRefFrequency(): Observable<number> {
    return this.refFrequency$.asObservable();
  }

  /**
   * Gets the current reference frequency value.
   * @returns {number} The current reference frequency in Hz.
   * @example
   * const currentFreq = refFreqService.getCurrentRefFrequency();
   * console.log('Current reference frequency:', currentFreq);
   */
  getCurrentRefFrequency(): number {
    return this.refFrequency$.getValue();
  }
}





