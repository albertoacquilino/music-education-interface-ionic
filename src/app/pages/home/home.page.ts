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
import { DYNAMICS, INITIAL_NOTE, MAXCYCLES, MAXREFFREQUENCY, MAXTEMPO, MINREFFREQUENCY, MINTEMPO, TRUMPET_NOTES, CLARINET_NOTES, POSITIONS, TRUMPET_BTN,CLARINET_POSITIONS } from '../../constants';
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
  selectedInstrument='trumpet';
  NOTES: string[][]= TRUMPET_NOTES;

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
   * Indicats wheter or not dynamics are enabled.
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
  score: Score = scoreFromNote(this.NOTES[this.currentNote][0],this.selectedInstrument);

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
  trumpetPosition ="assets/images/trumpet_positions/pos_1.png";
  clarinetPosition="assets/images/clarinet_positions/A3.svg";


  /**
   * The score image.
   */
  scoreImage = "assets/images/score_images/G2.svg";

  /**
   * The trumpet buttons. For each note, the buttons that should be highlighted.
   */
  trumpetBtns: number[] = [];

  /**
   * The note images.
   */
  noteImages: string[]=this.getNoteImages(); 

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
   * Creates an instance of HomePage.
   * @param _picker - The picker controller.
   * @param _tempo - The beat service.
   * @param _sounds - The sounds service.
   * @param firebase - The Firebase service.
   * @param alertController - The alert controller.
   * @param refFrequencyService : The Reference Frequency Service
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
    this.NOTES = this.getNotesForInstrument(this.selectedInstrument);
  
    this.beat$ = this._tempo.tick$.pipe(
      tap((tempo: AppBeat) => this.intervalHandler(tempo))
    );
    this.playing$ = this._tempo.playing$.asObservable();

    interval(1000).subscribe(async () => this.checkMuted());
  }
  private getNotesForInstrument(instrument: string | null): string[][] {
    if (instrument === 'trumpet') {
      return TRUMPET_NOTES; // Use trumpet notes
    } else if (instrument === 'clarinet') {
      return CLARINET_NOTES; // Use clarinet notes
    }
    return []; // Return an empty array if no valid instrument is selected
  }
  private getNoteImages(): string[] {
    return this.NOTES.map(note => `assets/images/${this.selectedInstrument}_notes_images/_${note[0]}.svg`);
  }

  
  ngOnInit(): void {
    console.log(localStorage.getItem('LoggedInUser'));
    this.refFrequencyService.getRefFrequency().subscribe(value => {
      this.refFrequencyValue$ = value;
    });
    const savedInstrument = localStorage.getItem('selectedInstrument');

  if (savedInstrument) {
    this.selectedInstrument = savedInstrument;
    this.NOTES = this.getNotesForInstrument(this.selectedInstrument);
    this.noteImages = this.getNoteImages();
    this.soundsService.setInstrument(this.selectedInstrument);
    this.mode = this.selectedInstrument;
  }
    this.useFlatsAndSharps = this.retrieveAndParseFromLocalStorage('useFlatsAndSharps', false);
    this.useDynamics = this.retrieveAndParseFromLocalStorage('useDynamics', false);
    this.lowNote = this.retrieveAndParseFromLocalStorage('lowNote', INITIAL_NOTE);
    this.highNote = this.retrieveAndParseFromLocalStorage('highNote', INITIAL_NOTE);
  }

  ionViewDidEnter(): void {

  }

  ionViewWillLeave(): void {
    this._tempo.stop();
    if (this.mode == "tuner") this.chromaticTuner.stop();
  }

  retrieveAndParseFromLocalStorage(key: string, defaultValue: any): any {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  }
  selectInstrument(event: any) {
    this.selectedInstrument = event.detail.value; // Store the selected instrument
      this.mode = this.selectedInstrument;  // Set mode to the same value as selected instrument
    console.log('Selected Instrument:', this.selectedInstrument);
    this.NOTES = this.getNotesForInstrument(this.selectedInstrument);
    this.noteImages = this.getNoteImages(); 
    this.soundsService.setInstrument(this.selectedInstrument);

    // Save the current state to local storage
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
   * Checks if the device is muted and displays an alert if it is.
   * @returns void
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
    }

  }

  /**
   * Switches the mode.
   * @param event - The event.
   * @returns void
   */

  switchMode(event: any) {
    if (this.mode == 'tuner') {
      this.chromaticTuner.stop();
    }
    this.mode = event.detail.value;
    console.log(event);
  }

  /**
   * Switches the use of flats and sharps.
   * @param event - The event.
   * @returns void
   */
  switchUseFlatsAndSharps(event: any) {
    this.useFlatsAndSharps = event.detail.checked;
    localStorage.setItem('useFlatsAndSharps', JSON.stringify(this.useFlatsAndSharps));
    console.log(event);
    if (!this.useFlatsAndSharps) {
      // check that low and high notes are not on accidentals
      // if they are, move them up by a half step
      if (this.NOTES[this.lowNote].length == 2) {
        this.lowNote++;
      }
      if (this.NOTES[this.highNote].length == 2) {
        this.highNote++;
      }
    }
  }

  switchUseDynamics(event: any) {
    this.useDynamics = event.detail.checked;
    localStorage.setItem('useDynamics', JSON.stringify(this.useDynamics));
    if (!this.useDynamics) {
      this.score = scoreFromNote(this.NOTES[this.currentNote][0],this.selectedInstrument);
      this._sounds.setVolume(1.0);
    }
  }
  /**
   * Changes the low note.
   * @param index - The index.
   * @returns void
   */
  changeLowNote(index: number) {
    this.lowNote = index;
    if (!this.useFlatsAndSharps) {
      if (this.NOTES[this.lowNote].length == 2) {
        this.lowNote++;
      }
    }
    if (this.lowNote > this.highNote) {
      this.highNote = this.lowNote;
    }
    this.saveNotes();
  }

  /**
   * Changes the high note.
   * @param index - The index.
   * @returns void
   */
  changeHighNote(index: number) {
    this.highNote = index;
    if (!this.useFlatsAndSharps) {
      if (this.NOTES[this.highNote].length == 2) {
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
  /**
   * Updates the position of the trumpet image based on the given note.
   * @param note - The note to update the trumpet position to.
   * @returns void
   */
  updateTrumpetPosition(note: number) {
    const trumpetImg = POSITIONS[note];
    this.trumpetBtns = TRUMPET_BTN[note];
    this.trumpetPosition = `assets/images/trumpet_positions/${trumpetImg}.png`;
  }
  updateClarinetPosition(note: number) {
    const clarinetImg = CLARINET_POSITIONS[note];
    this.clarinetPosition = `assets/images/clarinet_positions/${clarinetImg}.svg`;
  }
  /**
   * Updates the score image based on the given note.
   * @param noteNumber - The index of the note to use for updating the score image.
   * @returns void
   */
  updateScore(noteNumber: number) {
    const _notes = this.NOTES[noteNumber];
    const scoreImage = _notes.length == 1 ? _notes[0] : _notes[Math.floor(Math.random() * 2)];
    this.scoreImage = `assets/images/score_images/${scoreImage}.svg`


    if (this.useDynamics) {
      const dynamic = DYNAMICS[Math.floor(Math.random() * DYNAMICS.length)];
      this._sounds.setVolume(dynamic.volume);
      this.score = scoreFromNote(scoreImage, dynamic.label);
    } else {
      this.score = scoreFromNote(scoreImage,this.selectedInstrument);
    }
  }

  /**
   * Generates a random note within the range of lowNote and highNote.
   * @returns {number} The generated note.
   */
  nextNote() {
    const next = Math.round(Math.random() * (this.highNote - this.lowNote)) + this.lowNote;
    if (!this.useFlatsAndSharps) {
      if (this.NOTES[next].length == 2) {
        return next + 1;
      }
    }
    return next;
  }

  /**
   * Handles the interval for the given tempo.
   * @param {AppBeat} tempo - The tempo to handle the interval for.
   * @returns void
   */
  intervalHandler(tempo: AppBeat) {
    if (tempo.beat == 0) {
      if (tempo.measure == 0) {
        this.currentNote = this.nextNote();
        this._sounds.currentNote = this.currentNote;
        this.updateScore(this.currentNote);
        if(this.selectedInstrument==="trumpet"){
        this.updateTrumpetPosition(this.currentNote);
        }else if(this.selectedInstrument==="clarinet"){
          this.updateClarinetPosition(this.currentNote);
        }
      }

      switch (tempo.measure) {
        case 0:
          this.currentAction = "Rest";
          if (this.mode == 'tuner') {
            const meansArray = this.chromaticTuner.stop();
            this.collectedMeansObject = {
              ...this.collectedMeansObject,
              [Object.keys(this.collectedMeansObject).length + 1]: meansArray
            };
          }
          break;
        case 1:
          this.currentAction = "Listen";
          break;
        case 2:
          this.currentAction = "Play";
          if (this.mode == 'tuner') {
            this.chromaticTuner.start();
          }
          break;
      }

      if (this.mode == 'trumpet') {
        switch (tempo.measure) {
          // case 0: this.pitchService.disconnect(); break;
          // case 2: this.pitchService.connect();
        }
      }
    }

    if (tempo.cycle === MAXCYCLES) {
      this.firebase.saveStop('finished', this.collectedMeansObject);
      console.log('finished');
      console.log('Collected Means', this.collectedMeansObject);
      this.tabsService.setDisabled(false);
    }
  }
  /**
   * Toggles between starting and stopping the tempo.
   * If the tempo is currently playing, it will stop it.
   * If the tempo is currently stopped, it will start it.
   * @returns void
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
   * Starts the tempo and saves the current state to Firebase.
   * @returns void
   */
  start() {
    this.collectedMeansObject = {};
    this._tempo.start();
    this.firebase.saveStart(
      this.tempo$.value,
      this.lowNote,
      this.highNote,
      this.useFlatsAndSharps,
      this.useDynamics);
  }

  /**
   * Stops the tempo and all audio playback, and saves the stop event to Firebase.
   * @returns void
   */
  stop() {
    this._tempo.stop();
    if (this.mode == 'tuner') {
      const meansArray = this.chromaticTuner.stop();
      this.collectedMeansObject = {
        ...this.collectedMeansObject,
        [Object.keys(this.collectedMeansObject).length + 1]: meansArray
      };
      console.log('Collected Means', this.collectedMeansObject);
    }
    else if (this.mode == 'trumpet') {
      // this.pitchService.disconnect();
    }
    Howler.stop();
    this.firebase.saveStop('interrupted', this.collectedMeansObject);
  }

  /**
   * Returns the path to the image file for the given note.
   * @param note - The note to get the image for.
   * @returns The path to the image file.
   */


  /**
   * Returns a boolean indicating whether the tempo is currently playing or not.
   * @returns {boolean} A boolean indicating whether the tempo is currently playing or not.
   */
  isPlaying(): boolean {
    return this._tempo.playing$.value;
  }
  //return this.NOTES.map(note => `
  getNoteImg(note: number): string {
   return 'assets/images/${this.selectedInstrument}_notes_images/_${this.NOTES[note][0]}.png';
    //return `assets/images/${this.NOTES}_notes_images/_${this.NOTES[note][0]}.png`;
  }
  async openPicker(type: 'frequency' | 'tempo') {
    // Check if the picker should be opened
    if (this.isPlaying()) {
      return;
    }

    // create list of options to be selected
    let options: { value: number, text: string }[];
    let selectedIndex = 0;
    let selectedValue: number;
    let rangeValues: number[] = [];
    let unit: string;

    if (type === 'frequency') {
      selectedValue = this.refFrequencyValue$;
      rangeValues = range(MINREFFREQUENCY, MAXREFFREQUENCY + 1, 1);
      unit = 'Hz';
    } else if (type === 'tempo') {
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
            } else if (type === 'tempo') {
              this._tempo.setTempo(value[type].value);
            }
          }
        },
      ],
    });

    await picker.present();

  }

  changeTempo(tempo: number) {
    this._tempo.setTempo(tempo);
  }


  /**
   * Determines whether the modal can be dismissed or not.
   * @param data Optional data passed to the modal.
   * @param role Optional role of the modal.
   * @returns A Promise that resolves to a boolean indicating whether the modal can be dismissed or not.
   */
  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  scaleContent() {
    const container = document.getElementById('wrapper');

    // Dimensioni di base del contenitore
    const baseWidth = container!.offsetWidth;
    const baseHeight = container!.offsetHeight;

    // Dimensioni della finestra (viewport)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calcola il fattore di scala per adattare sia larghezza che altezza
    const scaleX = viewportWidth / baseWidth;
    const scaleY = viewportHeight / baseHeight * 0.8;

    // Prendi il fattore di scala minimo tra larghezza e altezza
    let scale = Math.min(scaleX, scaleY);

    //lascia un margine di almeno 20%
    //scale = scale * 0.95;

    // Applica il fattore di scala al contenitore
    container!.style.transform = `scale(${scale})`;

    // Posizionamento centrale del contenitore
    container!.style.position = 'absolute';
    container!.style.left = `calc(50% - ${baseWidth * scale / 2}px)`;
    container!.style.top = `calc(50% - ${baseHeight * scale / 2}px)`;
  }


  //on component load, scale the content
  ngAfterViewInit() {
    //on event resize, scale the content
    window.addEventListener('resize', () => this.scaleContent());
    window.addEventListener('load', () => this.scaleContent());

    // 
    setTimeout(() => this.scaleContent(), 250);
  }

}