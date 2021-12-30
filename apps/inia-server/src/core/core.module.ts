import { Module } from '@nestjs/common';

import { FirestoreProvider } from './firestore.provider';
import { GoogleEarthEngineProvider } from './gee.provider';
import { GoogleCloudStorageProvider } from './gcs.provider';

@Module({
  providers: [
    FirestoreProvider,
    GoogleEarthEngineProvider,
    GoogleCloudStorageProvider,
  ],
  exports: [
    FirestoreProvider,
    GoogleEarthEngineProvider,
    GoogleCloudStorageProvider,
  ],
})
export class CoreModule {}
