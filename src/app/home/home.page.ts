import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleChevronDown, faCircleChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Howl } from 'howler';

const MAXNOTE = 30;
const MINNOTE = 0;
const MAXTEMPO = 180;
const MINTEMPO = 40;
const BEAT_SOUNDS = [
  new Howl({ src: ['assets/sounds/tick_strong.wav'] }),
  new Howl({ src: ['assets/sounds/tick_weak.wav'] }),
  new Howl({ src: ['assets/sounds/tick_weak.wav'] }),
  new Howl({ src: ['assets/sounds/tick_weak.wav'] })
]

const NOTES = [
  ['F1s', 'G1f'],
  ['G1'],
  ['G1s', 'A1f'],
  ['A1'],
  ['B1f', 'A1s'],
  ['B1'],
  ['C2'],
  ['C2s', 'D2f'],
  ['D2'],
  ['E2f', 'D2s'],
  ['E2'],
  ['F2'],
  ['F2s', 'G2f'],
  ['G2'],
  ['G2s', 'A2f'],
  ['A2'],
  ['B2f', 'A2s'],
  ['B2'],
  ['C3'],
  ['C3s', 'D3f'],
  ['D3'],
  ['E3f', 'D3s'],
  ['E3'],
  ['F3'],
  ['F3s', 'G3f'],
  ['G3'],
  ['G3s', 'A3f'],
  ['A3'],
  ['B3f', 'A3s'],
  ['B3'],
  ['C4'],
];

const POSITIONS = [
  'pos_7',
  'pos_6',
  'pos_5',
  'pos_4',
  'pos_3',
  'pos_2',
  'pos_1',

  'pos_7a',
  'pos_6a',
  'pos_5',
  'pos_4',
  'pos_3',
  'pos_2',
  'pos_1',

  'pos_5',
  'pos_4',
  'pos_3',
  'pos_2',
  'pos_1',
  'pos_4',
  'pos_3',
  'pos_2',
  'pos_1',

  'pos_3',
  'pos_2',
  'pos_1',

  'pos_5',
  'pos_4',
  'pos_3',
  'pos_2',
  'pos_1',
];


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FontAwesomeModule],
})
export class HomePage {
  audioContext = new AudioContext();
  faCircleChevronDown = faCircleChevronDown;
  faCircleChevronUp = faCircleChevronUp;

  tempo = 80;
  highNote = 13;
  lowNote = 13;

  timer: any;
  beatCounter = 0;
  measureCounter = 0;
  currentNote: number = 0;

  isPlaying = false;
  preloadedNotes: Howl[] = [];
  audioNodes = {};

  currentAction = 'rest';
  trumpetPosition = "assets/images/trumpet_positions/pos_1.png"
  scoreImage = "assets/images/score_images/G2.svg";

  preloadSounds() {
    for (let sound of BEAT_SOUNDS) {
      sound.load();
    }

    for (let i = 0; i < NOTES.length; i++) {
      const note = NOTES[i];
      const soundFile = note[0];

      const audio = new Howl({ src: [`assets/sounds/note_sounds/${soundFile}.wav`] });
      this.preloadedNotes.push(audio);
    }
  }


  updateTrumpetPosition(note: number) {
    const trumpetImg = POSITIONS[note];
    this.trumpetPosition = `assets/images/trumpet_positions/${trumpetImg}.png`;
  }

  playAndFade(audio: Howl, duration: number) {
    const id1 = audio.play();
    const fade = Math.max(duration / 10, 100);
    setTimeout(() => {
      audio.fade(1, 0, fade, id1);
    }, duration - fade);
    setTimeout(() => {
      audio.stop(id1);
    }, duration);
  }


  playTrumpetSound(currentNote: number) {
    const audio = this.preloadedNotes[currentNote];
    this.playAndFade(audio, 4 * 60000 / this.tempo);
  }

  updateScore(note: number) {
    const _notes = NOTES[note];
    const scoreNote = _notes.length == 1 ? _notes[0] : _notes[Math.floor(Math.random() * 2)];
    this.scoreImage = `assets/images/score_images/${scoreNote}.svg`
  }

