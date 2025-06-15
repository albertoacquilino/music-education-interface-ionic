/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * SemaphoreLightComponent is responsible for displaying a semaphore light interface.
 * This component visually represents different actions (Rest, Listen, Play) using colored lights.
 * 
 * @example
 * <semaphore-light [currentAction]="currentAction"></semaphore-light>
 */
@Component({
  selector: 'semaphore-light',
  templateUrl: './semaphore-light.component.html',
  styleUrls: ['./semaphore-light.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SemaphoreLightComponent implements OnInit {
  /** 
   * Input property for the current action.
   * 
   * This property determines which action is currently active and changes the color of the semaphore lights accordingly.
   * 
   * @default ""
   */
  @Input() currentAction: string = ""; // Default to an empty string

  /**
   * Constructor for the SemaphoreLightComponent.
   */
  constructor() { }

  /**
   * Lifecycle hook that is called after the component has been initialized.
   * 
   * This method can be used to perform any additional initialization tasks.
   */
  ngOnInit() { }

  /**
   * Checks if the specified action is currently active.
   * 
   * @param action - The action to check (e.g., 'Rest', 'Listen', 'Play').
   * @returns True if the specified action is the current action; otherwise, false.
   */
  isActive(action: string): boolean {
    return this.currentAction === action;
  }

  /**
   * Checks if there is an active action.
   * 
   * @returns True if the current action is not an empty string; otherwise, false.
   */
  hasAction(): boolean {
    return this.currentAction !== "";
  }

  /**
   * Gets the color for the semaphore light based on the specified action.
   * 
   * @param action - The action for which to get the light color (e.g., 'Rest', 'Listen', 'Play').
   * @returns A string representing the RGBA color for the semaphore light.
   */
  getCircleColor(action: string): string {
    const active = this.isActive(action);
    switch (action) {
      case 'Rest':
        return active ? 'rgba(212, 0, 0, 1)' : 'rgba(212, 0, 0, 0.3)';
      case 'Listen':
        return active ? 'rgba(254, 173, 38, 1)' : 'rgba(254, 173, 38, 0.3)';
      case 'Play':
        return active ? 'rgba(45, 155, 43, 1)' : 'rgba(45, 155, 43, 0.3)';
      default:
        return 'rgba(0, 0, 0, 0.3)'; // Default color for unknown actions
    }
  }
}

