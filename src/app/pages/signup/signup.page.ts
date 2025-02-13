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

export class SignupPage implements AfterViewInit {
  @ViewChild('googleBtn', { static: true }) googleBtn!: ElementRef;
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, private toastController: ToastController, private ngZone: NgZone) { }


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

  private decodeToken(token: string) {
    return JSON.parse(atob(token.split(".")[1]));
  }

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
          if (additionalUserInfo?.isNewUser) {
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

  async signUp() {
    try {
      await this.authService.register(this.email, this.password);
      this.showToast('Sign Up Successful! Please enter your details.', 'success');
      this.router.navigate(['/register'], { state: { email: this.email } });
      this.clearForm();
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.showToast('User credentials already exist. Please login.', 'danger');
      } else {
        this.showToast(error.message || 'Registration failed. Please try again.', 'danger');
      }
      this.clearForm();
      console.error('Registration error:', error);
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      color: color,
      message,
      duration: 4000,
      position: "top",
    });
    toast.present();
  }
  private clearForm() {
    this.email = '';
    this.password = '';
  }
  navigateToSignin() {
    this.router.navigate(['/']);
  }

}
