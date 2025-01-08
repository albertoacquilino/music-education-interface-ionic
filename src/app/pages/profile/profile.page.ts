import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ProfilePage {

  displayName!: string;
  emailAddress!: string;
  ProfileImg!: string;
  UserID!: string;

  constructor(private authService: AuthService, private router: Router) { }

  ionViewWillEnter() {
    const user = JSON.parse(localStorage.getItem("LoggedInUser")!);

    if (user) {
      this.emailAddress = user.email;
      this.ProfileImg = user.picture;
      this.UserID = user.email.split('@')[0];
      this.displayName = user.name;
    } else {
      this.emailAddress = '';
      this.displayName = 'Guest';
      this.ProfileImg = 'assets/images/user.png';
      this.UserID = '';
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  signOut() {
    localStorage.removeItem('LoggedInUser');
    this.authService.signOut();
  }
}


