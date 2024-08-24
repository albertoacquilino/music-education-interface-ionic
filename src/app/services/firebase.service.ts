// Required for side-effects
import { initializeApp } from "firebase/app";
import "firebase/firestore";
import { Device } from '@capacitor/device';
import { DocumentReference, addDoc, collection, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { Injectable } from "@angular/core";
import { User, Activity } from "../models/firebase.types";


const firebaseConfig = {
  apiKey: "AIzaSyDSpKBGWsrGNkocpyN_ledyIomcGJ14Pto",
  authDomain: "mei-trumpet.firebaseapp.com",
  projectId: "mei-trumpet",
  storageBucket: "mei-trumpet.appspot.com",
  messagingSenderId: "874766472837",
  appId: "1:874766472837:web:87d898a7b07de47e097bec",
  measurementId: "G-150GS2FPPB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  currentActivity!: Activity;

  constructor() {
    this.uploadSavedActivities();
  }


  /**
   * Saves the current activity to local storage.
   * @param tempo - The tempo of the activity.
   * @param lowNote - The lowest note of the activity.
   * @param highNote - The highest note of the activity.
   * @param useFlatsAndSharps - Whether to use flats and sharps in the activity.
   * @param showTrumpetHints - Whether to show trumpet hints in the activity.
   */
  public async saveStart(
    tempo: number,
    lowNote: number,
    highNote: number,
    useFlatsAndSharps: boolean,
    useDynamics: boolean
  ) {
    const startTime = new Date();
    const deviceInfo = await Device.getInfo();
    const deviceId = await Device.getId();


    this.currentActivity = {
      tempo,
      lowNote,
      highNote,
      useFlatsAndSharps,
      startTime,
      useDynamics,
      device: {
        id: deviceId.identifier,
        model: deviceInfo.model,
        platform: deviceInfo.platform,
        osVersion: deviceInfo.osVersion,
      },
    };

    this.saveToLocalStorage(this.currentActivity);
  }

  /**
   * Saves the current activity and uploads it to Firebase.
   * @param action - The action performed on the activity ('finished' or 'interrupted').
   */
  public async saveStop(action: 'finished' | 'interrupted', collectedMeansObject: { [key: string]: number[] }) {
    const endTime = new Date();
    this.currentActivity = {
      ...this.currentActivity,
      action,
      endTime,
      duration: (endTime.getTime() - this.currentActivity.startTime.getTime()) / 1000, 
      collectedMeansObject,
    };

    this.updateInLocalStorage(this.currentActivity);

    // save to Firebase
    try {
      await this.saveActivity(this.currentActivity);
      // remove from local storage
      this.removeFromLocalStorage(this.currentActivity);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  
  public async registerUser(user: User): Promise<DocumentReference> {
    try {
      const userDocRef = await addDoc(collection(db, 'user_info'), user);
      console.log('User registered with ID:', userDocRef.id);
      return userDocRef;

    } catch (e) {
      console.log('Error', e);
      throw e;
    }
  }


  /**
   * Saves an activity to the Firestore database.
   * @param activity The activity to be saved.
   * @returns A promise that resolves to the document reference of the saved activity.
   */
  private async saveActivity(activity: Activity): Promise<DocumentReference> {
    const docId = await addDoc(collection(db, "activities"), activity);
    return docId;
  }

  /**
   * Saves the given activity to local storage.
   * @param activity The activity to be saved.
   */
  private saveToLocalStorage(activity: Activity) {
    const activities = this.loadActivitiesFromLocalStorage();
    activities.push(activity);
    localStorage.setItem('activities', JSON.stringify(activities));
  }

  /**
   * Uploads saved activities to Firebase.
   * Retrieves activities from local storage and saves them to Firebase.
   * Removes saved activities from local storage after they have been successfully saved to Firebase.
   */
  private async uploadSavedActivities() {
    let activities = this.loadActivitiesFromLocalStorage();
    for (let activity of activities) {
      try {
        await this.saveActivity(activity);

        // remove from local storage
        this.removeFromLocalStorage(activity);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }

  /**
   * Removes the given activity from local storage.
   * @param activity - The activity to be removed.
   */
  private removeFromLocalStorage(activity: Activity): void {
    let activities = this.loadActivitiesFromLocalStorage();
    activities = activities.filter((a: Activity) => a.startTime.toISOString() !== activity.startTime.toISOString());
    localStorage.setItem('activities', JSON.stringify(activities));
  }

  /**
   * Updates the activity in the local storage.
   * @param activity - The activity to update.
   */
  private updateInLocalStorage(activity: Activity): void {
    let activities = this.loadActivitiesFromLocalStorage();
    const index = activities.findIndex((a: Activity) => a.startTime.toISOString() === activity.startTime.toISOString());
    activities[index] = activity;
    localStorage.setItem('activities', JSON.stringify(activities));
  }

  private loadActivitiesFromLocalStorage(): Activity[] {
    const activitiesJSON = JSON.parse(localStorage.getItem('activities') || '[]');
    const activities = activitiesJSON.map((a: any) => {
      const activity = {
        ...a,
        startTime: a.startTime ? new Date(a.startTime) : undefined,
      };
      if (a.endTime) {
        activity['endTime'] = new Date(a.endTime);
      }
      return activity;
    });

    return activities;
  }
}