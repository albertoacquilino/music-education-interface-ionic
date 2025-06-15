/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */


/**
 * Represents a musical score.
 * 
 * The `Score` type is used to define the structure of a musical score,
 * including measures, clef, time signature, key signature, dynamic markings,
 * and their positions within the score.
 * 
 * @public
 */
export type Score = {
  /**
   * An array of measures, where each measure contains an array of notes
   * and a duration. Each measure is represented as an object with
   * `notes` (an array of note names) and `duration` (a string representing
   * the duration of the measure).
   * 
   * @type {{ notes: string[]; duration: string; }[][]}
   */
  measures: { notes: string[]; duration: string; }[][];

  /**
   * This indicates the pitch range of the notes in the score.
   * 
   * @type {string}
   */
  clef?: string;

  /**
       * This indicates how many beats are in each measure and what note value
   * is equivalent to one beat.
   * 
   * @type {string}
   */
  timeSignature?: string;

  /**
        * This indicates the key of the music, which determines the sharps or flats
   * that are used throughout the piece.
   * 
   * @type {string}
   */
  keySignature?: string;

  /**
   * This indicates the volume level at which the music should be played.
   * 
   * @type {string}
   */
  dynamic?: string;

  /**
   * This is a numerical value indicating where the dynamic marking is placed
   * in relation to the measures.
   * 
   * @type {number}
   */
  dynamicPosition?: number;
};

