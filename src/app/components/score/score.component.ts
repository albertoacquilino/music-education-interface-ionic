import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { filter, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Flow } from 'vexflow';
//@ts-ignore
import { Renderer, RenderContext } from 'vexflow';


/**
 * Represents a musical score.
 */
export type Score = {
  /**
   * An array of measures, where each measure contains an array of notes and a duration.
   */
  measures: { notes: string[], duration: string }[][];
  
  /**
   * The clef used in the score.
   */
  clef?: string;
  
  /**
   * The time signature of the score.
   */
  timeSignature?: string;
  
  /**
   * The key signature of the score.
   */
  keySignature?: string;
  
  /**
   * The dynamic marking of the score.
   */
  dynamic?: string;
  
  /**
   * The position of the dynamic marking in the score.
   */
  dynamicPosition?: number;
}

@Component({
  selector: 'app-score',
  template: `<div id="score" style="background-color: white;"></div>`,
  styleUrls: ['./score.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ScoreComponent implements AfterViewInit {
  private size$ = new BehaviorSubject<{ width: number, height: number }>({ width: 0, height: 0 });

  private score$ = new BehaviorSubject<Score | null>(null);
  @Input() set score(_score: Score) {
    this.score$.next(_score);
  }

  private _renderer!: Renderer;

  private _context!: RenderContext;

  constructor(private hostElement: ElementRef) { }

  @HostListener('window:resize')
  /**
   * Sets the size of the score component based on the dimensions of the host element.
   */
  setSize() {
    const size = {
      width: this.hostElement.nativeElement.getBoundingClientRect().width,
      height: this.hostElement.nativeElement.getBoundingClientRect().height
    };

    this.size$.next(size);
  }

  /**
   * Updates the size of the score component.
   * 
   * @param size - The new width and height of the score component.
   */
  updateSize(size: { width: number, height: number }) {
    if (size.height === 0 || size.width === 0) {
      return
    }
    this._renderer.resize(size.width, size.height);
  }

  /**
   * Lifecycle hook that is called after the view has been initialized.
   * It initializes the Flow renderer and context, updates the size and score,
   * and sets the size after a delay.
   */
  ngAfterViewInit(): void {
    const div = document.getElementById("score");
    if (!div) {
      throw new Error("Div not found");
    }
    this._renderer = new Flow.Renderer(div as HTMLDivElement, Flow.Renderer.Backends.SVG);
    this._context = this._renderer.getContext();

    combineLatest([this.size$, this.score$]).pipe(
      filter(([_, score]) => score !== null),
    ).subscribe(([size, score]) => {
      this.updateSize(size);
      this.updateScore(score as Score)
    });

    setTimeout(() => {
      this.setSize();
    }, 100);
  }


  /**
   * Updates the score with the given Score object.
   * 
   * @param score - The Score object containing the measures, clef, key signature, time signature, dynamic, and dynamic position.
   */
  updateScore(score: Score) {
    if (!this._context) {
      return;
    }
    this._context.clear();
    const measureWidth = (this.size$.value.width - 20) / score.measures.length;

    let staveMeasure = null;
    for (const [index, measure] of score.measures.entries()) {
      // Measure 1
      if (staveMeasure === null) {
        staveMeasure = new Flow.Stave(10, 0, measureWidth);
        if (score.clef) {
          staveMeasure.addClef(score.clef);
        }
        if (score.keySignature) {
          staveMeasure.addKeySignature(score.keySignature);
        }
        if (score.timeSignature) {
          staveMeasure.addTimeSignature(score.timeSignature);
        }
      } else {
        staveMeasure = new Flow.Stave(staveMeasure.getWidth() + staveMeasure.getX(), 0, measureWidth);
      }

      if (score.dynamic) {
        if (score.dynamicPosition === undefined) {
          score.dynamicPosition = 1;
        }
        if (score.dynamicPosition === index + 1) {
          staveMeasure.setText(score.dynamic, Flow.Modifier.Position.BELOW, { shift_y: 30 });
        }
      }


      staveMeasure
        .setContext(this._context)
        .draw();

      const notesMeasure = measure
        .map((measure) => 
          new Flow.StaveNote({ keys: measure.notes, duration: measure.duration })
        );
      // Helper function to justify and draw a 4/4 voice
      Flow.Formatter.FormatAndDraw(this._context, staveMeasure, notesMeasure);

    }
  }

}
