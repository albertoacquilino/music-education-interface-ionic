/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})

export class RegisterPage implements OnInit {
  email: string = '';
  userId: string = '';
  age!: number;
  progressionSpeed: string = '20 min/day';
  role: string = '';
  learningMode: string = '';
  termsAccepted: boolean = false;
  isModalOpen = false;
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
  constructor(private router: Router, private toastController: ToastController, private firebaseService: FirebaseService) {

  }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.email = navigation.extras.state['email'];
      this.userId = this.email.split('@')[0];
    }
  }

  handleChange(ev: any) {
    this.role = ev.target.value.name;
    if (this.role === 'Teacher') {
      this.learningMode = '';
    }
  }

  trackItems(index: number, item: any) {
    return item.id;
  }

  async register() {
    try {
      const userExists = await this.firebaseService.checkUserExists(this.userId);
      if (userExists) {
        this.showToast('User already exists.', 'danger');
        this.router.navigate(['/home']);
        return;
      }

      const user = {
        email: this.email,
        userId: this.userId,
        age: this.age,
        progressionSpeed: this.progressionSpeed,
        role: this.role,
        learningMode: this.role === 'Learner' || this.role === 'Both' ? this.learningMode : '',
      };

      await this.firebaseService.registerUser(user);
      this.showToast('Registration Successful. Welcome!', 'success');
      this.clearForm();
      this.router.navigate(['/home']);
    } catch (error: any) {

      this.showToast(error, 'danger');
      console.error('Registration error:', error);
    }
  }

  get isFormValid() {
    return (
      this.age !== null &&
      !isNaN(Number(this.age)) &&
      this.progressionSpeed !== '' &&
      this.role !== '' &&
      (this.role !== 'Learner' && this.role !== 'Both' || this.learningMode !== '') &&
      this.termsAccepted
    );
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
    this.age = null!;
    this.progressionSpeed = '20 min/day';
    this.role = '';
    this.learningMode = '';
    this.termsAccepted = false;
  }
  openTermsModal() {
    this.isModalOpen = true;
  }

  closeTermsModal() {
    this.isModalOpen = false;
  }

}
