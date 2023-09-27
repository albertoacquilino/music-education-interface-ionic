// Required for side-effects
import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { DocumentData, DocumentReference, getFirestore, updateDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

import firebase from "firebase/compat/app";
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
  export class FirebaseService{
    currentDoc!: DocumentReference;
    startTime!: Date;
    endTime!: Date;

    public async saveStart(
        tempo: number,
        lowNote: number, 
        highNote: number, 
        useFlatsAndSharps: boolean, 
        showTrumpetHints: boolean,
        )
         {


        try {
            const startTime = new Date();
          const docRef = await addDoc(collection(db, "activities"), {
            tempo,
            lowNote,
            highNote,
            useFlatsAndSharps,
            showTrumpetHints,
            startTime
          });
          this.startTime = startTime;
          this.currentDoc = docRef;
          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    
      public async saveStop(){
        this.endTime = new Date();

        await updateDoc(
            this.currentDoc, 
            {endTime: this.endTime}
        );

      }
  }