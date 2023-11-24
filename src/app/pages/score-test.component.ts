import { AfterViewInit, Component } from "@angular/core";
import { Score, ScoreComponent } from "../components/score/score.component";
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
                { notes: ["g/4"], duration: 'w'}, 
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


    ngAfterViewInit() {
        const { Factory, EasyScore, System } = Flow;

        const vf = new Factory({
            renderer: { elementId: 'test', width: 500, height: 200 },
        });

        const score = vf.EasyScore();
        const system = vf.System();

        system
            .addStave({
                voices: [
                    //@ts-ignore
                    score.voice(score.notes('C#5/q, B4, A4, G#4', { stem: 'up' })),
                    //@ts-ignore
                    score.voice(score.notes('C#4/h, C#4', { stem: 'down' })),
                ],
            })
            .addClef('treble')
            .addTimeSignature('4/4');
        
        
        system.addStave({
                voices: [
                    //@ts-ignore
                    score.voice(score.notes('C#5/q, B4, A4, G#4', { stem: 'up' })),
                    //@ts-ignore
                    score.voice(score.notes('C#4/h, C#4', { stem: 'down' })),
                ],
            })
            .addClef('treble')
            .addTimeSignature('4/4')

        vf.draw();
    }

}