import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { Haptics } from '@capacitor/haptics';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CommonModule } from '@angular/common';
import { range } from 'lodash';
import { NOTES } from '../constants';



@Component({
    selector: 'scroll-image-component',
    template: `
    <div class="container">
      <div class="image-container">
        <img [src]="image">
      </div>

      <div class="scrollable" 
            #scrollContainer 
            (scroll)="onScroll()">
            <div *ngFor="let image of images" class="scroll-element" [style.height]="scrollElementHeight + 'px'">
            </div>
            <div *ngFor="let i of images" class="scroll-element" [style.height]="scrollElementHeight + 'px'"></div>
      </div>
    </div>
    `,
    styles: [`
    .container {
      position: relative;
      height: 300px; /* Set the desired height */
      width: 100%; /* Set the desired width */
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
    }

    .scroll-element{
        width:100%;
    }

    .image-container {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      img {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        object-fit: contain;
      }
    }

    `],
    standalone: true,
    imports: [IonicModule, CommonModule, FontAwesomeModule],
})
export class ScrollImageComponent implements AfterViewInit, OnChanges{
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
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['index']) {
            const idx = changes['index'].currentValue;
            if (idx !== this.index) {
                this.index = idx;
                this.image = this.images[idx];
            }
        }

        if(changes['images']){
            this.images = changes['images'].currentValue;
        }
    }

    drag($event: any) {
        console.log('dragging', $event);
    }

    onScroll() {
        // cancel timeout
        if (this.snapTimeout) {
            clearTimeout(this.snapTimeout);
            this.snapTimeout = null;
        }

        const element = this.scrollContainer.nativeElement;
        const scrollPosition = element.scrollTop;

        let idx = Math.floor(scrollPosition / this.scrollElementHeight);
        idx = Math.min(idx, this.images.length - 1);
        idx = Math.max(idx, 0);

        if(idx !== this.index) {
            Haptics.selectionChanged();
        }
        
        this.index = idx;
        this.image = this.images[this.index];
        this.indexChange.emit(this.index);

        // set timeout to snap to the nearest note if inactive for 200msec
        this.snapTimeout = setTimeout(() => {
            // snap to the nearest note
            const snapTo = idx * this.scrollElementHeight;
            element.scrollTo({top: snapTo, behavior: 'smooth'});
            this.snapTimeout = null;
        }, 100);
    }

}