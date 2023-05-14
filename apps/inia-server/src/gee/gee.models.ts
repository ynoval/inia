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
  | 'RH'
  | 'RHProp'
  | 'PPT'
  | 'T'
  | 'APAR'
  | 'PPNA'
  | 'BH'
  | 'CPUr'
  | 'ROU'
  | 'BHr'
  | 'PrB'
  | 'PdB'
  | 'PE'
  | 'Pd'
  | 'Pr'
  | 'SP'
  | 'C_I'
  | 'C_II'
  | 'C_III'
  | 'C_IV'
  | 'C_V'
  | 'PADRONES';

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
  constructor() {
    this.mapInfo = {
      ET: {
        getResource: () => new ee.Image(MAP_PATH['ET']).select(['b.*']),
        visualizationParams: VISUALIZATION_PARAMS['ET'],
        layerLabel: 'ET',
        layerDescription: 'Evapotranspiración',
      },
      PPT: {
        getResource: () => new ee.Image(MAP_PATH['PPT']).select(['b.*']),
        visualizationParams: VISUALIZATION_PARAMS['PPT'],
        layerLabel: 'PPT',
        layerDescription: 'Precipitación',
      },
      T: {
        getResource: () => new ee.Image(MAP_PATH['T']).select(['b.*']),
        visualizationParams: VISUALIZATION_PARAMS['T'],
        layerLabel: 'T',
        layerDescription: 'Temperatura',
      },
      PPNA: {
        getResource: () => new ee.Image(MAP_PATH['PPNA']).select(['b.*']),
        // getData: () =>
        //   new ee.Image(MAP_PATH['PPNA']).select(['b.*']).reduceRegion({
        //     reducer: ee.Reducer.mean(),
        //     geometry: new ee.Geometry.Point([
        //       -55.59084933038717, -33.57749649064163,
        //     ]),
        //     scale: 231.65635826395828,
        //     maxPixels: 1e12,
        //   }),
        visualizationParams: VISUALIZATION_PARAMS['PPNA'],
        layerLabel: 'PPNA',
        layerDescription: 'Productividad',
      },
      APAR: {
        getResource: () => new ee.Image(MAP_PATH['APAR']).select(['b.*']),
        // getData: () =>
        //   new ee.Image(MAP_PATH['APAR']).select(['b.*']).reduceRegion({
        //     reducer: ee.Reducer.mean(),
        //     geometry: new ee.Geometry.Point([
        //       -55.59084933038717, -33.57749649064163,
        //     ]),
        //     scale: 231.65635826395828,
        //     maxPixels: 1e12,
        //   }),
        visualizationParams: VISUALIZATION_PARAMS['APAR'],
        layerLabel: 'APAR',
        layerDescription: '',
      },
      RH: {
        getResource: () => new ee.Image(MAP_PATH['RH']),
        visualizationParams: VISUALIZATION_PARAMS['RH'],
        layerLabel: 'RH',
        layerDescription: 'Rendimiento Hidrológico',
      },
      BH: {
        getResource: () => new ee.Image(MAP_PATH['BH']),
        visualizationParams: VISUALIZATION_PARAMS['BH'],
        layerLabel: 'BH',
        layerDescription: 'Balance Hidrológico',
      },
      IOSE: {
        getResource: () => new ee.Image(MAP_PATH['IOSE']),
        visualizationParams: VISUALIZATION_PARAMS['IOSE'],
        layerLabel: 'IOSE',
        layerDescription: 'IOSE',
      },
      Mapbiomas: {
        getResource: () => new ee.Image(MAP_PATH['Mapbiomas']),
        visualizationParams: VISUALIZATION_PARAMS['Mapbiomas'],
        layerLabel: 'Mapbiomas',
        layerDescription: 'Mapbiomas',
      },
      CPUr: {
        getResource: () => new ee.Image(MAP_PATH['CPUr']),
        visualizationParams: VISUALIZATION_PARAMS['CPUr'],
        layerLabel: 'CPUr',
        layerDescription: 'Comunidades de Pastizales',
      },
      ROU: {
        getResource: () => new ee.FeatureCollection(MAP_PATH['ROU']),
        visualizationParams: VISUALIZATION_PARAMS['ROU'],
        layerLabel: 'ROU',
        layerDescription: 'Contorno del Uruguay',
      },
      BHr: {
        getResource: () => {
          const PPT = this.mapInfo['PPT'].getResource();
          const ET = this.mapInfo['ET'].getResource();
          return PPT.subtract(ET);
        },
        visualizationParams: VISUALIZATION_PARAMS['BHr'],
        layerLabel: 'BHr',
        layerDescription: 'Balance Hidrológico resultante',
      },
      PrB: {
        getResource: () => {
          const CPUr = this.mapInfo['CPUr'].getResource();
          return CPUr.eq(4).selfMask();
        },
        visualizationParams: VISUALIZATION_PARAMS['PrB'],
        layerLabel: 'COMUNIDAD I',
        layerDescription: 'Pastizales Ralos de la región Basáltica',
        communityOrder: 'I',
      },
      Pr: {
        getResource: () => {
          const CPUr = this.mapInfo['CPUr'].getResource();
          return CPUr.eq(5).selfMask();
        },
        visualizationParams: VISUALIZATION_PARAMS['Pr'],
        layerLabel: 'COMUNIDAD II',
        layerDescription: 'Pastizales Ralos',
        communityOrder: 'II',
      },
      PdB: {
        getResource: () => {
          const CPUr = this.mapInfo['CPUr'].getResource();
          return CPUr.eq(2).selfMask();
        },
        visualizationParams: VISUALIZATION_PARAMS['PdB'],
        layerLabel: 'COMUNIDAD III',
        layerDescription: 'Pastizales Densos de la región Basáltica',
        communityOrder: 'III',
      },
      Pd: {
        getResource: () => {
          const CPUr = this.mapInfo['CPUr'].getResource();
          return CPUr.eq(3).selfMask();
        },
        visualizationParams: VISUALIZATION_PARAMS['Pd'],
        layerLabel: 'COMUNIDAD IV',
        layerDescription: 'Pastizales Densos',
        communityOrder: 'IV',
      },
      PE: {
        getResource: () => {
          const CPUr = this.mapInfo['CPUr'].getResource();
          return CPUr.eq(1).selfMask();
        },
        visualizationParams: VISUALIZATION_PARAMS['PE'],
        layerLabel: 'COMUNIDAD VI',
        layerDescription: 'Pastizales del Este',
        communityOrder: 'VI',
      },
      SP: {
        getResource: () => new ee.FeatureCollection(MAP_PATH['SP']),
        visualizationParams: VISUALIZATION_PARAMS['SP'],
        layerLabel: 'SP',
        layerDescription: 'Seccionales policiales del Uruguay',
      },
      C_I: {
        getResource: () => new ee.FeatureCollection(MAP_PATH['C_I']),
        visualizationParams: VISUALIZATION_PARAMS['C_I'],
        layerLabel: 'C_1',
        layerDescription: 'Cuencas grado 1 del Uruguay',
      },
      C_II: {
        getResource: () => new ee.FeatureCollection(MAP_PATH['C_II']),
        visualizationParams: VISUALIZATION_PARAMS['C_II'],
        layerLabel: 'C_2',
        layerDescription: 'Cuencas grado 2 del Uruguay',
      },
      C_III: {
        getResource: () => new ee.FeatureCollection(MAP_PATH['C_III']),
        visualizationParams: VISUALIZATION_PARAMS['C_III'],
        layerLabel: 'C_3',
        layerDescription: 'Cuencas grado 3 del Uruguay',
      },
      C_IV: {
        getResource: () => new ee.FeatureCollection(MAP_PATH['C_IV']),
        visualizationParams: VISUALIZATION_PARAMS['C_IV'],
        layerLabel: 'C_4',
        layerDescription: 'Cuencas grado 4 del Uruguay',
      },
      C_V: {
        getResource: () => new ee.FeatureCollection(MAP_PATH['C_V']),
        visualizationParams: VISUALIZATION_PARAMS['C_V'],
        layerLabel: 'C_5',
        layerDescription: 'Cuencas grado 5 del Uruguay',
      },
      PADRONES: {
        getResource: () => new ee.FeatureCollection(MAP_PATH['PADRONES']),
        visualizationParams: VISUALIZATION_PARAMS['PADRONES'],
        layerLabel: 'Padrones',
        layerDescription: 'Padrones del Uruguay',
      },
    };
  }
  public getMapInfo(mapTypeId: MapType) {
    return this.mapInfo[mapTypeId];
  }
}
