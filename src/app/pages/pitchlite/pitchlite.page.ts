import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { ScrollImageComponent } from '../../components/scroll-image-selector/scroll-image-selector.component';
import { ChromaticTunerComponent } from 'src/app/components/chromatic-tuner/chromatic-tuner.component';
import { RefFreqService } from 'src/app/services/ref-freq.service';
import { BeatService } from 'src/app/services/beat.service';
import { AppBeat } from 'src/app/models/appbeat.types';
import { INITIAL_NOTE, MAXCYCLES } from 'src/app/constants';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable, Subscription, tap } from 'rxjs';


@Component({
  selector: 'app-pitchlite',
  templateUrl: 'pitchlite.page.html',
  styleUrls: ['pitchlite.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonicModule, FontAwesomeModule, ScrollImageComponent, CommonModule, ChromaticTunerComponent],
})
export class PitchComponent implements OnInit {
  @ViewChild(ChromaticTunerComponent) private chromaticTuner!: ChromaticTunerComponent;

  refFrequencyValue$!: number;
  display: boolean = true;
  tempo$ = this._tempo.tempo$;
  beat$!: Observable<AppBeat>;
  playing$!: Observable<boolean>;
  highNote = INITIAL_NOTE;
  lowNote = INITIAL_NOTE;
  useFlatsAndSharps = false;
  useDynamics = false;
  private beatSubscription!: Subscription;

  constructor(
    private refFreqService: RefFreqService,
    private _tempo: BeatService,
    public firebase: FirebaseService,
  ) {
    this.beat$ = this._tempo.tick$.pipe(
      tap((tempo: AppBeat) => this.intervalHandler(tempo))
    );
    this.playing$ = this._tempo.playing$.asObservable();

  }

  ngOnInit(): void {
    this.refFreqService.getRefFrequency().subscribe(value => {
      this.refFrequencyValue$ = value;
    });
    this.useFlatsAndSharps = this.retrieveAndParseFromLocalStorage('useFlatsAndSharps', false);
    this.useDynamics = this.retrieveAndParseFromLocalStorage('useDynamics', false);
    this.lowNote = this.retrieveAndParseFromLocalStorage('lowNote', INITIAL_NOTE);
    this.highNote = this.retrieveAndParseFromLocalStorage('highNote', INITIAL_NOTE);
    this.beatSubscription = this.beat$.subscribe();
  }

  retrieveAndParseFromLocalStorage(key: string, defaultValue: any): any {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  }

  ngOnDestroy(): void {
    if (this.beatSubscription) {
      this.beatSubscription.unsubscribe();
    }
  }

  isPlaying(): boolean {
    return this._tempo.playing$.value;
  }

  intervalHandler(tempo: AppBeat) {
    if (tempo.beat == 0) {
      switch (tempo.measure) {
        case 0: this.chromaticTuner.stop(); break;
        case 2: this.chromaticTuner.start();
      }
    }
    if (tempo.cycle === MAXCYCLES) {
      this.firebase.saveStop('finished');
      console.log('finished');
    }

  }
  startStop() {
    if (this._tempo.playing$.value) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    this._tempo.start();
    this.firebase.saveStart(
      this.tempo$.value,
      this.lowNote,
      this.highNote,
      this.useFlatsAndSharps,
      this.useDynamics);
  }

  stop() {
    this._tempo.stop();
    this.chromaticTuner.stop();
    Howler.stop();
    this.firebase.saveStop('interrupted');
  }
}
