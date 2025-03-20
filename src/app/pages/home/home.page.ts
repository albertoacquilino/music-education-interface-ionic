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
import {
  DYNAMICS, INITIAL_NOTE, MAXCYCLES, MAXREFFREQUENCY, MAXTEMPO,
  MINREFFREQUENCY, MINTEMPO, TRUMPET_NOTES, CLARINET_NOTES, POSITIONS,
  TRUMPET_BTN, CLARINET_POSITIONS
} from '../../constants';
import { BeatService } from '../../services/beat.service';

// If you're using howler, ensure the import is present
declare let Howler: any;

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
    ChromaticTunerComponent
  ],
})
/**
 * HomePage class represents the home page of the music education interface.
 *
 * In this code, we do NOT rely on theme classes. Instead, we override
 * the Ion CSS vars in TypeScript to ensure the background color truly changes.
 */
export class HomePage implements OnInit {
  @ViewChild(ChromaticTunerComponent) private chromaticTuner!: ChromaticTunerComponent;

  /**
   * The default background color is set to 'tan' in logic below.
   */
  selectedInstrument = 'trumpet';
  NOTES: string[][] = TRUMPET_NOTES;

  mode = 'trumpet';

  /**
   * Mute alert tracking
   */
  muteAlert = false;

  /**
   * Flats/sharps toggle
   */
  useFlatsAndSharps = false;

  /**
   * Dynamics toggle
   */
  useDynamics = false;

  /**
   * AudioContext reference
   */
  audioContext = new AudioContext();

  /**
   * FontAwesome icons
   */
  faCircleChevronDown = faCircleChevronDown;
  faCircleChevronUp = faCircleChevronUp;

  /**
   * The observable for tempo
   */
  tempo$ = this._tempo.tempo$;

  /**
   * Low/high notes
   */
  highNote = INITIAL_NOTE;
  lowNote = INITIAL_NOTE;

  /**
   * The current note index
   */
  currentNote: number = INITIAL_NOTE;

  /**
   * Score data
   */
  score = scoreFromNote(
    this.NOTES[this.currentNote][0],
    this.selectedInstrument
  );

  /**
   * Example for audio nodes
   */
  audioNodes = {};

  /**
   * Current action label
   */
  currentAction = '';

  /**
   * Trumpet image path
   */
  trumpetPosition = 'assets/images/trumpet_positions/pos_1.png';

  /**
   * Clarinet image path
   */
  clarinetPosition = 'assets/images/clarinet_positions/A3.svg';

  /**
   * Score image path
   */
  scoreImage = 'assets/images/score_images/G2.svg';

  /**
   * Trumpet buttons for highlighting
   */
  trumpetBtns: number[] = [];

  /**
   * Note images array (unused)
   */
  noteImages: string[] = this.getNoteImages();

  /**
   * Beat observable
   */
  beat$!: Observable<AppBeat>;

  /**
   * Playing observable
   */
  playing$!: Observable<boolean>;

  /**
   * Reference frequency A4
   */
  refFrequencyValue$!: number;

  /**
   * Tuner data
   */
  collectedMeansObject: { [key: string]: number[] } = {};

  /**
   * The "theme" property. We'll store the chosen theme string,
   * defaulting to 'tan' so we start with a tan background.
   */
  selectedTheme = 'tan';

  /**
   * Creates HomePage instance
   */
  constructor(
    private soundsService: SoundsService,
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
    // Initialize notes for default instrument
    this.NOTES = this.getNotesForInstrument(this.selectedInstrument);

    // Setup the beat & playing streams
    this.beat$ = this._tempo.tick$.pipe(
      tap((tempo: AppBeat) => this.intervalHandler(tempo))
    );
    this.playing$ = this._tempo.playing$.asObservable();

    // Check mute status regularly
    interval(1000).subscribe(async () => this.checkMuted());
  }

  /**
   * Return the correct set of notes
   */
  private getNotesForInstrument(instrument: string | null): string[][] {
    if (instrument === 'trumpet') return TRUMPET_NOTES;
    if (instrument === 'clarinet') return CLARINET_NOTES;
    return [];
  }

  /**
   * Example note images
   */
  private getNoteImages(): string[] {
    return this.NOTES.map(note =>
      `assets/images/${this.selectedInstrument}_notes_images/_${note[0]}.svg`
    );
  }

