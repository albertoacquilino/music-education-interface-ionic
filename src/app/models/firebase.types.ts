/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

export type StudyGroup = {
  /**
   * The name of the study group.
   * @type {string}
   */
  name: string;

  /**
   * The password for the study group.
   * @type {string}
   */
  password: string;
};

/**
* Represents information about a device used in the application.
* 
* The `DeviceInfo` type captures details about the device, including its
* unique identifier, model, platform, and operating system version.
* 
* @public
*/
export type DeviceInfo = {
  /**
   * The unique identifier for the device.
   * @type {string}
   */
  id: string;

  /**
   * The model of the device.
   * @type {string}
   */
  model: string;

  /**
   * The platform of the device (e.g., iOS, Android).
   * @type {string}
   */
  platform: string;

  /**
   * The operating system version of the device.
   * @type {string}
   */
  osVersion: string;
};

/**
* Represents an activity performed by a user in the application.
* 
* The `Activity` type is used to track various parameters of a user's
* musical activity, including tempo, note range, and device information.
* 
* @public
*/
export type Activity = {
  /**
   * The tempo of the activity in beats per minute.
   * @type {number}
   */
  tempo: number;

  /**
   * The lowest note in the activity.
   * @type {number}
   */
  lowNote: number;

  /**
   * The highest note in the activity.
   * @type {number}
   */
  highNote: number;
  refFrequencyValue:number,
  useFlatsAndSharps: boolean;

  /**
   * Indicates whether dynamics are used in the activity.
   * @type {boolean}
   */
  useDynamics: boolean;

  /**
   * The start time of the activity.
   * @type {Date}
   */
  startTime: Date;

  /**
   * The end time of the activity (optional).
   * @type {Date}
   */
  endTime?: Date;

  /**
   * Information about the device used for the activity.
   * @type {DeviceInfo}
   */
  device: DeviceInfo;

  /**
   * The action taken at the end of the activity (optional).
   * Can be either 'finished' or 'interrupted'.
   * @type {'finished' | 'interrupted'}
   */
  action?: 'finished' | 'interrupted';

  /**
   * The duration of the activity in seconds (optional).
   * @type {number}
   */
  duration?: number;
    /**
   * An object containing collected means, where keys are strings
   * and values are arrays of numbers (optional).
   * @type {{ [key: string]: number[] }}
   */
  collectedMeansObject?: { [key: string]: number[] }
};

/**
* Represents a user in the application.
* 
* The `User ` type is used to define the properties of a user,
* including their email, user ID, age, progression speed, and role.
* 
* @public
*/
export type User = {
  /**
   * The email address of the user.
   * @type {string}
   */
  email: string;

  /**
   * The unique identifier for the user.
   * @type {string}
   */
  userId: string;

  /**
   * The age of the user.
   * @type {number}
   */
  age: number;

  /**
   * The speed at which the user progresses in their learning.
   * @type {string}
   */
  progressionSpeed: string;

  /**
   * The role of the user (e.g., student, teacher).
   * @type {string}
   */
  role: string;

  /**
   * The learning mode of the user (optional).
   * @type {string}
   */
  learningMode?: string;
};

