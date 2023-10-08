import { Component } from '@angular/core';
import { IonicModule, PickerController } from '@ionic/angular';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleChevronDown, faCircleChevronUp } from '@fortawesome/free-solid-svg-icons';

import { CommonModule } from '@angular/common';
import { range } from 'lodash';
import { Observable, tap } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SoundsService } from 'src/app/services/sounds.service';
import { ScrollImageComponent } from '../../components/scroll-image-selector/scroll-image-selector.component';
import { MAXTEMPO, MAXCYCLES, MINTEMPO, NOTES, POSITIONS } from '../../constants';
import { AppBeat, BeatService } from '../../services/beat.service';
import { RegistrationService } from 'src/app/services/registration.service';


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

  tempo$ = this._tempo.tempo$;
  highNote = 13;
  lowNote = 13;

  currentNote: number = 0;
  
  audioNodes = {};

  currentAction = 'rest';
  trumpetPosition = "assets/images/trumpet_positions/pos_1.png"
  scoreImage = "assets/images/score_images/G2.svg";

  noteImages = NOTES.map(note => `assets/images/notes_images/_${note[0]}.svg`);

  beat$!: Observable<AppBeat>; 
  playing$!: Observable<boolean>;

  constructor(
    private _picker: PickerController, 
    private _tempo: BeatService, 
    private _sounds: SoundsService,
    private _firebase: FirebaseService,
    private _registration: RegistrationService
    //private _pitch: PitchService
    ) {      
    this.beat$ = this._tempo.tick$.pipe(
      tap((tempo: AppBeat) => console.table(tempo)),
      tap((tempo: AppBeat) => this.intervalHandler(tempo))
    );
    this.playing$ = this._tempo.playing$.asObservable();
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
        this.highNote--;
      }
    }

    if(this.highNote < this.lowNote){
      this.lowNote = this.highNote;
    }
  }

  updateTrumpetPosition(note: number) {
    const trumpetImg = POSITIONS[note];
    this.trumpetPosition = `assets/images/trumpet_positions/${trumpetImg}.png`;
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
  
  intervalHandler(tempo: AppBeat) {    
    if (tempo.beat == 0){  
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
      this._firebase.saveStop('finished');
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
    this._firebase.saveStart(this.tempo$.value, this.lowNote, this.highNote, this.useFlatsAndSharps, this.showTrumpetHints)
  }

  stop() {
    this._tempo.stop();
    // stop everything playing in the audio context
    Howler.stop();
    this._firebase.saveStop('interrupted');
  }


  getNoteImg(note: number) {
    return `assets/images/notes_images/_${NOTES[note][0]}.png`;
  }

  isPlaying(): boolean{
    return this._tempo.playing$.value;
  }



  async openTempoPicker() {
    if(this._tempo.playing$.value){
      return;
    }
    
    // create list of options to be selected
    let options: { value: number, text: string }[];
    
    let selectedIndex = 0;
    let selectedValue: number;
    

    selectedValue = this.tempo$.value;
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
              this._tempo.setTempo(value['tempo'].value);          
          }
        },
      ],
    });

    await picker.present();

  }

  handleRegistration(){
    //open a modal asking for the provided password



  }

  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

  async openRegistrationModal() {
    await this._registration.openModal();
  }
}
