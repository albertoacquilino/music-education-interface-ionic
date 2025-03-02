/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonicModule, PickerController } from '@ionic/angular';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Mute } from '@capgo/capacitor-mute';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleChevronDown, faCircleChevronUp } from '@fortawesome/free-solid-svg-icons';
import { range } from 'lodash';
import { Observable, interval, tap } from 'rxjs';

import { ChromaticTunerComponent } from 'src/app/components/chromatic-tuner/chromatic-tuner.component';
import { NoteSelectorComponent } from 'src/app/components/note-selector/note-selector.component';
import { ScoreViewComponent } from 'src/app/components/score/score.component';
import { SemaphoreLightComponent } from 'src/app/components/semaphore-light/semaphore-light.component';
import { TempoSelectorComponent } from 'src/app/components/tempo-selector/tempo-selector.component';
import { TrumpetDiagramComponent } from 'src/app/components/trumpet-diagram/trumpet-diagram.component';
import { AppBeat } from 'src/app/models/appbeat.types';
import { Score } from 'src/app/models/score.types';
import { FirebaseService } from 'src/app/services/firebase.service';
import { PitchService } from 'src/app/services/pitch.service';
import { RefFreqService } from 'src/app/services/ref-freq.service';
import { SoundsService } from 'src/app/services/sounds.service';
import { TabsService } from 'src/app/services/tabs.service';
import { scoreFromNote } from 'src/app/utils/score.utils';

import { DYNAMICS, INITIAL_NOTE, MAXCYCLES, MAXREFFREQUENCY, MAXTEMPO, MINREFFREQUENCY, MINTEMPO, NOTES, POSITIONS, TRUMPET_BTN } from '../../constants';
import { BeatService } from '../../services/beat.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule, FontAwesomeModule,
    ScoreViewComponent,
    CommonModule, SemaphoreLightComponent,
    TrumpetDiagramComponent, TempoSelectorComponent, NoteSelectorComponent,
    ChromaticTunerComponent],
})
/**
 * HomePage class represents the home page of the music education interface.
 */
export class HomePage implements OnInit {
  @ViewChild(ChromaticTunerComponent) private chromaticTuner!: ChromaticTunerComponent;

  /**
   * Indicates the mode - tuner or trumpet
   */
  mode = 'trumpet';

  /**
   * Indicates whether the mute alert has been triggered.
   */
  muteAlert = false;

  /**
   * Indicates whether to use flats and sharps.
   */
  useFlatsAndSharps = false;

  /**
   * Indicates whether or not dynamics are enabled.
   */
  useDynamics = false;

  /**
   * The audio context used for playing sounds.
   */
  audioContext = new AudioContext();

  /**
   * The FontAwesome icon for a circle chevron down.
   */
  faCircleChevronDown = faCircleChevronDown;

  /**
   * The FontAwesome icon for a circle chevron up.
   */
  faCircleChevronUp = faCircleChevronUp;

  /**
   * The observable for the tempo.
   */
  tempo$ = this._tempo.tempo$;

  /**
   * The high note.
   */
  highNote = INITIAL_NOTE;

  /**
   * The low note.
   */
  lowNote = INITIAL_NOTE;

  /**
   * The current note.
   */
  currentNote: number = INITIAL_NOTE;

  /**
   * The score.
   */
  score: Score = scoreFromNote(NOTES[this.currentNote][0]);

  /**
   * The audio nodes.
   */
  audioNodes = {};

  /**
   * The current action.
   */
  currentAction = '';

  /**
   * The trumpet position.
   */
  trumpetPosition = 'assets/images/trumpet_positions/pos_1.png';

  /**
   * The score image.
   */
  scoreImage = 'assets/images/score_images/G2.svg';

  /**
   * The trumpet buttons. For each note, the buttons that should be highlighted.
   */
  trumpetBtns: number[] = [];

  /**
   * The note images.
   */
  noteImages = NOTES.map(note => `assets/images/notes_images/_${note[0]}.svg`);

  /**
   * The observable for the beat.
   */
  beat$!: Observable<AppBeat>;

  /**
   * The observable for playing.
   */
  playing$!: Observable<boolean>;

  /**
   * The observable for the reference Frequency.
   */
  refFrequencyValue$!: number;

  /**
   * An array to get all the notes played.
   */
  collectedMeansObject: { [key: string]: number[] } = {};

  /**
   * A property to store the currently active theme
   */
  currentTheme: string = 'default'; // so TS doesn't complain

  /**
   * Creates an instance of HomePage.
   * @param _picker - The picker controller.
   * @param _tempo - The beat service.
   * @param _sounds - The sounds service.
   * @param firebase - The Firebase service.
   * @param alertController - The alert controller.
   * @param refFrequencyService - The Reference Frequency Service
   */
  constructor(
    private _picker: PickerController,
    private _tempo: BeatService,
    private _sounds: SoundsService,
    public firebase: FirebaseService,
    private alertController: AlertController,
    private refFrequencyService: RefFreqService,
    private tabsService: TabsService,
    private pitchService: PitchService,
    private router: Router,
  ) {
    this.beat$ = this._tempo.tick$.pipe(
      tap((tempo: AppBeat) => this.intervalHandler(tempo))
    );
    this.playing$ = this._tempo.playing$.asObservable();

    // Check if device is muted every second
    interval(1000).subscribe(async () => this.checkMuted());
  }

