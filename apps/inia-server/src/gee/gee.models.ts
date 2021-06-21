import * as ee from '@google/earthengine';
import { CommunityService } from '../community/community.service';
import { MAP_PATH, VISUALIZATION_PARAMS } from './gee.constants';

export type VisualizationParamsType = {
  opacity?: number;
  min?: number;
  max?: number;
  bands?: string[];
  palette?: string[];
};

export type MapType =
  | 'ET'
  | 'PPT'
  | 'T'
  | 'PPNA'
  | 'BH'
  | 'CPUr'
  | 'ROU'
  | 'BHr'
  | 'PrB'
  | 'PdB'
  | 'PE'
  | 'Pd'
  | 'Pr';

export type CommunityInfo = {
  id: string;
  order: string;
};
export class MapModel {
  mapType: MapType;
  mapId: string;
  urlTemplate: string;
  layerLabel?: string;
  layerDescription?: string;
  order?: string;
  communityInfo?: CommunityInfo;
}

export class Maps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapInfo: any;
  constructor(private communityService: CommunityService) {
    this.mapInfo = {
      ET: {
        getResource: () => new ee.Image(MAP_PATH['ET']).divide(3),
        visualiationParams: VISUALIZATION_PARAMS['ET'],
        layerLabel: 'ET',
        layerDescription: 'Evapotranspiración',
      },
      PPT: {
        getResource: () => new ee.Image(MAP_PATH['PPT']).select(['b.*']),
        visualiationParams: VISUALIZATION_PARAMS['PPT'],
        layerLabel: 'PPT',
        layerDescription: 'Precipitación',
      },
      T: {
        getResource: () => new ee.Image(MAP_PATH['T']).select(['b.*']),
        visualiationParams: VISUALIZATION_PARAMS['T'],
        layerLabel: 'T',
        layerDescription: 'Temperatura',
      },
      PPNA: {
        getResource: () => new ee.Image(MAP_PATH['PPNA']).select(['b.*']),
        visualiationParams: VISUALIZATION_PARAMS['PPNA'],
        layerLabel: 'PPNA',
        layerDescription: 'Productividad',
      },
      BH: {
        getResource: () => new ee.Image(MAP_PATH['BH']),
        visualiationParams: VISUALIZATION_PARAMS['BH'],
        layerLabel: 'BH',
        layerDescription: 'Balance Hidrológico',
      },
      CPUr: {
        getResource: () => new ee.Image(MAP_PATH['CPUr']),
        visualiationParams: VISUALIZATION_PARAMS['CPUr'],
        layerLabel: 'CPUr',
        layerDescription: 'Comunidades de Pastizales',
      },
      ROU: {
        getResource: () => new ee.FeatureCollection(MAP_PATH['ROU']),
        visualiationParams: VISUALIZATION_PARAMS['ROU'],
        layerLabel: 'ROU',
        layerDescription: 'Contorno del Uruguay',
      },
      BHr: {
        getResource: () => {
          const PPT = this.mapInfo['PPT'].getResource();
          const ET = this.mapInfo['ET'].getResource();
          return PPT.subtract(ET);
        },
        visualiationParams: VISUALIZATION_PARAMS['BHr'],
        layerLabel: 'BHr',
        layerDescription: 'Balance Hidrológico resultante',
      },
      PrB: {
        getResource: () => {
          const CPUr = this.mapInfo['CPUr'].getResource();
          return CPUr.eq(4).selfMask();
        },
        visualiationParams: VISUALIZATION_PARAMS['PrB'],
        layerLabel: 'COMUNIDAD I',
        layerDescription: 'Pastizales Ralos de la región Basáltica',
        communityOrder: 'I',
      },
      Pr: {
        getResource: () => {
          const CPUr = this.mapInfo['CPUr'].getResource();
          return CPUr.eq(5).selfMask();
        },
        visualiationParams: VISUALIZATION_PARAMS['Pr'],
        layerLabel: 'COMUNIDAD II',
        layerDescription: 'Pastizales Ralos',
        communityOrder: 'II',
      },
      PdB: {
        getResource: () => {
          const CPUr = this.mapInfo['CPUr'].getResource();
          return CPUr.eq(2).selfMask();
        },
        visualiationParams: VISUALIZATION_PARAMS['PdB'],
        layerLabel: 'COMUNIDAD III',
        layerDescription: 'Pastizales Densos de la región Basáltica',
        communityOrder: 'III',
      },
      Pd: {
        getResource: () => {
          const CPUr = this.mapInfo['CPUr'].getResource();
          return CPUr.eq(3).selfMask();
        },
        visualiationParams: VISUALIZATION_PARAMS['Pd'],
        layerLabel: 'COMUNIDAD IV',
        layerDescription: 'Pastizales Densos',
        communityOrder: 'IV',
      },
      PE: {
        getResource: () => {
          const CPUr = this.mapInfo['CPUr'].getResource();
          return CPUr.eq(1).selfMask();
        },
        visualiationParams: VISUALIZATION_PARAMS['PE'],
        layerLabel: 'COMUNIDAD V',
        layerDescription: 'Pastizales del Este',
        communityOrder: 'V',
      },
    };
  }
  public getMapInfo(mapTypeId: MapType) {
    return this.mapInfo[mapTypeId];
  }
}
