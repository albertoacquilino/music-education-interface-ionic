import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NOTES } from '../../constants';
import { ScrollImageComponent } from './scroll-image-selector.component';


@Component({
    selector: 'scroll-image-page',
    template: `
    <ion-content>
        <scroll-image-component
            [images]="images"
            [index]="0">
        </scroll-image-component>
    </ion-content>
    `,
    styles: [],
    standalone: true,
    imports: [IonicModule, CommonModule, ScrollImageComponent],
})
export class ScrollImagePage {
    images = NOTES.map(note => `assets/images/notes_images/_${note[0]}.svg`);
}