/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { initializeApp } from 'firebase/app';
import { getAdditionalUserInfo, getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

declare var google: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
/**
 * SignupPage class represents the user sign-up interface of the music education application.
 */
export class SignupPage implements AfterViewInit {
  @ViewChild('googleBtn', { static: true }) googleBtn!: ElementRef;

  /**
   * The email address of the user.
   */
  email: string = '';

  /**
   * The password of the user.
   */
  password: string = '';

  /**
   * Creates an instance of SignupPage.
   * @param authService - The service for managing authentication.
   * @param router - The router for navigation.
   * @param toastController - The controller for displaying toast messages.
   * @param ngZone - The Angular zone for change detection.
   */
  constructor(private authService: AuthService, private router: Router, private toastController: ToastController, private ngZone: NgZone) { }

  /**
   * Lifecycle hook that is called after the view has been initialized.
   * Initializes Google Sign-In and sets up the sign-in button.
   * @returns void
   */
  ngAfterViewInit(): void {
    initializeApp(environment.firebaseConfig);

    google.accounts.id.initialize({
      client_id: '838282036165-dbqml0efrbvalsq84tork988akt429kr.apps.googleusercontent.com',
      callback: (resp: any) => this.handleLogin(resp),
    });

    google.accounts.id.renderButton(this.googleBtn.nativeElement, {
      theme: 'filled_blue',
      size: 'medium',
      shape: 'pill',
      width: 250,
    });
  }

  /**
   * Decodes the JWT token to extract user information.
   * @param token - The JWT token to decode.
   * @returns The decoded token payload.
   */
  private decodeToken(token: string) {
    return JSON.parse(atob(token.split(".")[1]));
  }

  /**
   * Handles the Google Sign-In response.
   * @param response - The response object from Google Sign-In.
   * @returns void
   */
  async handleLogin(response: any) {
    if (response) {
      const credential = GoogleAuthProvider.credential(response.credential);
      const auth = getAuth();
      try {
        const userCredential = await signInWithCredential(auth, credential);
        const additionalUserInfo = getAdditionalUserInfo(userCredential);
        const payLoad = this.decodeToken(response.credential);
        localStorage.setItem("LoggedInUser", JSON.stringify(payLoad));
        console.log("User Info", JSON.stringify(payLoad));
        this.ngZone.run(() => {
          if (additionalUserInfo?.isNewUser ) {
            this.router.navigate(['register'], { state: { email: userCredential.user.email } });
          } else {
            this.router.navigate(['home']);
          }
        });
      } catch (error) {
        console.error("Error during sign-in:", error);
        this.showToast('Login failed. Please try again.', 'danger');
      }
    }
  }

  /**
   * Signs up a new user with the provided email and password.
   * @returns void
   */
  async signUp() {
    try {
      await this.authService.register(this.email, this.password);
      this.showToast('Sign Up Successful! Please enter your details.', 'success');
      this.router.navigate(['/register'], { state: { email: this.email } });
      this.clearForm();
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.showToast('User  credentials already exist. Please login.', 'danger');
      } else {
        this.showToast(error.message || 'Registration failed. Please try again.', 'danger');
      }
      this.clearForm();
      console.error('Registration error:', error);
    }
  }

  /**
   * Displays a toast message.
   * @param message - The message to display.
   * @param color - The color of the toast (e.g., 'success', 'danger').
   * @returns void
   */
  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      color: color,
      message,
      duration: 4000,
      position: "top",
    });
    toast.present();
  }

  /**
   * Clears the email and password fields.
   * @returns void
   */
  private clearForm() {
    this.email = '';
    this.password = '';
  }

  /**
   * Navigates to the sign-in page.
   * @returns void
   */
  navigateToSignin() {
    this.router.navigate(['/']);
  }
}

