import { Injectable } from '@nestjs/common';
import {
  GrasslandCommunityModel,
  GrasslandCommunitySpecieModel,
  GrasslandCommunitySubCommunityModel,
} from './grassland-community.models';
import { FirestoreProvider } from '../core/firestore.provider';
import {
  GREENLANDS_COMMUNITIES_COLLECTION_NAME,
  GREENLANDS_COMMUNITIES_SPECIES_COLLECTION_NAME,
  GREENLANDS_COMMUNITIES_SUB_COMMUNITY_COLLECTION_NAME,
} from './grassland-community.constants';
import { GoogleCloudStorageProvider } from '../core/gcs.provider';

@Injectable()
export class GrasslandCommunityService {
  // TODO: Move to config file
  bucketName = 'gee_inia';
  constructor(
    private fs: FirestoreProvider,
    private gcs: GoogleCloudStorageProvider
  ) {}

  async getAll(): Promise<{ grasslandCommunities: GrasslandCommunityModel[] }> {
    try {
      const results = [];
      const grasslandCommunitiesRef = await this.fs.db
        .collection(GREENLANDS_COMMUNITIES_COLLECTION_NAME)
        .orderBy('order')
        .get();
      grasslandCommunitiesRef.docs.forEach((grasslandCommunity) => {
        const grasslandCommunityInfo = this.getGrasslandCommunity({
          ...grasslandCommunity.data(),
          id: grasslandCommunity.id,
        });
        results.push(grasslandCommunityInfo);
      });
      return { grasslandCommunities: results };
    } catch (e) {
      console.log('ERROR (GRASSLAND COMMUNITY SERVICE - getAll):  ' + e);
    }
  }
  async getOne(
    grasslandCommunityId: string
  ): Promise<{ grasslandCommunity: GrasslandCommunityModel }> {
    try {
      const grasslandCommunityRef = await this.fs.db
        .collection(GREENLANDS_COMMUNITIES_COLLECTION_NAME)
        .doc(grasslandCommunityId)
        .get();
      return {
        grasslandCommunity: this.getGrasslandCommunity({
          ...grasslandCommunityRef.data(),
          id: grasslandCommunityId,
        }),
      };
    } catch (e) {
      console.log('ERROR(GrasslandCommunityService - getOne): ' + e);
    }
  }

  async findSpecies(
    grasslandCommunityId: string
  ): Promise<{ species: GrasslandCommunitySpecieModel[] }> {
    try {
      console.log(grasslandCommunityId);
      const results = [];
      const speciesRef = await this.fs.db
        .collection(GREENLANDS_COMMUNITIES_COLLECTION_NAME)
        .doc(grasslandCommunityId)
        .collection(GREENLANDS_COMMUNITIES_SPECIES_COLLECTION_NAME)
        .orderBy('name')
        .get();

      //console.log(specieRef);
      speciesRef.docs.forEach((specie) => {
        results.push(
          this.getSpecieInfo({ ...specie.data(), ['id']: specie.id })
        );
      });
      return { species: results };
    } catch (e) {
      console.log(
        'ERROR (GrasslandCommunityService - findSpecies): Unable to get community species ' +
          e
      );
    }
  }

  async findSubCommunities(
    grasslandCommunityId: string
  ): Promise<{ subcommunities: GrasslandCommunitySubCommunityModel[] }> {
    try {
      const results = [];
      const subcommunitiesRef = await this.fs.db
        .collection(GREENLANDS_COMMUNITIES_COLLECTION_NAME)
        .doc(grasslandCommunityId)
        .collection(GREENLANDS_COMMUNITIES_SUB_COMMUNITY_COLLECTION_NAME)
        .orderBy('order')
        .get();

      //console.log(specieRef);
      subcommunitiesRef.docs.forEach((subcommunity) => {
        results.push(
          this.getSubcommunityInfo({
            ...subcommunity.data(),
            ['id']: subcommunity.id,
          })
        );
      });
      return { subcommunities: results };
    } catch (e) {
      console.log(
        'ERROR (GrasslandCommunityService - findSubCommunities): Unable to get subcommunities ' +
          e
      );
    }
  }

  async getSubCommunityImages(
    communityId: string,
    subCommunityId: string
  ): Promise<string[]> {
    try {
      const options = {
        prefix: `communities/${communityId}/${subCommunityId}/`,
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
  private getGrasslandCommunity(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    grasslandCommunityInfo: any
  ): GrasslandCommunityModel {
    console.log(grasslandCommunityInfo);
    try {
      return {
        id: grasslandCommunityInfo.id,
        name: grasslandCommunityInfo.name,
        link: grasslandCommunityInfo.link,
        description: grasslandCommunityInfo.description,
        order: grasslandCommunityInfo.order,
      };
    } catch (e) {
      console.log(
        'ERROR (GrasslandCommunityService - getGrasslandCommunity): Unable to create a GrasslandCommunityModel using the info parameter -> ' +
          e
      );
    }
  }

  private getSpecieInfo(specieInfo): GrasslandCommunitySpecieModel {
    console.log(specieInfo);
    return {
      id: specieInfo.id,
      name: specieInfo.name,
    };
  }

  private getSubcommunityInfo(
    subcommunityInfo
  ): GrasslandCommunitySubCommunityModel {
    return {
      id: subcommunityInfo.id,
      order: subcommunityInfo.order,

      predominantSpecies: subcommunityInfo.predominant_species,
      indicatorSpecies: subcommunityInfo.indicator_species,
    };
  }
  //#endregion
}
