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
/**
 * TabsComponent class represents the tab navigation interface of the music education application.
 */
export class TabsComponent {
  

  /**
   * Creates an instance of TabsComponent.
   * @param tabsService - The service for managing tab states.
   * @param router - The router for navigation.
   * @param menu - The menu controller for managing side menus.
   */
  constructor(private tabsService: TabsService, private router: Router, private menu: MenuController) { }
  @ViewChild('tabs', { static: false }) tabs: IonTabs | undefined;
  /**
   * Checks if the tabs are disabled.
   * @returns {boolean} True if the tabs are disabled, otherwise false.
   */
  isDisabled(): boolean {
    return this.tabsService.getDisabled();
  }

  /**
   * Handles tab change events.
   * @param event - The event object containing information about the tab change.
   * @returns void
   */
  onChange(event: any) {
    console.log(event);
  }

  /**
   * Checks if the currently selected tab is not the 'exercise' tab.
   * @returns {boolean} True if the selected tab is not 'exercise', otherwise false.
   */
  checkTab() {
    const selected = this.tabs?.getSelected();
    return selected !== 'exercise';
  }

  /**
   * Navigates to the user profile page.
   * @returns void
   */
  goToProfile() {
    this.router.navigate(['/profile']);
  }

  /**
   * Opens or closes the settings menu.
   * @returns {Promise<void>} A promise that resolves when the menu is opened or closed.
   */
  async openMenu() {
    if (await this.menu.isOpen('settingsMenu')) {
      await this.menu.close('settingsMenu');
    } else {
      await this.menu.open('settingsMenu');
    }
  }
}

