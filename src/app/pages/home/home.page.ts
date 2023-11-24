import { Component } from '@angular/core';
import { AlertController, IonicModule, PickerController } from '@ionic/angular';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleChevronDown, faCircleChevronUp } from '@fortawesome/free-solid-svg-icons';

import { CommonModule } from '@angular/common';
import { range } from 'lodash';
import { Observable, interval, tap } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SoundsService } from 'src/app/services/sounds.service';
import { ScrollImageComponent } from '../../components/scroll-image-selector/scroll-image-selector.component';
import { MAXTEMPO, MAXCYCLES, MINTEMPO, NOTES, POSITIONS } from '../../constants';
import { AppBeat, BeatService } from '../../services/beat.service';
import { RegistrationService } from 'src/app/services/registration.service';
import { Mute, MutePlugin, MuteResponse } from '@capgo/capacitor-mute';
import { ScoreComponent } from 'src/app/components/score/score.component';
import { Score } from 'src/app/components/score/score.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FontAwesomeModule, ScrollImageComponent, ScoreComponent, CommonModule],
})
/**
 * HomePage class represents the home page of the music education interface.
 */
export class HomePage {

  /**
   * Indicates whether the mute alert has been triggered.
   */
  muteAlert = false;

  /**
   * Indicates whether to show trumpet hints.
   */
  showTrumpetHints = true;

  /**
   * Indicates whether to use flats and sharps.
   */
  useFlatsAndSharps = true;

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
  highNote = 13;

  /**
   * The low note.
   */
  lowNote = 13;

  /**
   * The current note.
   */
  currentNote: number = 0;

  score: Score = {
    clef: 'treble',
    dynamic: 'mf',
    timeSignature: "4/4",
    keySignature: "C",
    measures: [
      [
        { notes: ['g/4'], duration: 'wr' },
      ],
      [
        { notes: ['g/4'], duration: 'w' },
      ],
      [
        { notes: ['g/4'], duration: 'w' },
      ]
    ]
  }

  /**
   * The audio nodes.
   */
  audioNodes = {};

  /**
   * The current action.
   */
  currentAction = 'rest';

  /**
   * The trumpet position.
   */
  trumpetPosition = "assets/images/trumpet_positions/pos_1.png"

  /**
   * The score image.
   */
  scoreImage = "assets/images/score_images/G2.svg";

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
   * Creates an instance of HomePage.
   * @param _picker - The picker controller.
   * @param _tempo - The beat service.
   * @param _sounds - The sounds service.
   * @param firebase - The Firebase service.
   * @param _registration - The registration service.
   * @param alertController - The alert controller.
   */
  constructor(
    private _picker: PickerController,
    private _tempo: BeatService,
    private _sounds: SoundsService,
    public firebase: FirebaseService,
    private _registration: RegistrationService,
    private alertController: AlertController
    //private _pitch: PitchService
  ) {
    this.beat$ = this._tempo.tick$.pipe(
      tap((tempo: AppBeat) => this.intervalHandler(tempo))
    );
    this.playing$ = this._tempo.playing$.asObservable();

    interval(1000).subscribe(async () => this.checkMuted());
  }

  /**
   * Checks if the device is muted and displays an alert if it is.
   * @returns void
   */
  async checkMuted(){
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
   * Switches the trumpet hints.
   * @param event - The event.
   * @returns void
   */
  switchTrumpetHints(event: any) {
    console.log(event);
    this.showTrumpetHints = event.detail.checked;
  }

  /**
   * Switches the use of flats and sharps.
   * @param event - The event.
   * @returns void
   */
  switchUseFlatsAndSharps(event: any) {
    console.log(event);
    this.useFlatsAndSharps = event.detail.checked;
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
  }

  /**
   * Updates the position of the trumpet image based on the given note.
   * @param note - The note to update the trumpet position to.
   * @returns void
   */
  updateTrumpetPosition(note: number) {
    const trumpetImg = POSITIONS[note];
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

    let scoreNote;
    const note = scoreImage[0];
    const octave = scoreImage[1];
    scoreNote = note + '/' + (Number(octave)+2);
    if(scoreImage.length == 3){
      const accidental = scoreImage[2]=='s' ? '#' : 'b';
      scoreNote = note + accidental + '/' + (Number(octave)+2);
    }
    

    this.score = {
      clef: 'treble',
      dynamic: 'mf',
      timeSignature: "4/4",
      keySignature: "C",
      measures: [
        [
          { notes: ['b/4'], duration: 'wr' },
        ],
        [
          { notes: [scoreNote], duration: 'w' },
        ],
        [
          { notes: [scoreNote], duration: 'w' },
        ]
      ]
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
    this.firebase.saveStart(this.tempo$.value, this.lowNote, this.highNote, this.useFlatsAndSharps, this.showTrumpetHints)
  }

  /**
   * Stops the tempo and all audio playback, and saves the stop event to Firebase.
   * @returns void
   */
  stop() {
    this._tempo.stop();
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


  /**
   * Opens a tempo picker dialog for selecting a new tempo.
   * If the tempo is currently playing, the dialog will not be opened.
   */
  async openTempoPicker() {
    if (this._tempo.playing$.value) {
      return;
    }

    // create list of options to be selected
    let options: { value: number, text: string }[];

    let selectedIndex = 0;
    let selectedValue: number;


    selectedValue = this.tempo$.value;
    options = range(MINTEMPO, MAXTEMPO + 1, 5).map(v => ({
      value: v,
      text: `${v} bpm`
    }));

    selectedIndex = options.findIndex(v => v.value == selectedValue);
    const picker = await this._picker.create({
      columns: [
        {
          name: 'tempo',
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
            this._tempo.setTempo(value['tempo'].value);
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


}
