import { Injectable } from "@angular/core";
import { AppBeat, BeatService } from "./beat.service";
import { Howl } from "howler";
import { NOTES } from "../constants";

export const BEAT_SOUNDS = [
    new Howl({ src: ['assets/sounds/tick_strong.wav'] }),
    new Howl({ src: ['assets/sounds/tick_weak.wav'] }),
    new Howl({ src: ['assets/sounds/tick_weak.wav'] }),
    new Howl({ src: ['assets/sounds/tick_weak.wav'] })
]

function playAndFade(audio: Howl, duration: number) {
    const id1 = audio.play();
    const fade = Math.max(duration / 10, 100);
    setTimeout(() => {
        audio.fade(1, 0, fade, id1);
    }, duration - fade);
    setTimeout(() => {
        audio.stop(id1);
    }, duration);
}


@Injectable({
    providedIn: 'root'
})
export class SoundsService {
    private preloadedNotes: Howl[] = [];
    currentNote: number = 0;

    

    constructor(private _beat: BeatService) {
        this.preloadSounds();
        this._beat.tick$.subscribe((beat) => this.playSounds(beat));
    }

    private preloadSounds() {
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

    playTrumpetSound(currentNote: number) {
        const audio = this.preloadedNotes[currentNote];
        playAndFade(audio, 4 * 60000 / this._beat.tempo$.value);
    }

    playMetronome(beatCounter: number) {
        BEAT_SOUNDS[beatCounter].play();
    }


    playSounds(tempo: AppBeat) {
        this.playMetronome(tempo.beat);

        if (tempo.beat == 0) {
            if (tempo.measure == 1) {
                this.playTrumpetSound(this.currentNote)
            }
        }
    }


}