  ngOnInit(): void {
    console.log(localStorage.getItem('LoggedInUser'));
    this.refFrequencyService.getRefFrequency().subscribe((value: number) => {
      this.refFrequencyValue$ = value;
    });
    this.useFlatsAndSharps = this.retrieveAndParseFromLocalStorage('useFlatsAndSharps', false);
    this.useDynamics = this.retrieveAndParseFromLocalStorage('useDynamics', false);
    this.lowNote = this.retrieveAndParseFromLocalStorage('lowNote', INITIAL_NOTE);
    this.highNote = this.retrieveAndParseFromLocalStorage('highNote', INITIAL_NOTE);
  }

  ionViewDidEnter(): void {}

  ionViewWillLeave(): void {
    this._tempo.stop();
    if (this.mode === 'tuner') {
      this.chromaticTuner.stop();
    }
  }

  retrieveAndParseFromLocalStorage(key: string, defaultValue: any): any {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  }

  /**
   * Checks if the device is muted and displays an alert if it is.
   */
  async checkMuted() {
    try {
      const muted = await Mute.isMuted();
      if (!muted.value || this.muteAlert) {
        return;
      }
      this.muteAlert = true;
      const alert = await this.alertController.create({
        header: 'Mute Alert',
        message: 'Your device is currently muted. Please unmute to hear the trumpet sounds.',
        buttons: ['OK'],
      });
      alert.present();
    } catch (e) {
      // optional catch
    }
  }

  /**
   * Switches the mode (tuner or trumpet)
   */
  switchMode(event: any) {
    if (this.mode === 'tuner') {
      this.chromaticTuner.stop();
    }
    this.mode = event.detail.value;
    console.log('Mode switched to:', this.mode);
  }

  switchUseFlatsAndSharps(event: any) {
    this.useFlatsAndSharps = event.detail.checked;
    localStorage.setItem('useFlatsAndSharps', JSON.stringify(this.useFlatsAndSharps));
    if (!this.useFlatsAndSharps) {
      // check that low/high notes not accidentals
      if (NOTES[this.lowNote].length === 2) {
        this.lowNote++;
      }
      if (NOTES[this.highNote].length === 2) {
        this.highNote++;
      }
    }
  }

  switchUseDynamics(event: any) {
    this.useDynamics = event.detail.checked;
    localStorage.setItem('useDynamics', JSON.stringify(this.useDynamics));
    if (!this.useDynamics) {
      this.score = scoreFromNote(NOTES[this.currentNote][0]);
      this._sounds.setVolume(1.0);
    }
  }

  changeLowNote(index: number) {
    this.lowNote = index;
    if (!this.useFlatsAndSharps) {
      if (NOTES[this.lowNote].length === 2) {
        this.lowNote++;
      }
    }
    if (this.lowNote > this.highNote) {
      this.highNote = this.lowNote;
    }
    this.saveNotes();
  }

  changeHighNote(index: number) {
    this.highNote = index;
    if (!this.useFlatsAndSharps) {
      if (NOTES[this.highNote].length === 2) {
        this.highNote--;
      }
    }
    if (this.highNote < this.lowNote) {
      this.lowNote = this.highNote;
    }
    this.saveNotes();
  }

  saveNotes() {
    localStorage.setItem('lowNote', this.lowNote.toString());
    localStorage.setItem('highNote', this.highNote.toString());
  }

  updateTrumpetPosition(note: number) {
    const trumpetImg = POSITIONS[note];
    this.trumpetBtns = TRUMPET_BTN[note];
    this.trumpetPosition = `assets/images/trumpet_positions/${trumpetImg}.png`;
  }

  updateScore(noteNumber: number) {
    const possibleNotes = NOTES[noteNumber];
    const noteStr = possibleNotes.length === 1
      ? possibleNotes[0]
      : possibleNotes[Math.floor(Math.random() * 2)];
    this.scoreImage = `assets/images/score_images/${noteStr}.svg`;

    if (this.useDynamics) {
      const dynamic = DYNAMICS[Math.floor(Math.random() * DYNAMICS.length)];
      this._sounds.setVolume(dynamic.volume);
      this.score = scoreFromNote(noteStr, dynamic.label);
    } else {
      this.score = scoreFromNote(noteStr);
    }
  }

  nextNote() {
    const next = Math.round(Math.random() * (this.highNote - this.lowNote)) + this.lowNote;
    if (!this.useFlatsAndSharps) {
      if (NOTES[next].length === 2) {
        return next + 1;
      }
    }
    return next;
  }

