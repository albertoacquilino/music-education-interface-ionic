import { AfterViewInit, Component } from "@angular/core";
import { ScoreComponent } from "../components/score/score.component";
import { Score } from '../models/score.types';
import { CommonModule } from "@angular/common";
import { Flow } from 'vexflow';

@Component({
    selector: "app-test-score",
    template: `
        <app-score [score]="score"></app-score>
        <button (click)="changeScore()">change</button>
        <div id="test" style="height:300px; widht: 600px;"></div>
    `,
    styles: [],
    standalone: true,
    imports: [ScoreComponent, CommonModule]
    })
export class ScoreComponentTest implements AfterViewInit {
    public score: Score = {
        clef: 'treble',
        dynamic: 'mf',
        timeSignature: "4/4",

        measures: [
            [
                { notes: ["b#/3", "d#/4"], duration: 'w' },
            ],
            [
                { notes: ["g#/4"], duration: 'w'}, 
            ],[
                { notes: ["eb/4"], duration: 'w'}, 
            ]
        ]
    }

    changeScore(){
        this.score = {
        clef: 'treble',
        dynamic: 'mf',
        dynamicPosition: 2,
        timeSignature: "4/4",
        keySignature: "C",
        measures: [
            [
                { notes: ["b#/4", 'eb/3'], duration: 'q' },
                { notes: ["c/4"], duration: 'q' },
                { notes: ["d/4"], duration: 'q' },
                { notes: ["e/4"], duration: 'q' }
            ], [
                { notes: ["b/4"], duration: 'w' },
            ], [
                { notes: ["b/4"], duration: 'w' },
            ]
        ]
    }


    }


    ngAfterViewInit() {
   }

}