/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */


/**
 * Represents a musical score.
 */


export type Score = {
  /**
   * An array of measures, where each measure contains an array of notes and a duration.
   */
  measures: { notes: string[]; duration: string; }[][];

  /**
   * The clef used in the score.
   */
  clef?: string;

  /**
   * The time signature of the score.
   */
  timeSignature?: string;

  /**
   * The key signature of the score.
   */
  keySignature?: string;

  /**
   * The dynamic marking of the score.
   */
  dynamic?: string;

  /**
   * The position of the dynamic marking in the score.
   */
  dynamicPosition?: number;
};
