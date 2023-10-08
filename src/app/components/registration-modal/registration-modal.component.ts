import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
    selector: 'registration-modal',
    template: `
    <ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-button color="medium" (click)="cancel()">Cancel</ion-button>
    </ion-buttons>
    <ion-title>Registration Info</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content class="ion-padding">
  <ion-item *ngIf="!group">
    <ion-input
    labelPlacement="stacked" label="Enter your name" 
    [(ngModel)]="name" placeholder="Your name"></ion-input>
  </ion-item>
  <ion-item *ngIf="group">
    <ion-label>Registered as</ion-label>
    <ion-text>{{name}}</ion-text>
  </ion-item>
  <ion-item *ngIf="!group">
    <ion-input labelPlacement="stacked" label="Enter group password"
    [(ngModel)]="password" placeholder="Group Password"></ion-input>
  </ion-item>
  <ion-item *ngIf="group">
    <ion-label>Registered with Group</ion-label>
    <ion-text>{{group}}</ion-text>
  </ion-item>
  <ion-item *ngIf="error">
    <ion-text color="danger">{{error}}</ion-text>
  </ion-item>
  <ion-item *ngIf="!group">
    <ion-button (click)="register()" [strong]="true">Register</ion-button>
  </ion-item>

  <ion-item *ngIf="group">
    <ion-button (click)="clear()" [strong]="true">Clear Info</ion-button>
  </ion-item>

</ion-content>
    `,
    styles: [],
    standalone: true,
    imports: [IonicModule, FormsModule, CommonModule]

})
export class RegistrationModalComponent {
    name: string = '';
    password: string = '';
    group: string = '';
    error: string|null = null;

    constructor(
        private _modalCtrl: ModalController,
        private _firebase: FirebaseService,
    ) { 
        this.name = localStorage.getItem('user') || '';
        this.group = localStorage.getItem('group') || '';
    }

    async register() {
        const group = await this._firebase.registerToGroup(this.password, this.name);
        if(!group) {
            this.error = "Invalid group password";
            return;
        }
        this.group = group?.name || '';        
        
        this._modalCtrl.dismiss({ name: this.name }, 'confirm');
    }

    async clear(){
        this.name = '';
        this.password = '';
        this.group = '';
        this.error = null;
        await this._firebase.clearRegistration();
    }

    cancel() {
        this._modalCtrl.dismiss({}, 'cancel');
    }
}