  ngOnInit(): void {
    // Subscribe to A4 frequency
    this.refFrequencyService.getRefFrequency().subscribe(value => {
      this.refFrequencyValue$ = value;
    });

    // Restore any saved instrument
    const savedInstrument = localStorage.getItem('selectedInstrument');
    if (savedInstrument) {
      this.selectedInstrument = savedInstrument;
      this.NOTES = this.getNotesForInstrument(this.selectedInstrument);
      this.noteImages = this.getNoteImages();
      this.soundsService.setInstrument(this.selectedInstrument);
      this.mode = this.selectedInstrument;
    }

    // Restore toggles
    this.useFlatsAndSharps = this.retrieveAndParseFromLocalStorage('useFlatsAndSharps', false);
    this.useDynamics = this.retrieveAndParseFromLocalStorage('useDynamics', false);
    this.lowNote = this.retrieveAndParseFromLocalStorage('lowNote', INITIAL_NOTE);
    this.highNote = this.retrieveAndParseFromLocalStorage('highNote', INITIAL_NOTE);

    // Restore theme or default to 'tan'
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      // e.g. "white" or "grey"
      this.selectedTheme = savedTheme;
    }
    this.applyTheme(this.selectedTheme);
  }

  ionViewDidEnter(): void {
    // no-op
  }

  ionViewWillLeave(): void {
    // Stop metronome if user navigates away
    this._tempo.stop();
    // Also stop tuner if in that mode
    if (this.mode === 'tuner') {
      this.chromaticTuner.stop();
    }
  }

  /**
   * Helper to parse localStorage
   */
  retrieveAndParseFromLocalStorage(key: string, defaultValue: any): any {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  }

  /**
   * Called when user selects instrument from IonSelect
   */
  selectInstrument(event: any) {
    this.selectedInstrument = event.detail.value;
    this.mode = this.selectedInstrument;
    console.log('Selected Instrument:', this.selectedInstrument);

    this.NOTES = this.getNotesForInstrument(this.selectedInstrument);
    this.noteImages = this.getNoteImages();
    this.soundsService.setInstrument(this.selectedInstrument);

    this.saveCurrentStateToLocalStorage();
  }

  private saveCurrentStateToLocalStorage() {
    localStorage.setItem('selectedInstrument', this.selectedInstrument);
    localStorage.setItem('useFlatsAndSharps', JSON.stringify(this.useFlatsAndSharps));
    localStorage.setItem('useDynamics', JSON.stringify(this.useDynamics));
    localStorage.setItem('lowNote', this.lowNote.toString());
    localStorage.setItem('highNote', this.highNote.toString());
  }

  /**
   * Check if device is muted
   */
  async checkMuted() {
    try {
      const muted = await Mute.isMuted();
      if (!muted.value || this.muteAlert) return;
      this.muteAlert = true;
      const alert = await this.alertController.create({
        header: 'Mute Alert',
        message: 'Your device is muted. Please unmute to hear the sounds.',
        buttons: ['OK'],
      });
      alert.present();
    } catch (e) {
      // no-op
    }
  }

  /**
   * Switch mode
   */
  switchMode(event: any) {
    if (this.mode === 'tuner') {
      this.chromaticTuner.stop();
    }
    this.mode = event.detail.value;
    console.log(event);
  }

  /**
   * Toggle flats/sharps
   */
  switchUseFlatsAndSharps(event: any) {
    this.useFlatsAndSharps = event.detail.checked;
    localStorage.setItem('useFlatsAndSharps', JSON.stringify(this.useFlatsAndSharps));
    if (!this.useFlatsAndSharps) {
      // skip accidental notes
      if (this.NOTES[this.lowNote].length === 2) {
        this.lowNote++;
      }
      if (this.NOTES[this.highNote].length === 2) {
        this.highNote++;
      }
    }
  }

  /**
   * Toggle dynamics
   */
  switchUseDynamics(event: any) {
    this.useDynamics = event.detail.checked;
    localStorage.setItem('useDynamics', JSON.stringify(this.useDynamics));
    if (!this.useDynamics) {
      // reset volume/label
      this.score = scoreFromNote(this.NOTES[this.currentNote][0], this.selectedInstrument);
      this._sounds.setVolume(1.0);
    }
  }

  /**
   * Changes the low note selection
   */
  changeLowNote(index: number) {
    this.lowNote = index;
    if (!this.useFlatsAndSharps) {
      if (this.NOTES[this.lowNote].length === 2) {
        this.lowNote++;
      }
    }
    if (this.lowNote > this.highNote) {
      this.highNote = this.lowNote;
    }
    this.saveNotes();
  }

  /**
   * Changes the high note selection
   */
  changeHighNote(index: number) {
    this.highNote = index;
    if (!this.useFlatsAndSharps) {
      if (this.NOTES[this.highNote].length === 2) {
        this.highNote--;
      }
    }
    if (this.highNote < this.lowNote) {
      this.lowNote = this.highNote;
    }
    this.saveNotes();
  }

  /**
   * Saves notes to localStorage
   */
  saveNotes() {
    localStorage.setItem('lowNote', this.lowNote.toString());
    localStorage.setItem('highNote', this.highNote.toString());
  }

  /**
   * Update trumpet image
   */
  updateTrumpetPosition(note: number) {
    const trumpetImg = POSITIONS[note];
    this.trumpetBtns = TRUMPET_BTN[note];
    this.trumpetPosition = `assets/images/trumpet_positions/${trumpetImg}.png`;
  }

  /**
   * Update clarinet image
   */
  updateClarinetPosition(note: number) {
    const clarinetImg = CLARINET_POSITIONS[note];
    this.clarinetPosition = `assets/images/clarinet_positions/${clarinetImg}.svg`;
  }

  /**
   * Update the staff/score image
   */
  updateScore(noteNumber: number) {
    const _notes = this.NOTES[noteNumber];
    const scoreImage = _notes.length === 1
      ? _notes[0]
      : _notes[Math.floor(Math.random() * 2)];

    this.scoreImage = `assets/images/score_images/${scoreImage}.svg`;

    if (this.useDynamics) {
      const dynamic = DYNAMICS[Math.floor(Math.random() * DYNAMICS.length)];
      this._sounds.setVolume(dynamic.volume);
      this.score = scoreFromNote(scoreImage, dynamic.label);
    } else {
      this.score = scoreFromNote(scoreImage, this.selectedInstrument);
    }
  }

  /**
   * Generate a random note index
   */
  nextNote() {
    const next = Math.round(Math.random() * (this.highNote - this.lowNote)) + this.lowNote;
    if (!this.useFlatsAndSharps) {
      if (this.NOTES[next].length === 2) {
        return next + 1;
      }
    }
    return next;
  }

  /**
   * Called each tick of the metronome
   */
  intervalHandler(tempo: AppBeat) {
    if (tempo.beat === 0) {
      if (tempo.measure === 0) {
        this.currentNote = this.nextNote();
        this._sounds.currentNote = this.currentNote;
        this.updateScore(this.currentNote);

        if (this.selectedInstrument === 'trumpet') {
          this.updateTrumpetPosition(this.currentNote);
        } else if (this.selectedInstrument === 'clarinet') {
          this.updateClarinetPosition(this.currentNote);
        }
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

      if (tempo.cycle === MAXCYCLES) {
        this.firebase.saveStop('finished', this.collectedMeansObject);
        console.log('finished');
        console.log('Collected Means', this.collectedMeansObject);
        this.tabsService.setDisabled(false);
      }
    }
  }

  /**
   * Start or stop the metronome
   */
  startStop() {
    if (this._tempo.playing$.value) {
      this.stop();
      this.tabsService.setDisabled(false);
    } else {
      this.start();
      this.tabsService.setDisabled(true);
    }
  }

  /**
   * Start the tempo
   */
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

  /**
   * Stop the tempo
   */
  stop() {
    this._tempo.stop();
    if (this.mode === 'tuner') {
      const meansArray = this.chromaticTuner.stop();
      this.collectedMeansObject = {
        ...this.collectedMeansObject,
        [Object.keys(this.collectedMeansObject).length + 1]: meansArray
      };
      console.log('Collected Means', this.collectedMeansObject);
    }
    Howler.stop();
    this.firebase.saveStop('interrupted', this.collectedMeansObject);
  }

  /**
   * Is the metronome playing?
   */
  isPlaying(): boolean {
    return this._tempo.playing$.value;
  }

  /**
   * Example function returning path to a note image
   */
  getNoteImg(note: number): string {
    return `assets/images/${this.selectedInstrument}_notes_images/_${this.NOTES[note][0]}.png`;
  }

  /**
   * Open frequency or tempo picker
   */
  async openPicker(type: 'frequency' | 'tempo') {
    if (this.isPlaying()) return;

    let options: { value: number; text: string }[];
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

    options = rangeValues.map(value => ({
      value: value,
      text: `${value} ${unit}`
    }));

    selectedIndex = options.findIndex(option => option.value === selectedValue);

    const picker = await this._picker.create({
      columns: [
        {
          name: type,
          options: options,
          selectedIndex: selectedIndex
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: (value) => {
            if (type === 'frequency') {
              this.refFrequencyValue$ = value[type].value;
              this.refFrequencyService.setRefFrequency(this.refFrequencyValue$);
              this.mode = 'trumpet';
            } else {
              this._tempo.setTempo(value[type].value);
            }
          }
        },
      ],
    });

    await picker.present();
  }

  /**
   * Called when user changes tempo from <tempo-selector>
   */
  changeTempo(tempo: number) {
    this._tempo.setTempo(tempo);
  }

  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  /**
   * Scale content for smaller screens
   */
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
   * The user picks a new theme (Tan, White, Grey, Dark Grey).
   * Instead of adding a class, we directly set the Ion CSS variables.
   */
  selectTheme(theme: string) {
    this.selectedTheme = theme;
    this.applyTheme(theme);
    localStorage.setItem('theme', theme);
  }

  /**
   * We define a map from theme -> backgroundColor, textColor
   */
  private applyTheme(theme: string) {
    let bgColor = '#d2b48c';   // default tan
    let textColor = '#000';

    switch (theme) {
      case 'tan':
        bgColor = '#d2b48c';
        textColor = '#000';
        break;
      case 'white':
        bgColor = '#ffffff';
        textColor = '#000000';
        break;
      case 'grey':
        bgColor = '#e0e0e0';
        textColor = '#222';
        break;
      case 'darkGrey':
        bgColor = '#555';
        textColor = '#eee';
        break;
    }

    // Force these values onto the <html>
    document.documentElement.style.setProperty('--ion-background-color', bgColor);
    document.documentElement.style.setProperty('--ion-text-color', textColor);
  }
}
