import { Injectable } from '@nestjs/common';
import * as ee from '@google/earthengine';
//TODO: CHANGE
import * as geeInfo from '../config/credentials/gee-key.json';

@Injectable()
export class GoogleEarthEngineProvider {
  constructor() {
    ee.data.authenticateViaPrivateKey(
      geeInfo,
      () => {
        console.log('Earth Engine authentication successful.');
        ee.initialize(
          null,
          null,
          () => {
            console.log('Earth Engine client library initialized.');
          },
          (err) => {
            console.log(err);
            console.log(
              `Please make sure you have created a service account and have been approved.
Visit https://developers.google.com/earth-engine/service_account#how-do-i-create-a-service-account to learn more.`
            );
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
