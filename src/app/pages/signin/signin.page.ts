import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class SigninPage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, private toastController: ToastController) { }
  async login() {
    try {
      await this.authService.signIn(this.email, this.password);
      this.router.navigate(['/home']);
      this.email = '';
      this.password = '';
    } catch (error) {
      console.log(error);
      const toast = await this.toastController.create({
        message: 'Invalid Credentials',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
      this.email = '';
      this.password = '';
      console.error('Login error:', error);
    }
  }
  navigate() {
    this.router.navigate(['/register']);
  }
}
