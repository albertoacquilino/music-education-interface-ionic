import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { getAdditionalUserInfo, getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';


declare var google: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class SigninPage implements AfterViewInit {
  @ViewChild('googleBtn', { static: true })
  googleBtn!: ElementRef;
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, private toastController: ToastController, private ngZone: NgZone) { }
  ngAfterViewInit(): void {
    const userInfo = localStorage.getItem('LoggedInUser');
    if (userInfo) {
      this.router.navigate(['/home']);
    }
    initializeApp(environment.firebaseConfig);

    google.accounts.id.initialize({
      client_id: '838282036165-dbqml0efrbvalsq84tork988akt429kr.apps.googleusercontent.com',
      callback: (resp: any) => this.handleLogin(resp),
    });

    google.accounts.id.renderButton(this.googleBtn.nativeElement, {
      theme: 'filled_blue',
      size: 'large',
      shape: 'rectangle',
      width: 300,
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
        console.log(userCredential);
        localStorage.setItem("LoggedInUser", JSON.stringify(userCredential.user));
        const additionalUserInfo = getAdditionalUserInfo(userCredential);
        const payLoad = this.decodeToken(response.credential);

        this.ngZone.run(() => {
          if (additionalUserInfo?.isNewUser) {
            this.router.navigate(['register'], { state: { email: userCredential.user.email } });
          } else {
            localStorage.setItem("LoggedInUser", JSON.stringify(payLoad));
            this.router.navigate(['home']);
          }
        });
      } catch (error) {
        console.error("Error during sign-in:", error);
        this.showToast('Login failed. Please try again.', 'danger');
      }
    }
  }

  async login() {
    try {
      await this.authService.signIn(this.email, this.password);
      this.router.navigate(['/home']);
      this.clearForm();
    } catch (error: any) {
      this.showToast('Invalid Credentials', 'danger');
      this.clearForm();
      console.error('Login error:', error);
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      color,
      message,
      duration: 3000,
      position: 'top',
    });
    await toast.present();
  }

  private clearForm() {
    this.email = '';
    this.password = '';
  }
  goToSignup() {
    this.router.navigate(['/signup']);
  }

  continueAsGuest() {
    this.router.navigate(['/home']);
  }
}

