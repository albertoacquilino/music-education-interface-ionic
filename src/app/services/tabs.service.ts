/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * Service for managing the state of tabs in the application.
 */
export class TabsService {
  private disabled = false; // Indicates whether the tabs are disabled

  /**
   * Creates an instance of TabsService.
   */
  constructor() { }
  /**
   * Sets the disabled state of the tabs.
   * @param {boolean} disabled - A boolean indicating whether to disable the tabs.
   * @returns void
   * @example
   * tabsService.setDisabled(true); // Disables the tabs
   */
  setDisabled(disabled: boolean) {
    this.disabled = disabled;
  }

  /**
   * Gets the current disabled state of the tabs.
   * @returns {boolean} True if the tabs are disabled, otherwise false.
   * @example
   * const isDisabled = tabsService.getDisabled(); // Retrieves the disabled state
   */
  getDisabled(): boolean {
    return this.disabled; // Return the current disabled state
  }
}


