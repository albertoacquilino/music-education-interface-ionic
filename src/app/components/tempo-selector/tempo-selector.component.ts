import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule, PickerController } from '@ionic/angular';
import { range } from 'lodash';
import { MAXTEMPO, MINTEMPO } from 'src/app/constants';


/**
 * TempoSelectorComponent is responsible for displaying a tempo selector interface.
 * It allows users to select a tempo value and emits changes when a tempo is selected.
 * 
 * @example
 * <tempo-selector [tempo]="120" (change)="onTempoChange($event)"></tempo-selector>
 */

@Component({
  selector: 'tempo-selector',
  template: `
  <div class="simulate-input">
  <div class="title-section-wrapper">Tempo:</div>
  <div class="tempo" (click)="openPicker()">
    <h1>
        &#9833;=
        <span id="tempo">{{ tempo }} bpm</span>
    </h1>
  </div>
  
  </div>
  `,
  styles: [`
  .tempo h1 {
    font-size: 1.5em;
    text-align: center;
  }

  .tempo {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
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
    IonicModule, CommonModule
  ]
})
export class TempoSelectorComponent implements OnInit {
  /**
   * The current tempo value.
   */
  @Input() tempo!: number;

  /**
   * Event emitted when the tempo value changes.
   */
  @Output() change: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private _picker: PickerController,
  ) { }

  ngOnInit() { }


  /**
  * Opens the picker to select a new tempo value.
  */
  async openPicker() {
    // create list of options to be selected
    let options: { value: number, text: string }[];
    let selectedIndex = 0;
    let selectedValue: number;
    let rangeValues: number[] = [];
    let unit: string;

    selectedValue = this.tempo;
    rangeValues = range(MINTEMPO, MAXTEMPO + 1, 5);
    unit = 'bpm';

    options = rangeValues.map(value => ({
      value: value,
      text: `${value} ${unit}`
    }));

    selectedIndex = options.findIndex(option => option.value === selectedValue);

    const picker = await this._picker.create({
      columns: [
        {
          name: 'tempo',
          options: options,
          selectedIndex: selectedIndex
        },
      ],

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: (value) => {
            this.tempo = value['tempo'].value;
            this.change.emit(this.tempo);
          }
        },
      ],
    });

    await picker.present();

  }

}
