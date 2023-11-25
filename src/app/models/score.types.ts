
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