  intervalHandler(tempo: AppBeat) {
    if (tempo.beat === 0) {
      if (tempo.measure === 0) {
        this.currentNote = this.nextNote();
        this._sounds.currentNote = this.currentNote;
        this.updateScore(this.currentNote);
        this.updateTrumpetPosition(this.currentNote);
      }

      switch (tempo.measure) {
        case 0:
          this.currentAction = 'Rest';
          if (this.mode === 'tuner') {
            const meansArray = this.chromaticTuner.stop();
            this.collectedMeansObject = {
              ...this.collectedMeansObject,
              [Object.keys(this.collectedMeansObject).length + 1]: meansArray
            };
          }
          break;
        case 1:
          this.currentAction = 'Listen';
          break;
        case 2:
          this.currentAction = 'Play';
          if (this.mode === 'tuner') {
            this.chromaticTuner.start();
          }
          break;
      }
    }

    if (tempo.cycle === MAXCYCLES) {
      this.firebase.saveStop('finished', this.collectedMeansObject);
      console.log('finished');
      console.log('Collected Means', this.collectedMeansObject);
      this.tabsService.setDisabled(false);
    }
  }

  startStop() {
    if (this._tempo.playing$.value) {
      this.stop();
      this.tabsService.setDisabled(false);
    } else {
      this.start();
      this.tabsService.setDisabled(true);
    }
  }

  start() {
    this.collectedMeansObject = {};
    this._tempo.start();
    this.firebase.saveStart(
      this.tempo$.value,
      this.lowNote,
      this.highNote,
      this.useFlatsAndSharps,
      this.useDynamics
    );
  }

  stop() {
    this._tempo.stop();
    if (this.mode === 'tuner') {
      const meansArray = this.chromaticTuner.stop();
      this.collectedMeansObject = {
        ...this.collectedMeansObject,
        [Object.keys(this.collectedMeansObject).length + 1]: meansArray
      };
    }
    Howler.stop();
    this.firebase.saveStop('interrupted', this.collectedMeansObject);
  }

  getNoteImg(note: number): string {
    return `assets/images/notes_images/_${NOTES[note][0]}.png`;
  }

  isPlaying(): boolean {
    return this._tempo.playing$.value;
  }

  async openPicker(type: 'frequency' | 'tempo') {
    if (this.isPlaying()) {
      return;
    }

    let options: { value: number; text: string }[] = [];
    let selectedIndex = 0;
    let selectedValue: number;
    let rangeValues: number[] = [];
    let unit: string;

    if (type === 'frequency') {
      selectedValue = this.refFrequencyValue$;
      rangeValues = range(MINREFFREQUENCY, MAXREFFREQUENCY + 1, 1);
      unit = 'Hz';
    } else {
      selectedValue = this.tempo$.value;
      rangeValues = range(MINTEMPO, MAXTEMPO + 1, 5);
      unit = 'bpm';
    }

    options = rangeValues.map(val => ({
      value: val,
      text: `${val} ${unit}`
    }));

    selectedIndex = options.findIndex(opt => opt.value === selectedValue);

    const picker = await this._picker.create({
      columns: [
        {
          name: type,
          options,
          selectedIndex
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (val) => {
            if (type === 'frequency') {
              this.refFrequencyValue$ = val[type].value;
              this.refFrequencyService.setRefFrequency(this.refFrequencyValue$);
              this.mode = 'trumpet';
            } else {
              this._tempo.setTempo(val[type].value);
            }
          }
        }
      ]
    });

    await picker.present();
  }

  changeTempo(tempo: number) {
    this._tempo.setTempo(tempo);
  }

  async canDismiss(_data?: any, role?: string) {
    return role !== 'gesture';
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  scaleContent() {
    const container = document.getElementById('wrapper');
    if (!container) return;
    const baseWidth = container.offsetWidth;
    const baseHeight = container.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scaleX = viewportWidth / baseWidth;
    const scaleY = (viewportHeight / baseHeight) * 0.8;
    const scale = Math.min(scaleX, scaleY);
    container.style.transform = `scale(${scale})`;
    container.style.position = 'absolute';
    container.style.left = `calc(50% - ${(baseWidth * scale) / 2}px)`;
    container.style.top = `calc(50% - ${(baseHeight * scale) / 2}px)`;
  }

  ngAfterViewInit() {
    window.addEventListener('resize', () => this.scaleContent());
    window.addEventListener('load', () => this.scaleContent());
    setTimeout(() => this.scaleContent(), 250);
  }

  /**
   * updated as user clicks one of the color boxes, so we apply that theme
   */
  applyTheme(theme: string) {
    document.body.classList.remove('grey-theme', 'tan-theme', 'white-theme', 'amber-theme');
    if (theme === 'grey') {
      document.body.classList.add('grey-theme');
    } else if (theme === 'tan') {
      document.body.classList.add('tan-theme');
    } else if (theme === 'white') {
      document.body.classList.add('white-theme');
    } else if (theme === 'amber') {
      document.body.classList.add('amber-theme');
    }
    this.currentTheme = theme;
    console.log('Theme changed to', theme);
  }
}
