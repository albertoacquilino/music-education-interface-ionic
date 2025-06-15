/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

declare var google: any;
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
/**
 * AuthService class provides methods for user authentication, including registration, sign-in, and sign-out.
 */
export class AuthService {

  /**
   * Creates an instance of AuthService.
   * @param auth - The Firebase Auth instance for managing authentication.
   * @param router - The router for navigation.
   */
  constructor(private auth: Auth, private router: Router) { }

  /**
   * Registers a new user with the provided email and password.
   * @param email - The email address of the user.
   * @param password - The password for the new account.
   * @returns {Promise<UserCredential>} A promise that resolves with the user's credentials upon successful registration.
   * @throws Will throw an error if registration fails.
   * @example
   * authService.register('user@example.com', 'password123')
   *   .then(userCredential => {
   *     console.log('User  registered:', userCredential);
   *   })
   *   .catch(error => {
   *     console.error('Registration error:', error);
   *   });
   */
  async register(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log("User ", userCredential);
      localStorage.setItem('LoggedInUser ', JSON.stringify(userCredential.user));
      return userCredential;
    } catch (error) {
      console.error('Error during sign-up:', error);
      throw error;
    }
  }

  /**
   * Signs in a user with the provided email and password.
   * @param email - The email address of the user.
   * @param password - The password for the account.
   * @returns {Promise<UserCredential>} A promise that resolves with the user's credentials upon successful sign-in.
   * @throws Will throw an error if sign-in fails.
   * @example
   * authService.signIn('user@example.com', 'password123')
   *   .then(userCredential => {
   *     console.log('User  signed in:', userCredential);
   *   })
   *   .catch(error => {
   *     console.error('Sign-in error:', error);
   *   });
   */
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log("User ", userCredential);
      localStorage.setItem('LoggedInUser ', JSON.stringify(userCredential.user));
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Signs out the currently logged-in user.
   * @returns {Promise<void>} A promise that resolves when the user has been signed out.
   * @example
   * authService.signOut()
   *   .then(() => {
   *     console.log('User  signed out');
   *   })
   *   .catch(error => {
   *     console.error('Sign-out error:', error);
   *   });
   */
  async signOut(): Promise<void> {
    localStorage.removeItem("LoggedInUser ");
    google.accounts.id.disableAutoSelect();
    this.router.navigate(['/']);
  }
}
