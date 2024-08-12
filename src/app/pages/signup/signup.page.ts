import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class SignupPage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, private toastController: ToastController) { }
  async googleSignup() {
    try {
      await this.authService.googleSignup();
      this.showToast('Sign Up Successful! Please enter your details.', 'success');
      this.clearForm();
      this.router.navigate(['/register'], { queryParams: { data: this.email } });
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error && error.message) {
        errorMessage = error.message;
      }
      this.showToast(errorMessage, 'danger');
      console.error('Google Signup error:', error);
    }
  }
  async signUp() {
    try {
      await this.authService.register(this.email, this.password);
      this.showToast('Sign Up Successful! Please enter your details.', 'success');
      this.router.navigate(['/register'], { state: { email: this.email } });
      this.clearForm();
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error && error.message) {
        errorMessage = error.message;
      }
      this.showToast(errorMessage, 'danger');
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
