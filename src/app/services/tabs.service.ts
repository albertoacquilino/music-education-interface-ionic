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
export class TabsService {
  private disabled = false;

  constructor() { }

  setDisabled(disabled: boolean) {
    this.disabled = disabled;
  }

  getDisabled(): boolean {
    return this.disabled;
  }

}
