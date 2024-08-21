import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonicModule, PickerController } from '@ionic/angular';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleChevronDown, faCircleChevronUp } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { Mute } from '@capgo/capacitor-mute';
import { range } from 'lodash';
import { Observable, interval, tap } from 'rxjs';
import { ScoreComponent } from 'src/app/components/score/score.component';
import { Score } from 'src/app/models/score.types';
import { FirebaseService } from 'src/app/services/firebase.service';
import { RegistrationService } from 'src/app/services/registration.service';
import { SoundsService } from 'src/app/services/sounds.service';
import { scoreFromNote } from 'src/app/utils/score.utils';
import { ScrollImageComponent } from '../../components/scroll-image-selector/scroll-image-selector.component';
import { DYNAMICS, INITIAL_NOTE, MAXCYCLES, MAXTEMPO, MINTEMPO, NOTES, POSITIONS, TRUMPET_BTN, MINREFFREQUENCY, MAXREFFREQUENCY } from '../../constants';
import { BeatService } from '../../services/beat.service';
import { AuthService } from 'src/app/services/auth.service';
import { AppBeat } from 'src/app/models/appbeat.types';
import { RefFreqService } from 'src/app/services/ref-freq.service';
import { SemaphoreLightComponent } from 'src/app/components/semaphore-light/semaphore-light.component';
import { TrumpetDiagramComponent } from 'src/app/components/trumpet-diagram/trumpet-diagram.component';
import { TabsComponent } from '../tabs/tabs.page';
import { ChromaticTunerComponent } from 'src/app/components/chromatic-tuner/chromatic-tuner.component';
import { PitchService } from 'src/app/services/pitch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FontAwesomeModule, ScrollImageComponent, ScoreComponent, CommonModule, SemaphoreLightComponent, TrumpetDiagramComponent, TabsComponent, ChromaticTunerComponent],
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
  trumpetPosition = "assets/images/trumpet_positions/pos_1.png"

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
  noteImages = NOTES.map(note => `assets/images/notes_images/_${note[0]}.svg`);

  /**
   * The observable for the beat.
   */
  beat$!: Observable<AppBeat>;

  /**
   * The observable for playing.
   */
  playing$!: Observable<boolean>;


  refFrequencyValue$!: number;

  /**
   * Creates an instance of HomePage.
   * @param _picker - The picker controller.
   * @param _tempo - The beat service.
   * @param _sounds - The sounds service.
   * @param firebase - The Firebase service.
   * @param _registration - The registration service.
   * @param alertController - The alert controller.
   * @param refFrequencyService : The Reference Frequency Service
   */
  constructor(
    private _picker: PickerController,
    private _tempo: BeatService,
    private _sounds: SoundsService,
    public firebase: FirebaseService,
    private _registration: RegistrationService,
    private alertController: AlertController,
    private refFrequencyService: RefFreqService,
    private authService: AuthService,
    private pitchService: PitchService,
    private router: Router,
  ) {
    this.beat$ = this._tempo.tick$.pipe(
      tap((tempo: AppBeat) => this.intervalHandler(tempo))
    );
    this.playing$ = this._tempo.playing$.asObservable();

    interval(1000).subscribe(async () => this.checkMuted());
  }

  ngOnInit(): void {
    console.log(localStorage.getItem('LoggedInUser'));
    this.refFrequencyService.getRefFrequency().subscribe(value => {
      this.refFrequencyValue$ = value;
    });
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
      if (NOTES[this.lowNote].length == 2) {
        this.lowNote++;
      }
      if (NOTES[this.highNote].length == 2) {
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
  /**
   * Changes the low note.
   * @param index - The index.
   * @returns void
   */
  changeLowNote(index: number) {
    this.lowNote = index;
    if (!this.useFlatsAndSharps) {
      if (NOTES[this.lowNote].length == 2) {
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
      if (NOTES[this.highNote].length == 2) {
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

  /**
   * Updates the score image based on the given note.
   * @param noteNumber - The index of the note to use for updating the score image.
   * @returns void
   */
  updateScore(noteNumber: number) {
    const _notes = NOTES[noteNumber];
    const scoreImage = _notes.length == 1 ? _notes[0] : _notes[Math.floor(Math.random() * 2)];
    this.scoreImage = `assets/images/score_images/${scoreImage}.svg`


    if (this.useDynamics) {
      const dynamic = DYNAMICS[Math.floor(Math.random() * DYNAMICS.length)];
      this._sounds.setVolume(dynamic.volume);
      this.score = scoreFromNote(scoreImage, dynamic.label);
    } else {
      this.score = scoreFromNote(scoreImage);
    }
  }

  /**
   * Generates a random note within the range of lowNote and highNote.
   * @returns {number} The generated note.
   */
  nextNote() {
    const next = Math.round(Math.random() * (this.highNote - this.lowNote)) + this.lowNote;
    if (!this.useFlatsAndSharps) {
      if (NOTES[next].length == 2) {
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
        this.updateTrumpetPosition(this.currentNote);
      }

      switch (tempo.measure) {
        case 0: this.currentAction = "Rest"; break;
        case 1: this.currentAction = "Listen"; break;
        case 2: this.currentAction = "Play"; break;
      }

      if (this.mode == 'trumpet') {
        switch (tempo.measure) {
          case 0: this.pitchService.disconnect(); break;
          case 2: this.pitchService.connect();
        }
      }

      if (this.mode == 'tuner') {
        switch (tempo.measure) {
          case 0: this.chromaticTuner.stop(); break;
          case 2: this.chromaticTuner.start();
        }
      }
    }
    if (tempo.cycle === MAXCYCLES) {
      this.firebase.saveStop('finished');
      console.log('finished');
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
    } else {
      this.start();
    }
  }

  /**
   * Starts the tempo and saves the current state to Firebase.
   * @returns void
   */
  start() {
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
      this.chromaticTuner.stop();
    }
    else if (this.mode == 'trumpet') {
      this.pitchService.disconnect();
    }
    // stop everything playing in the audio context
    Howler.stop();
    this.firebase.saveStop('interrupted');
  }


  /**
   * Returns the path to the image file for the given note.
   * @param note - The note to get the image for.
   * @returns The path to the image file.
   */
  getNoteImg(note: number): string {
    return `assets/images/notes_images/_${NOTES[note][0]}.png`;
  }

  /**
   * Returns a boolean indicating whether the tempo is currently playing or not.
   * @returns {boolean} A boolean indicating whether the tempo is currently playing or not.
   */
  isPlaying(): boolean {
    return this._tempo.playing$.value;
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
            } else if (type === 'tempo') {
              this._tempo.setTempo(value[type].value);
            }
          }
        },
      ],
    });

    await picker.present();

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

  /**
   * Opens the registration modal asynchronously.
   * @returns A promise that resolves when the modal is opened.
   */
  async openRegistrationModal() {
    await this._registration.openModal();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

}
