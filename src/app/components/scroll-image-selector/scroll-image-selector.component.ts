/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Haptics } from '@capacitor/haptics';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { Howl } from 'howler';

const TICK_SOUND = new Howl({ src: ['assets/sounds/tick_weak.wav'] });

@Component({
    selector: 'scroll-image-component',
    template: `
    <div class="container">
      <div class="image-container">
        <img [src]="image">
      </div>

      <div class="scrollable" 
            #scrollContainer 
            (scroll)="onScroll()" 
            (click)="onClick($event)">
            <div *ngFor="let image of images;" class="scroll-element" [style.height]="scrollElementHeight + 'px'"></div>
            <div *ngFor="let i of images" class="scroll-element" [style.height]="scrollElementHeight + 'px'"></div>
      </div>
    </div>
    `,
    styles: [`
    .container {
      position: relative;
      height: 300px;
      width: 100%;
      background-color: white;
      overscroll-behavior-y: contain;
    }

    .scrollable {
      position: absolute;
      top: 0;
      left: 0;
      overflow-y: scroll;
      height: 100%;
      width: 100%;
      scroll-snap-type: y proximity;
      cursor: pointer;
    }

    .scroll-element {
      width: 100%;
    }

    .image-container {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }

    .image-container img {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
    `],
    standalone: true,
    imports: [IonicModule, CommonModule, FontAwesomeModule],
})
export class ScrollImageComponent implements AfterViewInit, OnChanges {
    @Input() images: string[] = [];
    @Input() index: number = 0;
    @Input() scrollElementHeight: number = 30;
    @Output() indexChange: EventEmitter<number> = new EventEmitter<number>();

    image!: string;
    snapTimeout: ReturnType<typeof setTimeout> | null = null;

    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    constructor() {}

    ngAfterViewInit() {
        if (this.index <= 0) {
            this.index = 0;
        }
        this.image = this.images[this.index];
        this.setScrollPositionFromIndex(this.index);
    }

    setScrollPositionFromIndex(idx: number) {
        const position = idx * this.scrollElementHeight;
        setTimeout(() => {
            this.scrollContainer.nativeElement.scrollTo({ top: position, behavior: 'auto' });    
        }, 100);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['index']) {
            const idx = changes['index'].currentValue;
            if (idx !== this.index) {
                this.index = idx;
                this.image = this.images[idx];
                this.setScrollPositionFromIndex(idx);
            }
        }

        if (changes['images']) {
            this.images = changes['images'].currentValue;
        }
    }

    onScroll() {
        if (this.snapTimeout) {
            clearTimeout(this.snapTimeout);
            this.snapTimeout = null;
        }

        const element = this.scrollContainer.nativeElement;
        const scrollPosition = element.scrollTop;
        let idx = Math.floor(scrollPosition / this.scrollElementHeight);
        idx = Math.min(idx, this.images.length - 1);
        idx = Math.max(idx, 0);

        if (idx !== this.index) {
            Haptics.selectionChanged();
        }

        this.index = idx;
        this.image = this.images[this.index];
        this.indexChange.emit(this.index);

        this.snapTimeout = setTimeout(() => {
            const snapTo = idx * this.scrollElementHeight;
            element.scrollTo({ top: snapTo, behavior: 'smooth' });
            this.snapTimeout = null;
        }, 100);
    }

    /**
     * Handles clicks on the scrollable area to quickly select notes.
     * Clicking at the top selects the first note, clicking at the bottom selects the last note,
     * and clicking in between selects the closest corresponding note.
     */
    onClick(event: MouseEvent) {
        const container = this.scrollContainer.nativeElement;
        const clickY = event.clientY - container.getBoundingClientRect().top;
        const containerHeight = container.clientHeight;

        let idx: number;
        if (clickY < containerHeight * 0.2) {
            idx = 0; // Clicked near the top
        } else if (clickY > containerHeight * 0.8) {
            idx = this.images.length - 1; // Clicked near the bottom
        } else {
            idx = Math.round((clickY / containerHeight) * this.images.length);
        }

        this.setScrollPositionFromIndex(idx);
        this.indexChange.emit(idx);
    }
}
