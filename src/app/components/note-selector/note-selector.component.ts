import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScrollImageComponent } from '../scroll-image-selector/scroll-image-selector.component';
import { CommonModule } from '@angular/common';
import { IonicModule, PickerController } from '@ionic/angular';
import { NOTES } from 'src/app/constants';

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
      padding: 10px 10px;
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

  _id = `note-selector-${Math.round(Math.random() * 100)}`;
  @Input() label: string = '';
  @Input() note!: number;
  @Input() useFlatsAndSharps: boolean = true;
  @Output() change: EventEmitter<number> = new EventEmitter<number>();

  noteImages = NOTES.map(note => `assets/images/notes_images/_${note[0]}.svg`);

  constructor() { }

  ngOnInit() { }

  getNoteImg(note: number): string {
    return note ? this.noteImages[note] : '';
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
