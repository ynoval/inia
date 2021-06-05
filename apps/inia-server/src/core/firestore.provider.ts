import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
//TODO: CHANGE
import * as fsInfo from '../config//credentials/fs-key.json';

@Injectable()
export class FirestoreProvider {
  public db: firebase.firestore.Firestore;
  constructor() {
    try {
      const fsApp = firebase.initializeApp({
        credential: firebase.credential.cert({
          privateKey: fsInfo.private_key,
          clientEmail: fsInfo.client_email,
          projectId: fsInfo.project_id,
        }),
      });
      console.log('Firestore initialized successful');
      this.db = fsApp.firestore();
    } catch (e) {
      console.log(
        'ERROR - FirestoreProvider: Unable to initialize Firestore -> ' + e
      );
    }
  }

  // public timestamp(): FieldValue {
  //     return firebase.firestore.FieldValue.serverTimestamp();
  // }
}
