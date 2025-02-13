/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule


/**
 * TrumpetDiagramComponent is responsible for displaying a trumpet diagram interface.
 * It shows fingering positions for a trumpet and highlights active buttons.
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
  @Input() trumpetButtons: number[] = []; // Indices of buttons to be activated

  @ViewChildren('button') buttons!: QueryList<ElementRef<SVGElement>>;
  isActive: boolean[] = [false, false, false, false]; // Tracks active state of each button

  constructor() { }

  ngOnInit() {
    console.log('OnInit - trumpetButtons:', this.trumpetButtons);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['trumpetButtons']) {
      this.activateButtons(this.trumpetButtons);
    }
  }

  removeClasses() {
    this.isActive.fill(false); // Reset all to false
  }

  activateButtons(positions: number[]) {
    this.removeClasses();
    positions.forEach(pos => {
      if (pos >= 0 && pos < this.isActive.length) {
        this.isActive[pos] = true;
      }
    });
  }
}