  updateMetronome(counter: number) {
    const metronomeElement = document.getElementById("metronome-label");
  }

  nextNote() {
    const next = Math.round(Math.random() * (this.highNote - this.lowNote)) + this.lowNote;
    return next;
  }

  playMetronome(beatCounter: number) {
    BEAT_SOUNDS[beatCounter].play();
  }

  updateView() {
    this.updateMetronome(this.beatCounter);
    if (this.measureCounter == 0 && this.beatCounter == 0) {
      this.updateScore(this.currentNote);
      this.updateTrumpetPosition(this.currentNote);
    }
    if (this.beatCounter == 0) {
      const el = document.getElementById("action");
      switch (this.measureCounter) {
        case 0: this.currentAction = "Rest"; break;
        case 1: this.currentAction = "Listen"; break;
        case 2: this.currentAction = "Play"; break;
      }
    }
  }

  playSounds() {
    this.playMetronome(this.beatCounter);

    if (this.measureCounter == 1 && this.beatCounter == 0) {
      this.playTrumpetSound(this.currentNote)
    }
  }

  intervalHandler() {
    if (this.beatCounter == 0 && this.measureCounter == 0) {
      this.currentNote = this.nextNote();
    }
    this.updateView();
    this.playSounds();
    this.beatCounter = (this.beatCounter + 1) % 4;

    if (this.beatCounter == 0) {
      this.measureCounter = (this.measureCounter + 1) % 3;
    }

  }

  startStop() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    this.isPlaying = true;
    this.timer = setInterval(() => this.intervalHandler(), 60000 / this.tempo);

  }

  stop() {
    this.isPlaying = false;
    clearInterval(this.timer);
    this.beatCounter = 0;
    this.measureCounter = 0;

    this.updateView();
  }

  upTempo() {
    this.tempo = Math.min(this.tempo + 5, MAXTEMPO);
  }

  downTempo() {
    this.tempo = Math.max(this.tempo - 5, MINTEMPO);
  }

  upHighNote() {
    this.highNote = Math.min(this.highNote + 1, MAXNOTE);
  }
  downHighNote() {
    this.highNote = Math.max(this.highNote - 1, this.lowNote);
  }

  upLowNote() {
    this.lowNote = Math.min(this.lowNote + 1, this.highNote);
  }
  downLowNote() {
    this.lowNote = Math.max(this.lowNote - 1, MINNOTE);
  }

  getNoteImg(note: number) {
    return `assets/images/notes_images/_${NOTES[note][0]}.png`;
  }

  updateControls() {
    // let upTempoButton = document.getElementById('up-tempo');
    // let downTempoButton = document.getElementById('down-tempo');
    // let upHighNoteButton = document.getElementById('up-high-note');
    // let downHighNoteButton = document.getElementById('down-high-note');
    // let upLowNoteButton = document.getElementById('up-low-note');
    // let downLowNoteButton = document.getElementById('down-low-note');

    // let controls = [
    //   upTempoButton, downTempoButton, upHighNoteButton, downHighNoteButton, upLowNoteButton, downLowNoteButton
    // ];

    // if (!this.isPlaying) {
    //   startStopButton.textContent = "Start";
    //   for (let control in controls) {
    //     controls[control].removeAttribute('disabled');
    //   }
    // } else {
    //   for (let control in controls) {
    //     controls[control].setAttribute('disabled', undefined);
    //   }
    //   startStopButton.textContent = "Stop";
    // }



    // document.getElementById("high-note")
    //   .src = ;
    // document.getElementById("low-note")
    //   .src = `assets/images/notes_images/_${NOTES[lowNote][0]}.png`;

    // document.getElementById("tempo")
    //   .textContent = `${tempo} bpm`;


  }




  // function setup() {
  //   startStopButton = document.getElementById('start-stop');
  //   updateControls();
  // }

  // document.addEventListener("DOMContentLoaded", () => {
  //   setup();
  // });







  constructor() {
    this.preloadSounds();

  }
}
