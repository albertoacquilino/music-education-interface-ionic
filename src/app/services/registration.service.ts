import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RegistrationModalComponent } from '../components/registration-modal/registration-modal.component';

@Injectable({
    providedIn: 'root'
})
export class RegistrationService { 
    constructor(private modalCtrl: ModalController) { }

    async openModal() {
        const modal = await this.modalCtrl.create({
            component: RegistrationModalComponent,
        });
        modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm') {
            console.log('OK');
        }
    }
}
