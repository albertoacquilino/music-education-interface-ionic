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
      return await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Error during sign-up:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('userToken', token);
      console.log(token);
      return userCredential;
    } catch (error) {
      throw error;
    }
  }
  async googleSignup(): Promise<any> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('userToken', token);
      console.log('Google sign-in successful, token:', token);
    } catch (error) {
      console.error('Error during Google sign-up:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    google.accounts.id.disableAutoSelect();
    this.router.navigate(['/']);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}
