/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

/**
 * Unit tests for the AppComponent.
 * This test suite verifies the creation of the AppComponent.
 */
describe('AppComponent', () => {
  /**
   * Configures the testing module before each test.
   * This includes importing the AppComponent and providing necessary dependencies.
   * @returns {Promise<void>} A promise that resolves when the module is configured.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], // Import the AppComponent for testing
      providers: [provideRouter([])], // Provide an empty router for the component
    }).compileComponents();
  });

  /**
   * Test to verify that the AppComponent is created successfully.
   * This test checks if the component instance is truthy.
   */
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent); // Create a fixture for the AppComponent
    const app = fixture.componentInstance; // Get the component instance
    expect(app).toBeTruthy(); // Assert that the component instance is truthy
  });
});

