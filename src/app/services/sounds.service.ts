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

// Predefined beat sounds
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
 * @param volume - The volume level to set for the audio.
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
/**
 * Service for managing and playing sounds in the application.
 */
export class SoundsService {
    private selectedInstrument: string = 'trumpet'; // Default instrument
    private preloadedNotes: Howl[] = []; // Array to hold preloaded note sounds
    currentNote: number = 0; // Index of the current note
    volume: number = 1.0; // Volume level for sound playback

    /**
     * Creates an instance of SoundsService.
     * @param {BeatService} _beat - The BeatService instance for synchronizing sounds with beats.
     */
    constructor(private _beat: BeatService) {
        this.preloadSounds(); // Preload sounds on initialization
        this._beat.tick$.subscribe((beat) => this.playSounds(beat)); // Subscribe to beat ticks
    }

    /**
     * Preloads all the sounds used in the app based on the selected instrument.
     * @returns void
     */
    private preloadSounds() {
        const notesToLoad = this.selectedInstrument === 'trumpet' ? TRUMPET_NOTES : CLARINET_NOTES;
        for (let sound of BEAT_SOUNDS) {
            sound.load(); // Load beat sounds
        }
        this.preloadedNotes = [];
        for (let i = 0; i < notesToLoad.length; i++) {
            const note = notesToLoad[i];
            const soundFile = note[0];

            const audio = new Howl({ src: [`assets/sounds/${this.selectedInstrument}_note_sounds/${soundFile}.wav`] });
            this.preloadedNotes.push(audio); // Store preloaded note sounds
        }
    }
        /**
     * Sets the instrument for sound playback and reloads the corresponding sounds.
     * @param {string} instrument - The name of the instrument to set (e.g., 'trumpet', 'clarinet').
     * @returns void
     * @example
     * soundsService.setInstrument('clarinet');
     */
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
            playAndFade(audio, 4 * 60000 / this._beat.tempo$.value, this.volume); // Play and fade the note sound
        }
    }
    // playTrumpetSound(currentNote: number) {
    //     const audio = this.preloadedNotes[currentNote];
    //     playAndFade(audio, 4 * 60000 / this._beat.tempo$.value, this.volume);
    // }

    /**
     * Plays the metronome sound for the given beat counter.
     * @param {number} beatCounter - The beat counter indicating which sound to play.
     * @returns void
     * @example
     * soundsService.playMetronome(0); // Plays the strong tick sound
     */
    playMetronome(beatCounter: number) {
        BEAT_SOUNDS[beatCounter].play();
    }

    /**
     * Plays the sounds for the given tempo.
     * @param {AppBeat} tempo - The tempo object containing beat and measure information.
     * @returns void
     * @example
     * soundsService.playSounds({ beat: 0, measure: 1 }); // Plays sounds for the first beat
     */
    playSounds(tempo: AppBeat) {
        this.playMetronome(tempo.beat);// Play the metronome sound

        if (tempo.beat == 0) {
            if (tempo.measure == 1) {
                this.playNoteSound(this.currentNote); // Play the note sound on the first beat of the measure
            }
        }
    }

    /**
     * Sets the volume of the sounds.
     * @param {number} volume - The volume level to set (0.0 to 1.0).
     * @returns void
     * @example
     * soundsService.setVolume(0.5); // Sets the volume to 50%
     */
    setVolume(volume: number) {
        this.volume = volume; // Update the volume level
    }
}
