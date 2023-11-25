import { Flow } from "vexflow";
// @ts-ignore
import { StaveNote } from "vexflow";
import { Score } from '../models/score.types';

/**
 * Generates a StaveNote object based on the provided notes and duration.
 * @param notes - An array of strings representing the notes.
 * @param duration - A string representing the duration of the notes.
 * @returns A StaveNote object.
 */
export function generateNotes(notes: string[], duration: string): StaveNote {
    const accidentals = notes.map((note) => {
        const [_note, octave] = note.split("/")
        if (_note.length === 1) return null;
        if (_note[1] === "b") {
            return new Flow.Accidental("b")
        } else if (_note[1] === "#") {
            return new Flow.Accidental("#")
        }
        else return null;
    });

    let staveNotes = new Flow.StaveNote({ keys: notes, duration: duration });
    for (const [index, accidental] of accidentals.entries()) {
        if (accidental === null) continue;
        staveNotes.addModifier(accidental, index);
    }

    return staveNotes;
}


  /**
   * Converts a MEI note to a Score object.
   * 
   * @param meiNote - The MEI note to convert.
   * @returns The converted Score object.
   */
  export function scoreFromNote(meiNote: string, dynamic: string|undefined = undefined): Score{
    let scoreNote;
    const note = meiNote[0];
    const octave = meiNote[1];
    scoreNote = note + '/' + (Number(octave) + 2);
    if (meiNote.length == 3) {
        const accidental = meiNote[2] == 's' ? '#' : 'b';
        scoreNote = note + accidental + '/' + (Number(octave) + 2);
    }

    const score = {
        clef: 'treble',
        dynamic: dynamic,
        dynamicPosition: 2,
        timeSignature: "4/4",
        keySignature: "C",
        measures: [
            [
                { notes: ['b/4'], duration: 'wr' },
            ],
            [
                { notes: [scoreNote], duration: 'w' },
            ],
            [
                { notes: [scoreNote], duration: 'w' },
            ]
        ]
    }
    return score;
}
