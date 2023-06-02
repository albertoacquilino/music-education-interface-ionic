import { Component } from '@angular/core';
import { IonicModule, PickerController } from '@ionic/angular';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleChevronDown, faCircleChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Howl } from 'howler';

import { CommonModule } from '@angular/common';
import { range } from 'lodash';
import { BEAT_SOUNDS, MAXTEMPO, MAX_CYCLES, MINTEMPO, NOTES, POSITIONS } from '../constants';
import { ScrollImageComponent } from '../scroll-image-selector/scroll-image-selector.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FontAwesomeModule, ScrollImageComponent, CommonModule],
})
export class HomePage {
  showTrumpetHints = true;
  useFlatsAndSharps = true;

  audioContext = new AudioContext();
  faCircleChevronDown = faCircleChevronDown;
  faCircleChevronUp = faCircleChevronUp;

  tempo = 80;
  highNote = 13;
  lowNote = 13;

  timer: any;
  beatCounter = -1;
  measureCounter = -1;
  currentNote: number = 0;

  isPlaying = false;
  preloadedNotes: Howl[] = [];
  audioNodes = {};

  currentAction = 'rest';
  trumpetPosition = "assets/images/trumpet_positions/pos_1.png"
  scoreImage = "assets/images/score_images/G2.svg";
  cycle = 0;

  noteImages = NOTES.map(note => `assets/images/notes_images/_${note[0]}.svg`);

  constructor(private _picker: PickerController) {
    this.preloadSounds();
  }

  switchTrumpetHints(event: any){
    console.log(event);
    this.showTrumpetHints = event.detail.checked;
  }

  switchUseFlatsAndSharps(event: any){
    console.log(event);
    this.useFlatsAndSharps = event.detail.checked;
    if(!this.useFlatsAndSharps){
      // check that low and high notes are not on accidentals
      // if they are, move them up by a half step
      if(NOTES[this.lowNote].length == 2){
        this.lowNote++;
      }
      if(NOTES[this.highNote].length == 2){
        this.highNote++;
      }
    }
  }

  changeLowNote(index: number){
    this.lowNote = index;
    if(!this.useFlatsAndSharps){
      if(NOTES[this.lowNote].length == 2){
        this.lowNote++;
      }
    }
    if(this.lowNote > this.highNote){
      this.highNote = this.lowNote;
    }
    
  }

  changeHighNote(index: number){
    this.highNote = index;
    if (!this.useFlatsAndSharps) {
      if (NOTES[this.highNote].length == 2) {
        this.highNote++;
      }
    }

    if(this.highNote < this.lowNote){
      this.lowNote = this.highNote;
    }
  }

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

  nextNote() {
    const next = Math.round(Math.random() * (this.highNote - this.lowNote)) + this.lowNote;
    if(!this.useFlatsAndSharps){
      if (NOTES[next].length == 2) {
        return next + 1;
      }
    }

    return next;
  }

  playMetronome(beatCounter: number) {
    BEAT_SOUNDS[beatCounter].play();
  }


  
  intervalHandler() {
    this.beatCounter = (this.beatCounter + 1) % 4;
    if (this.beatCounter == 0) {
      this.measureCounter = (this.measureCounter + 1) % 3;
      if (this.measureCounter == 0) {
        this.cycle += 1;
        if (this.cycle == MAX_CYCLES) {
          this.stop();
        }
      }
    }

    this.playMetronome(this.beatCounter);

    if (this.beatCounter == 0){
      if (this.measureCounter == 1) {
        this.playTrumpetSound(this.currentNote)
      }
  
      if (this.measureCounter == 0) {
        this.currentNote = this.nextNote();
        this.updateScore(this.currentNote);
        this.updateTrumpetPosition(this.currentNote);
      }

      switch (this.measureCounter) {
        case 0: this.currentAction = "Rest"; break;
        case 1: this.currentAction = "Listen"; break;
        case 2: this.currentAction = "Play"; break;
      }
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
    this.cycle = 0;
    this.timer = setInterval(() => this.intervalHandler(), 60000 / this.tempo);
  }

  stop() {
    this.cycle = 0;
    this.beatCounter = -1;
    this.measureCounter = -1;
    this.isPlaying = false;
    clearInterval(this.timer);
    this.beatCounter = 0;
    this.measureCounter = 0;

    // stop everything playing in the audio context
    Howler.stop();
  }


  getNoteImg(note: number) {
    return `assets/images/notes_images/_${NOTES[note][0]}.png`;
  }


  async openTempoPicker() {
    if(this.isPlaying){
      return;
    }
    
    // create list of options to be selected
    let options: { value: number, text: string }[];
    
    let selectedIndex = 0;
    let selectedValue: number;
    

    selectedValue = this.tempo;
    options = range(MINTEMPO, MAXTEMPO+1, 5).map(v => ({
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
              this.tempo = value['tempo'].value;          
          }
        },
      ],
    });

    await picker.present();

  }

  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }
}
