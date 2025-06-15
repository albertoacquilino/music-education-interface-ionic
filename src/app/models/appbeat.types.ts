/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

/**
 * Represents the state of a musical beat in the application.
 * 
 * The `AppBeat` type is used to track the current status of music playback,
 * including whether music is currently playing, the current measure,
 * the current beat within that measure, and the cycle of beats.
 * 
 * @public
 */
export type AppBeat = {
    /**
     * Indicates whether music is currently playing.
     * @type {boolean}
     */
    playing: boolean;

    /**
     * The current measure in the music piece.
     * Measures are typically used to divide music into sections.
     * @type {number}
     */
    measure: number;

    /**
     * The current beat within the current measure.
     * This is usually a number that represents the position in the measure.
     * @type {number}
     */
    beat: number;

    /**
     * The cycle of beats, which can represent a repeating pattern in the music.
     * @type {number}
     */
    cycle: number;
};

