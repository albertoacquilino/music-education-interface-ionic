import { AfterViewInit, Component } from "@angular/core";
import { ScoreComponent } from "../components/score/score.component";
import { Score } from '../models/score.types';
import { CommonModule } from "@angular/common";
import { Flow } from 'vexflow';
import { SoundsService } from "../services/sounds.service";
import { DYNAMICS } from "../constants";
import { IonicModule } from "@ionic/angular";

@Component({
    selector: "app-test-score",
    template: `
    <ion-content class="ion-padding">
    <div>
        <ion-button (click)="play('p')">piano</ion-button>
    </div>
    <div>
        <ion-button (click)="play('mf')">mezzoforte</ion-button>
    </div>
    <div>
        <ion-button (click)="play('f')">forte</ion-button>
    </div>

    <hr>
    <ng-container *ngFor="let volume of [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]">
        <div>
            <ion-button (click)="playVolume(volume)">{{volume}}</ion-button>
        </div>
    </ng-container>
    </ion-content>
    `,
    styles: [],
    standalone: true,
    imports: [CommonModule, IonicModule]
})
export class ScoreComponentTest {
    constructor(private sounds: SoundsService) { }

    play(label: string) {
        const dynamic = DYNAMICS.find(d => d.label === label);
        if (!dynamic) {
            return;
        }
        this.sounds.setVolume(dynamic.volume);
        this.sounds.playTrumpetSound(10);
    }

    playVolume(volume: number) {
        this.sounds.setVolume(volume);
        this.sounds.playTrumpetSound(10);
    }
}