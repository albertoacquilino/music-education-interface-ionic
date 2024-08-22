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
