import { Injectable, NotFoundException } from '@nestjs/common';
import { FirestoreProvider } from '../core/firestore.provider';
import { GoogleCloudStorageProvider } from '../core/gcs.provider';
import { COLLECTION_NAME } from './specie.constants';
import { SpecieModel } from './specie.models';

@Injectable()
export class SpecieService {
  // TODO: Move to config file
  bucketName = 'gee_inia';
  constructor(
    private fs: FirestoreProvider,
    private gcs: GoogleCloudStorageProvider
  ) {}

  async getAll(): Promise<{ species: SpecieModel[] }> {
    try {
      const results = [];
      const speciesRef = await this.fs.db.collection(COLLECTION_NAME).get();
      speciesRef.docs.forEach((specie) => {
        results.push(this.getSpecie({ ...specie.data(), ['id']: specie.id }));
      });
      return { species: results };
    } catch (e) {
      console.log('ERROR(SpecieService - getAll): ' + e);
    }
  }
  async getOne(specieId: string): Promise<SpecieModel> {
    try {
      const specieRef = await this.fs.db
        .collection(COLLECTION_NAME)
        .doc(specieId)
        .get();
      return this.getSpecie({ ...specieRef.data(), ['id']: specieId });
    } catch (e) {
      console.log('ERROR(SpecieService - getOne): ' + e);
      throw new NotFoundException();
    }
  }

  async getImages(specieId: string): Promise<string[]> {
    try {
      const options = {
        prefix: 'species/' + specieId + '/',
      };
      const [imageFiles] = await this.gcs.storage
        .bucket(this.bucketName)
        .getFiles(options);
      //TODO: Check a better way (first element is folder (don't need it))
      imageFiles.shift();
      return imageFiles.map((file) => file.publicUrl());
    } catch (e) {
      console.log(e);
    }
  }

  //#region Private Methods
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getSpecie(specieInfo): SpecieModel {
    const specie = {
      id: specieInfo.id,
      name: specieInfo.name,
      commonNames: specieInfo.common_names,
      etymology: specieInfo.etymology,
      characteristics: specieInfo.characteristics,
      synonyms: specieInfo.synonyms,
      identificationAspects: specieInfo.identification_aspects,
    };
    return specie;
  }
  //#endregion
}
