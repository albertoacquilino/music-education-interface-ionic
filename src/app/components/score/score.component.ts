import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Flow } from 'vexflow';


@Component({
  selector: 'app-score',
  template: `<div id="score" style="background-color: white;"></div>`,
  styleUrls: ['./score.component.scss'],
  standalone: true
})
export class ScoreComponent  implements OnInit, AfterViewInit {
  //@ViewChild('score', {static: true}) scoreRef!: ElementRef;
  @Input() note: string = 'c/4'
  constructor(private hostElement: ElementRef) { }

  ngOnInit() {}

  ngAfterViewInit(): void {
    // Create a VexFlow renderer attached to the DIV element with id="output".
    const width = this.hostElement.nativeElement.innerWidth;
    const height = this.hostElement.nativeElement.innerHeight;
    
    const { Stave, StaveNote, Beam, Formatter, Renderer } = Flow;
    const div = document.getElementById("score");
    //@ts-ignore
    const renderer = new Renderer(div, Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(720, 130);
    const context = renderer.getContext();

    // Measure 1
    const staveMeasure1 = new Stave(10, 0, 100);
    staveMeasure1.addClef("treble").setContext(context).draw();
    const notesMeasure1 = [new StaveNote({ keys: ['b/4'], duration: "wr" })];

    // Helper function to justify and draw a 4/4 voice
    Formatter.FormatAndDraw(context, staveMeasure1, notesMeasure1);

    // Measure 2 - second measure is placed adjacent to first measure.
    //@ts-ignore
    const staveMeasure2 = new Stave(staveMeasure1.width + staveMeasure1.x, 0, 100);
    const notesMeasure2 = [new StaveNote({ keys: [this.note], duration: "w" })];

    staveMeasure2.setContext(context).draw();
    Formatter.FormatAndDraw(context, staveMeasure2, notesMeasure2);
   
    
    // Measure 2 - second measure is placed adjacent to first measure.
    //@ts-ignore
    const staveMeasure3 = new Stave(staveMeasure2.width + staveMeasure2.x, 0, 100);
    const notesMeasure3 = [new StaveNote({ keys: [this.note], duration: "w" })];

    staveMeasure3.setContext(context).draw();
    Formatter.FormatAndDraw(context, staveMeasure3, notesMeasure3);


  }

}
