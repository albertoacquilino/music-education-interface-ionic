import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
@Component({

  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class RegisterPage {
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

  compareWith(o1: { id: any; }, o2: { id: any; }) {
    return o1.id === o2.id;
  }

  handleChange(ev: any) {
    this.role = ev.target.value.name;
    console.log(this.role);
    console.log('Current value:', JSON.stringify(ev.target.value));
  }

  trackItems(index: number, item: any) {
    return item.id;
  }
}
