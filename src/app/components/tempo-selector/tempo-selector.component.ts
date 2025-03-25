/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule, PickerController } from '@ionic/angular';
import { range } from 'lodash';
import { MAXTEMPO, MINTEMPO } from 'src/app/constants';
import { BeatService } from 'src/app/services/beat.service';


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
    private _tempo: BeatService
  ) { }

  ngOnInit() { }


  /**
  * Opens the picker to select a new tempo value.
  */
  async openPicker() {
    const tempoRange = range(MINTEMPO, MAXTEMPO + 1, 5);
    const options = tempoRange.map((tempo: number) => ({
      text: `${tempo} bpm`,
      value: tempo
    }));

    const picker = await this._picker.create({
      columns: [
        {
          name: 'tempo',
          options: options,
          selectedIndex: options.findIndex((option: any) => option.value === this.tempo)
        },
      ],
      cssClass: 'simple-picker',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: (value: any) => {
            const newTempo = value.tempo.value;
            this._tempo.setTempo(newTempo);
            this.tempo = newTempo;
            this.change.emit(newTempo);
          }
        },
      ],
    });
    
    await picker.present();
    
    // After picker is presented, add simple navigation
    setTimeout(() => {
      const pickerEl = document.querySelector('.simple-picker ion-picker-internal') as HTMLElement;
      if (!pickerEl) return;

      const pickerCol = pickerEl.querySelector('ion-picker-column') as any;
      if (!pickerCol) return;

      // Create nav controls
      const navControls = document.createElement('div');
      navControls.className = 'picker-nav-controls';
      navControls.innerHTML = `
        <button class="nav-btn up-btn">▲</button>
        <button class="nav-btn down-btn">▼</button>
      `;
      
      // Add to picker
      pickerEl.appendChild(navControls);
      
      // Get column and buttons
      const upBtn = pickerEl.querySelector('.up-btn') as HTMLButtonElement;
      const downBtn = pickerEl.querySelector('.down-btn') as HTMLButtonElement;
      
      if (pickerCol && upBtn && downBtn) {
        // Helper function to enable scroll into view
        const scrollToSelectedOption = (index: number) => {
          const opts = pickerEl.querySelectorAll('.picker-opt');
          if (opts && opts[index]) {
            opts[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        };
        
        // Up button - decrease value
        upBtn.addEventListener('click', () => {
          const currentIndex = pickerCol.selectedIndex || 0;
          if (currentIndex > 0) {
            pickerCol.setSelected(currentIndex - 1, 150);
            scrollToSelectedOption(currentIndex - 1);
          }
        });
        
        // Down button - increase value
        downBtn.addEventListener('click', () => {
          const currentIndex = pickerCol.selectedIndex || 0;
          if (currentIndex < options.length - 1) {
            pickerCol.setSelected(currentIndex + 1, 150);
            scrollToSelectedOption(currentIndex + 1);
          }
        });
      }
    }, 100);
  }

}
