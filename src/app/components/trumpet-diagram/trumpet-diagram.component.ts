/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * TrumpetDiagramComponent is responsible for displaying a trumpet diagram interface.
 * It shows fingering positions for a trumpet and highlights active buttons based on the provided indices.
 * 
 * @example
 * <trumpet-diagram [trumpetButtons]="[0, 1, 2]"></trumpet-diagram>
 */
@Component({
  selector: 'trumpet-diagram',
  templateUrl: './trumpet-diagram.component.html',
  styleUrls: ['./trumpet-diagram.component.scss'],
  imports: [CommonModule],  // Include CommonModule in the imports array
  standalone: true
})
export class TrumpetDiagramComponent implements OnInit, OnChanges {
  /** 
   * Input property for the trumpet button indices to be activated.
   * 
   * This property accepts an array of numbers representing the indices of the buttons that should be highlighted.
   */
  @Input() trumpetButtons: number[] = []; // Indices of buttons to be activated

  /** 
   * QueryList of button elements in the SVG diagram.
   * 
   * This property is used to access the button elements for manipulation.
   */
  @ViewChildren('button') buttons!: QueryList<ElementRef<SVGElement>>;

  /** 
   * Array to track the active state of each button.
   * 
   * This array corresponds to the buttons in the trumpet diagram, where true indicates an active button.
   */
  isActive: boolean[] = [false, false, false, false]; // Tracks active state of each button

  /**
   * Constructor for the TrumpetDiagramComponent.
   */
  constructor() { }

  /**
   * Lifecycle hook that is called after the component has been initialized.
   * 
   * This method logs the initial trumpet button states to the console.
   */
  ngOnInit() {
    console.log('OnInit - trumpetButtons:', this.trumpetButtons);
  }

  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   * 
   * This method checks for changes in the trumpetButtons input and activates the corresponding buttons.
   * 
   * @param changes - An object that contains the changed properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['trumpetButtons']) {
      this.activateButtons(this.trumpetButtons);
    }
  }

  /**
   * Resets the active state of all buttons to false.
   * 
   * This method is called before activating new buttons to ensure that only the specified buttons are highlighted.
   */
  removeClasses() {
    this.isActive.fill(false); // Reset all to false
  }

  /**
   * Activates the buttons based on the provided positions.
   * 
   * This method updates the isActive array to reflect which buttons should be highlighted.
   * 
   * @param positions - An array of button indices to activate.
   */
  activateButtons(positions: number[]) {
    this.removeClasses(); // Reset all buttons to inactive
    positions.forEach(pos => {
      if (pos >= 0 && pos < this.isActive.length) {
        this.isActive[pos] = true; // Set the specified button to active
      }
    });
  }
}
