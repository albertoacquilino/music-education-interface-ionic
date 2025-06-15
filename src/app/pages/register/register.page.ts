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
/**
 * RegisterPage class represents the user registration interface of the music education application.
 */
export class RegisterPage implements OnInit {
  /**
   * The email address of the user.
   */
  email: string = '';

  /**
   * The user ID derived from the email address.
   */
  userId: string = '';

  /**
   * The age of the user.
   */
  age!: number;

  /**
   * Error message for age validation.
   */
  ageError: string = '';

  /**
   * The progression speed for learning.
   */
  progressionSpeed: string = '20 min/day';

  /**
   * The role of the user (e.g., Teacher, Learner, Both).
   */
  role: string = '';

  /**
   * The learning mode selected by the user.
   */
  learningMode: string = '';

  /**
   * Indicates whether the terms have been accepted.
   */
  termsAccepted: boolean = false;

  /**
   * Indicates whether the terms modal is open.
   */
  isModalOpen = false;

  /**
   * List of roles available for selection.
   */
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

  /**
   * Creates an instance of RegisterPage.
   * @param router - The router for navigation.
   * @param toastController - The controller for displaying toast messages.
   * @param firebaseService - The service for managing Firebase interactions.
   */
  constructor(private router: Router, private toastController: ToastController, private firebaseService: FirebaseService) {}

  /**
   * Lifecycle hook that is called after the component has been initialized.
   * Retrieves the email and user ID from navigation state if available.
   * @returns void
   */
  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.email = navigation.extras.state['email'];
      this.userId = this.email.split('@')[0];
    }
  }

  /**
   * Handles changes in the role selection.
   * @param ev - The event containing the selected role.
   * @returns void
   */
  handleChange(ev: any) {
    this.role = ev.target.value.name;
    if (this.role === 'Teacher') {
      this.learningMode = '';
    }
  }

  /**
   * Tracks items in the roles array for rendering.
   * @param index - The index of the item.
   * @param item - The item to track.
   * @returns The ID of the item.
   */
  trackItems(index: number, item: any) {
    return item.id;
  }

  /**
   * Registers a new user with the provided information.
   * Checks if the user already exists and shows a toast message accordingly.
   * @returns void
   */
  async register() {
    try {
      const userExists = await this.firebaseService.checkUserExists(this.userId);
      if (userExists) {
        this.showToast('User  already exists.', 'danger');
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

      await this.firebaseService.registerUser (user);
      this.showToast('Registration Successful. Welcome!', 'success');
      this.clearForm();
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.showToast(error, 'danger');
      console.error('Registration error:', error);
    }
  }

  /**
   * Validates the form inputs.
   * @returns {boolean} True if the form is valid, otherwise false.
   */
  get isFormValid() {
    return (
      this.age !== null &&
      !isNaN(Number(this.age)) &&
      this.age >= 0 &&
      this.progressionSpeed !== '' &&
      this.role !== '' &&
      (this.role !== 'Learner' && this.role !== 'Both' || this.learningMode !== '') &&
      this.termsAccepted
    );
  }

  /**
   * Validates the age input.
   * @param event - The event containing the age value.
   * @returns void
   */
  validateAge(event: any) {
    const value = event.target.value;
    if (value < 0) {
      this.ageError = 'Age cannot be negative';
      this.age = null!;
    } else {
      this.ageError = '';
    }
  }

  /**
   * Displays a toast message.
   * @param message - The message to display.
   * @param color - The color of the toast (e.g., 'success', 'danger').
   * @returns void
   */
  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      color: color,
      message,
      duration: 4000,
      position: "top",
    });
    toast.present();
  }

  /**
   * Clears the form inputs.
   * @returns void
   */
  private clearForm() {
    this.email = '';
    this.age = null!;
    this.progressionSpeed = '20 min/day';
    this.role = '';
    this.learningMode = '';
    this.termsAccepted = false;
  }

  /**
   * Opens the terms modal.
   * @returns void
   */
  openTermsModal() {
    this.isModalOpen = true;
  }

  /**
   * Closes the terms modal.
   * @returns void
   */
  closeTermsModal() {
    this.isModalOpen = false;
  }
}

