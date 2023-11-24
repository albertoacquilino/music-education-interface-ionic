import { Component } from "@angular/core";
import { Score, ScoreComponent } from "../components/score/score.component";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-test-score",
    template: `
        <app-score [score]="score"></app-score>
        <button (click)="changeScore()">change</button>
    `,
    styles: [],
    standalone: true,
    imports: [ScoreComponent, CommonModule]
    })
export class ScoreComponentTest {
    public score: Score = {
        clef: 'treble',
        dynamic: 'mf',
        timeSignature: "4/4",
        keySignature: "C",
        measures: [
            [
                { notes: ["b/4", 'e/3'], duration: 'q'}, 
                { notes: ["c/4"], duration: 'q' },
                { notes: ["d/4"], duration: 'q' },
                { notes: ["e/4"], duration: 'q' }
            ],[
                { notes: ["a/4"], duration: 'q'}, 
                { notes: ["d/4"], duration: 'q' },
                { notes: ["c/4"], duration: 'q' },
                { notes: ["b/4"], duration: 'q' }
            ],[
                { notes: ["b/4"], duration: 'w'}, 
            ],[
                { notes: ["b/4"], duration: 'w'}, 
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
                { notes: ["b/4", 'e/3'], duration: 'q' },
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
}