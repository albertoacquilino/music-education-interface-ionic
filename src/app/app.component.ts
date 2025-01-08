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
  constructor(private platform: Platform, private pitchService: PitchService) {
    StatusBar.show();
  }

  async ngAfterViewInit() {

    // keep the screen awake using plugin
    await KeepAwake.keepAwake();

    if (this.platform.is('android') || this.platform.is('ios')) {
      const checkPermissionsResult = await Microphone.checkPermissions();
      if (checkPermissionsResult.microphone === 'denied') {
        const requestPermissionsResult = await Microphone.requestPermissions();
        if (requestPermissionsResult.microphone === 'denied') {
          alert('Microphone permissions denied: Some features may not work as expected');
          return;
        }
      }
    }

    // start the pitch monitoring service
    this.pitchService.connect()
  }
}