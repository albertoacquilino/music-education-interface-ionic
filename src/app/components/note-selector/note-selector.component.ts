/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TRUMPET_NOTES, CLARINET_NOTES } from 'src/app/constants';
import { ScrollImageComponent } from '../scroll-image-selector/scroll-image-selector.component';

/**
 * NoteSelectorComponent is responsible for displaying a note selector interface.
 * It allows users to select musical notes and emits changes when a note is selected.
 *
 * @example
 * <note-selector [label]="Note" [note]="1" [selectedInstrument]="selectedInstrument" (change)="onNoteChange($event)"></note-selector>
 */
@Component({
  selector: 'note-selector',
  template: `
      <div class="simulate-input">
        <div class="title-section-wrapper">{{this.label}}</div>
        <div [id]="_id" expand="block" class="note-image">
          <img id="note-image-id" [src]="getNoteImg(note)">
        </div>
        <ion-modal [trigger]="_id"
            [canDismiss]="canDismiss"
            [initialBreakpoint]="1"
            [breakpoints]="[0, 1]"
            [handle]="false"
            >
            <ng-template>
              <scroll-image-component
                [images]="noteImages"
                [index]="note"
                (indexChange)="change.emit($event)"
              ></scroll-image-component>
          </ng-template>
        </ion-modal>
      </div>
  `,
  styles: [`
    #note-image-id {
      width: 100%;
    }

    .simulate-input {
      background-color: #ececec;
      border: 1px solid lightgrey;
      border-radius: 6px;
      padding:1px 15px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: black;
      max-width: 165px;
      max-height: 165px;
    }

  `],

  standalone: true,
  imports: [
    ScrollImageComponent, CommonModule, IonicModule
  ]
})
export class NoteSelectorComponent implements OnInit {
  private _selectedInstrument: string = 'trumpet';
  _id = `note-selector-${Math.round(Math.random() * 100)}`;
  @Input() label: string = '';
  @Input() note!: number;
  @Input() useFlatsAndSharps: boolean = true;
  @Input() set selectedInstrument(value: string) {
    this._selectedInstrument = value;
    this.updateNoteImages();
  }
  @Output() change: EventEmitter<number> = new EventEmitter<number>();

  noteImages: string[] = [];

  constructor() { }

  ngOnInit() {
    this.updateNoteImages();
  }

  private updateNoteImages() {
    const notes = this._selectedInstrument === 'trumpet' ? TRUMPET_NOTES : CLARINET_NOTES;
    this.noteImages = notes.map(note => `assets/images/${this._selectedInstrument}_notes_images/_${note[0]}.svg`);
  }

  getNoteImg(note: number): string {
    return note >= 0 && note < this.noteImages.length ? this.noteImages[note] : '';
  }

  /**
   * Determines whether the modal can be dismissed or not.
   * @param data Optional data passed to the modal.
   * @param role Optional role of the modal.
   * @returns A Promise that resolves to a boolean indicating whether the modal can be dismissed or not.
   */
  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }
}
