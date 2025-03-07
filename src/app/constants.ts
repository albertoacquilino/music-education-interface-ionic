/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

export const MAXCYCLES = 12;
export const MAXNOTE = 30;
export const MINNOTE = 0;
export const MAXTEMPO = 180;
export const MINTEMPO = 40;
export const MINREFFREQUENCY = 430;
export const MAXREFFREQUENCY = 450;
export const INITIAL_NOTE = 13;

export const NOTES = [
    ['F1s', 'G1f'],
    ['G1'],
    ['G1s', 'A1f'],
    ['A1'],
    ['B1f', 'A1s'],
    ['B1'],
    ['C2'],
    ['C2s', 'D2f'],
    ['D2'],
    ['E2f', 'D2s'],
    ['E2'],
    ['F2'],
    ['F2s', 'G2f'],
    ['G2'],
    ['G2s', 'A2f'],
    ['A2'],
    ['B2f', 'A2s'],
    ['B2'],
    ['C3'],
    ['C3s', 'D3f'],
    ['D3'],
    ['E3f', 'D3s'],
    ['E3'],
    ['F3'],
    ['F3s', 'G3f'],
    ['G3'],
    ['G3s', 'A3f'],
    ['A3'],
    ['B3f', 'A3s'],
    ['B3'],
    ['C4'],
];

export const POSITIONS = [
    'pos_7',
    'pos_6',
    'pos_5',
    'pos_4',
    'pos_3',
    'pos_2',
    'pos_1',

    'pos_7a',
    'pos_6a',
    'pos_5',
    'pos_4',
    'pos_3',
    'pos_2',
    'pos_1',

    'pos_5',
    'pos_4',
    'pos_3',
    'pos_2',
    'pos_1',
    'pos_4',
    'pos_3',
    'pos_2',
    'pos_1',

    'pos_3',
    'pos_2',
    'pos_1',

    'pos_5',
    'pos_4',
    'pos_3',
    'pos_2',
    'pos_1',
];

export const TRUMPET_BTN = [
    [1, 2, 3],
    [1, 3],
    [2, 3],
    [1, 2],
    [1],
    [2],
    [],

    [0, 1, 2, 3],
    [0, 1, 3],
    [2, 3],
    [1, 2],
    [1],
    [2],
    [],

    [2, 3],
    [1, 2],
    [1],
    [2],
    [],
    [1, 2],
    [1],
    [2],
    [],

    [1],
    [2],
    [],

    [2, 3],
    [1, 2],
    [1],
    [2],
    [],
];


export const DYNAMICS = [
    { label: 'p', volume: 0.15 },
    { label: 'mf', volume: 0.4 },
    { label: 'f', volume: 1.0 },
];
