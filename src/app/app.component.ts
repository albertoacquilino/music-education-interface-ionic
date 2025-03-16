/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { AfterViewInit, Component } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { Microphone, PermissionStatus } from '@mozartec/capacitor-microphone';
import { PitchService } from './services/pitch.service';
import { KeepAwake } from '@capacitor-community/keep-awake';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent implements AfterViewInit {
  constructor(
    private platform: Platform,
    private pitchService: PitchService
  ) {
    StatusBar.show();
  }

  /**
   * Applies a theme class to the <body> element and
   * stores the selected theme in localStorage.
   *
   * @param theme - e.g. 'default', 'neon', 'amber', 'bubblegum'
   */
  setTheme(theme: string) {

    // Removing any    existing theme classes
    document.body.classList.remove(
      'theme-default',
      'theme-neon',
      'theme-amber',
      'theme-bubblegum'
    );

    // If user picks 'default', skip adding a custom class
   
    if (theme !== 'default') {
      document.body.classList.add(`theme-${theme}`);
    }

    // Save user choice in localStorage for future visits
    localStorage.setItem('appTheme', theme);
  }

  async ngAfterViewInit() {



    // Keep the device screen awake
    await KeepAwake.keepAwake();



    // Check microphone permissions on Android/iOS devices
    if (this.platform.is('android') || this.platform.is('ios')) {
      const checkPermissionsResult = await Microphone.checkPermissions();
      if (checkPermissionsResult.microphone === 'denied') {
        const requestPermissionsResult = await Microphone.requestPermissions();
        if (requestPermissionsResult.microphone === 'denied') {
          alert(
            'Microphone permissions denied: Some features may not work as expected'
          );
          return;
        }
      }
    }

    

    // pitch monitoring
    this.pitchService.connect();



    //                       Load the user's previously selected theme or default
    const savedTheme = localStorage.getItem('appTheme') || 'default';

          this.setTheme(savedTheme);
  }
}
