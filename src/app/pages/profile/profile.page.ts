/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
/**
 * ProfilePage class represents the user profile interface of the music education application.
 */
export class ProfilePage {

  /**
   * The display name of the user.
   */
  displayName!: string;

  /**
   * The email address of the user.
   */
  emailAddress!: string;

  /**
   * The profile image URL of the user.
   */
  ProfileImg!: string;

  /**
   * The user ID derived from the email address.
   */
  UserID!: string;

  /**
   * Creates an instance of ProfilePage.
   * @param authService - The service for managing authentication.
   * @param router - The router for navigation.
   */
  constructor(private authService: AuthService, private router: Router) { }

  /**
   * Lifecycle hook that is called when the view is about to enter.
   * Retrieves user information from local storage and updates the profile fields.
   * @returns void
   */
  ionViewWillEnter() {
    const user = JSON.parse(localStorage.getItem("LoggedInUser ")!);

    if (user) {
      this.emailAddress = user.email;
      this.ProfileImg = user.picture;
      this.UserID = user.email.split('@')[0];
      this.displayName = user.name;
    } else {
      this.emailAddress = '';
      this.displayName = 'Guest';
      this.ProfileImg = 'assets/images/user.png';
      this.UserID = '';
    }
  }

  /**
   * Navigates back to the home page.
   * @returns void
   */
  goBack() {
    this.router.navigate(['/home']);
  }

  /**
   * Signs out the user and removes their information from local storage.
   * @returns void
   */
  signOut() {
    localStorage.removeItem('LoggedInUser ');
    this.authService.signOut();
  }
}

