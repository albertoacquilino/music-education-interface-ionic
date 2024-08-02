import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({

  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  role = '';
  roles = [
    {
      id: 1,
      name: 'Teacher',
    },
    {
      id: 2,
      name: 'Learner',
    },
    {
      id: 3,
      name: 'Both',
    },
  ];
  constructor(private authService: AuthService, private router: Router, private toastController: ToastController) { }

  handleChange(ev: any) {
    this.role = ev.target.value.name;
    console.log(this.role);
    console.log('Current value:', JSON.stringify(ev.target.value));
  }

  trackItems(index: number, item: any) {
    return item.id;
  }
  async register() {
    try {
      await this.authService.register(this.email, this.password);
      this.showToast('Registration Successful. Please login.', 'success');
      this.clearForm();
      this.router.navigate(['/']);
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
    this.role = '';

  }
}
