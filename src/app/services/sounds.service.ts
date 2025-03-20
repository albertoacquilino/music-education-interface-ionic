/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { Injectable } from "@angular/core";
import { BeatService } from "./beat.service";
import { AppBeat } from '../models/appbeat.types';
import { Howl } from "howler";
import { TRUMPET_NOTES, CLARINET_NOTES } from "../constants";

export const BEAT_SOUNDS = [
    new Howl({ src: ['assets/sounds/tick_strong.wav'] }),
    new Howl({ src: ['assets/sounds/tick_weak.wav'] }),
    new Howl({ src: ['assets/sounds/tick_weak.wav'] }),
    new Howl({ src: ['assets/sounds/tick_weak.wav'] })
]

/**
 * Plays an audio file and fades it out after a specified duration.
 * @param audio - The Howl audio object to play.
 * @param duration - The duration in milliseconds to play the audio before fading it out.
 */
function playAndFade(audio: Howl, duration: number, volume: number = 1.0) {
    audio.volume(volume);
    const id1 = audio.play();
    const fade = Math.max(duration / 10, 100);
    setTimeout(() => {
        audio.fade(volume, 0, fade, id1);
    }, duration - fade);
    setTimeout(() => {
        audio.stop(id1);
    }, duration);
}

@Injectable({
    providedIn: 'root'
})
export class SoundsService {
    private selectedInstrument: string = 'trumpet';
    private preloadedNotes: Howl[] = [];
    currentNote: number = 0;
    volume: number = 1.0;

    /**
     * Creates an instance of SoundsService.
     * @param {BeatService} _beat - The BeatService instance.
     */
    constructor(private _beat: BeatService) {
        this.preloadSounds();
        this._beat.tick$.subscribe((beat) => this.playSounds(beat));
    }

    /**
     * Preloads all the sounds used in the app.
     */
    private preloadSounds() {
        const notesToLoad = this.selectedInstrument === 'trumpet' ? TRUMPET_NOTES : CLARINET_NOTES;
        for (let sound of BEAT_SOUNDS) {
            sound.load();
        }
        this.preloadedNotes = [];
        for (let i = 0; i < notesToLoad.length; i++) {
            const note = notesToLoad[i];
            const soundFile = note[0];

            const audio = new Howl({ src: [`assets/sounds/${this.selectedInstrument}_note_sounds/${soundFile}.wav`] });
            this.preloadedNotes.push(audio);
        }
    }
    public setInstrument(instrument: string) {
        this.selectedInstrument = instrument;
        this.preloadSounds(); // Reload sounds for the new instrument
    }
    /**
     * Plays the trumpet sound for the current note.
     * @param {number} currentNote - The current note index.
     */
    playNoteSound(currentNote: number) {
        const audio = this.preloadedNotes[currentNote];
        if (audio) {
            playAndFade(audio, 4 * 60000 / this._beat.tempo$.value, this.volume);
        }
    }
    // playTrumpetSound(currentNote: number) {
    //     const audio = this.preloadedNotes[currentNote];
    //     playAndFade(audio, 4 * 60000 / this._beat.tempo$.value, this.volume);
    // }

    /**
     * Plays the metronome sound for the given beat counter.
     * @param {number} beatCounter - The beat counter.
     */
    playMetronome(beatCounter: number) {
        BEAT_SOUNDS[beatCounter].play();
    }

    /**
     * Plays the sounds for the given tempo.
     * @param {AppBeat} tempo - The tempo object.
     */
    playSounds(tempo: AppBeat) {
        this.playMetronome(tempo.beat);

        if (tempo.beat == 0) {
            if (tempo.measure == 1) {
                this.playNoteSound(this.currentNote)
            }
        }
    }

    /**
     * Sets the volume of the sounds.
     * @param {number} volume - The volume to set.
     */
    setVolume(volume: number) {
        this.volume = volume;
    }
}
