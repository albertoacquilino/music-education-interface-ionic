/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

export type StudyGroup = {
  name: string;
  password: string;
};

export type DeviceInfo = {
  id: string;
  model: string;
  platform: string;
  osVersion: string;
};

export type Activity = {
  tempo: number;
  lowNote: number;
  highNote: number;
  useFlatsAndSharps: boolean;
  useDynamics: boolean;
  startTime: Date;
  endTime?: Date;
  device: DeviceInfo;
  action?: 'finished' | 'interrupted';
  duration?: number;
  collectedMeansObject?: { [key: string]: number[] }
};

export type User = {
  email: string;
  userId: string;
  age: number;
  progressionSpeed: string;
  role: string;
  learningMode?: string;
};
