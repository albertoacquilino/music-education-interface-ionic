import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { BeatService } from 'src/app/services/beat.service';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  imports: [IonicModule],
  standalone: true
})
export class TabsComponent {
  constructor(private _tempo : BeatService) { }

  onChange(event: any) {
    console.log(event);
  }
  isPlaying(): boolean {
    return this._tempo.playing$.value;
  }
}
