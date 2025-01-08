import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * SemaphoreLightComponent is responsible for displaying a semaphore light interface.
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
  @Input() currentAction: string = ""; // Default to an empty string

  constructor() { }

  ngOnInit() { }

  isActive(action: string): boolean {
    return this.currentAction === action;
  }

  hasAction(): boolean {
    return this.currentAction !== "";
  }

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
        return 'rgba(0, 0, 0, 0.3)';
    }
  }
}
