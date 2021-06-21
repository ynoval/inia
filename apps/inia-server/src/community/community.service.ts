import { Injectable } from '@nestjs/common';
import {
  CommunityModel,
  CommunitySpecieModel,
  CommunitySubCommunityModel,
} from './community.models';
import { FirestoreProvider } from '../core/firestore.provider';
import {
  COMMUNITIES_COLLECTION_NAME,
  COMMUNITIES_SPECIES_COLLECTION_NAME,
  COMMUNITIES_SUB_COMMUNITY_COLLECTION_NAME,
} from './community.constants';
import { GoogleCloudStorageProvider } from '../core/gcs.provider';

@Injectable()
export class CommunityService {
  // TODO: Move to config file
  bucketName = 'gee_inia';
  constructor(
    private fs: FirestoreProvider,
    private gcs: GoogleCloudStorageProvider
  ) {}

  async getAll(): Promise<CommunityModel[]> {
    try {
      const results = [];
      const communitiesRef = await this.fs.db
        .collection(COMMUNITIES_COLLECTION_NAME)
        .orderBy('order')
        .get();
      communitiesRef.docs.forEach((community) => {
        const communityInfo = this.getCommunity({
          ...community.data(),
          id: community.id,
        });
        results.push(communityInfo);
      });
      return results;
    } catch (e) {
      console.log('ERROR (CommunityService - getAll):  ' + e);
    }
  }
  async getOne(communityId: string): Promise<CommunityModel> {
    try {
      const communityRef = await this.fs.db
        .collection(COMMUNITIES_COLLECTION_NAME)
        .doc(communityId)
        .get();

      if (!communityRef.exists) {
        throw 'Unable to retrieve document with id: ' + communityId;
      }
      return this.getCommunity({ ...communityRef.data(), id: communityId });
    } catch (e) {
      console.log('ERROR(CommunityService - getOne): ' + e);
      throw e;
    }
  }

  async getOneByOrder(communityOrder: string): Promise<CommunityModel> {
    try {
      const resultRef = await this.fs.db
        .collection(COMMUNITIES_COLLECTION_NAME)
        .where('order', '==', communityOrder)
        .get();
      if (!resultRef.empty) {
        return this.getCommunity({
          ...resultRef.docs[0].data(),
          id: resultRef.docs[0].id,
        });
      }
      throw 'Unable to found any document with this Id: ' + communityOrder;
    } catch (e) {
      console.log('ERROR(CommunityService - getOneByOrder): ' + e);
      throw(e)
    }
  }

  async findSpecies(communityId: string): Promise<CommunitySpecieModel[]> {
    try {
      const results = [];
      const speciesRef = await this.fs.db
        .collection(COMMUNITIES_COLLECTION_NAME)
        .doc(communityId)
        .collection(COMMUNITIES_SPECIES_COLLECTION_NAME)
        .orderBy('name')
        .get();
      speciesRef.docs.forEach((specie) => {
        results.push(
          this.getSpecieInfo({ ...specie.data(), ['id']: specie.id })
        );
      });
      return results;
    } catch (e) {
      console.log(
        'ERROR (CommunityService - findSpecies): Unable to get community species ' +
          e
      );
    }
  }

  async findSubCommunities(
    communityId: string
  ): Promise<CommunitySubCommunityModel[]> {
    try {
      const results = [];
      const subcommunitiesRef = await this.fs.db
        .collection(COMMUNITIES_COLLECTION_NAME)
        .doc(communityId)
        .collection(COMMUNITIES_SUB_COMMUNITY_COLLECTION_NAME)
        .orderBy('order')
        .get();

      subcommunitiesRef.docs.forEach((subcommunity) => {
        results.push(
          this.getSubcommunityInfo({
            ...subcommunity.data(),
            ['id']: subcommunity.id,
          })
        );
      });
      return results;
    } catch (e) {
      console.log(
        'ERROR (CommunityService - findSubCommunities): Unable to get subcommunities ' +
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
      //TODO: Check a better way (first element is the folder name (don't need it))
      imageFiles.shift();
      return imageFiles.map((file) => file.publicUrl());
    } catch (e) {
      console.log(e);
    }
  }

  //#region Private Methods
  private getCommunity(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    communityInfo: any
  ): CommunityModel {
    try {
      return {
        id: communityInfo.id,
        name: communityInfo.name,
        link: communityInfo.link,
        description: communityInfo.description,
        order: communityInfo.order,
      };
    } catch (e) {
      console.log(
        'ERROR (CommunityService - getCommunity): Unable to create a CommunityModel using the info parameter -> ' +
          e
      );
    }
  }

  private getSpecieInfo(specieInfo): CommunitySpecieModel {
    return {
      id: specieInfo.id,
      name: specieInfo.name,
    };
  }

  private getSubcommunityInfo(subcommunityInfo): CommunitySubCommunityModel {
    return {
      id: subcommunityInfo.id,
      order: subcommunityInfo.order,
      predominantSpecies: subcommunityInfo.predominant_species,
      indicatorSpecies: subcommunityInfo.indicator_species,
    };
  }
  //#endregion
}
