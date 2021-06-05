import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
//TODO: CHANGE
import * as gcsInfo from '../config/credentials/gcs-key.json';

@Injectable()
export class GoogleCloudStorageProvider {
  public storage: Storage;
  constructor() {
    try {
      this.storage = new Storage({ credentials: gcsInfo });
      console.log('Google Cloud Storage initialized successful');
    } catch (e) {
      console.log(
        'ERROR - GCSProvider: Unable to initialize Google Cloud Storage -> ' + e
      );
    }
  }
}
