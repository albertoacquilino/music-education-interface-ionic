import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
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



  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      localStorage.removeItem('userToken');
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error during sign-out:', error);
      throw error;
    }
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}
