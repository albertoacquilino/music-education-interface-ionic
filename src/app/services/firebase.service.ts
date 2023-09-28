// Required for side-effects
import { initializeApp } from "firebase/app";
import "firebase/firestore";
import { Device } from '@capacitor/device';
import { DocumentReference, addDoc, collection, getFirestore, updateDoc } from "firebase/firestore";
import { Injectable } from "@angular/core";


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
  currentDoc!: DocumentReference;
  startTime!: Date;
  endTime!: Date;

  public async saveStart(
    tempo: number,
    lowNote: number,
    highNote: number,
    useFlatsAndSharps: boolean,
    showTrumpetHints: boolean,
  ) {

    const startTime = new Date();
    this.startTime = startTime;
    const deviceInfo = await Device.getInfo();
    const deviceId = await Device.getId();

    try {      
      const docRef = await addDoc(collection(db, "activities"), {
        tempo,
        lowNote,
        highNote,
        useFlatsAndSharps,
        showTrumpetHints,
        startTime,
        device: {
          id: deviceId.identifier,
          model: deviceInfo.model,
          platform: deviceInfo.platform,
          osVersion: deviceInfo.osVersion,
        }
      });
      
      this.currentDoc = docRef;
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  public async saveStop() {
    this.endTime = new Date();

    await updateDoc(
      this.currentDoc,
      {
        endTime: this.endTime,
        duration: (this.endTime.getTime() - this.startTime.getTime()) / 1000
      }
    );

  }
}