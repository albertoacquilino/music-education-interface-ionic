declare var google: any;
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private router: Router) { }

  async register(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log("User", userCredential);
      localStorage.setItem('LoggedInUser', JSON.stringify(userCredential.user));
      return userCredential;
    } catch (error) {
      console.error('Error during sign-up:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log("User", userCredential);
      localStorage.setItem('LoggedInUser', JSON.stringify(userCredential.user));
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    localStorage.removeItem("LoggedInUser");
    google.accounts.id.disableAutoSelect();
    this.router.navigate(['/']);
  }

}
