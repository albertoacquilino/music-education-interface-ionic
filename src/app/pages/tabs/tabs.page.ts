import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { BeatService } from 'src/app/services/beat.service';
import { TabsService } from 'src/app/services/tabs.service';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  imports: [IonicModule],
  standalone: true
})
export class TabsComponent {
  constructor(private tabsService: TabsService) { }

  isDisabled(): boolean {
    return this.tabsService.getDisabled();
  }

  onChange(event: any) {
    console.log(event);
  }

}
