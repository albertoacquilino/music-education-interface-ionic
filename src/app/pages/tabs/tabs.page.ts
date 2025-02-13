/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import {Component, ViewChild} from '@angular/core';
import {IonicModule, IonTabs, MenuController} from '@ionic/angular';
import { BeatService } from 'src/app/services/beat.service';
import { TabsService } from 'src/app/services/tabs.service';
import {Router} from "@angular/router";
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  imports: [IonicModule],
  standalone: true
})
export class TabsComponent {
  constructor(private tabsService: TabsService,     private router: Router, private menu: MenuController) { }

  @ViewChild('tabs', { static: false }) tabs: IonTabs | undefined;

  isDisabled(): boolean {
    return this.tabsService.getDisabled();
  }

  onChange(event: any) {
    console.log(event);
  }

  checkTab() {
    const selected = this.tabs?.getSelected();
    return selected !== 'exercise';
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  async openMenu() {
    if (await this.menu.isOpen('settingsMenu')) {
      await this.menu.close('settingsMenu');
    } else {
      await this.menu.open('settingsMenu');
    }
  }

}
