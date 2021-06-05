import * as ee from '@google/earthengine';

export type MapType = 'ET' | 'PPT' | 'PPNA' | 'BH' | 'CPUr' | 'ROU' | 'BHr';

export const MAP_PATH = {
  ET: 'users/bagnato/PronosticoForrajero/ET/ET2003-2020',
  PPT: 'users/bagnato/PronosticoForrajero/PPT2003-2020',
  PPNA: 'users/bagnato/PronosticoForrajero/PPNA2003-2020',
  BH: 'users/bagnato/PronosticoForrajero/BH2003-2020',
  CPUr:
    'users/bagnato/PronosticoForrajero/ComunidadesDePastizal/ComunidadesPastizal',
  ROU: 'users/bagnato/LimiteOficial-ROU',
};

export const VISUALIZATION_PARAMS = {
  ET: {
    opacity: 1,
    bands: ['b2020-12-d3'],
    max: 80,
    palette: ['ffffff', '9dfcf7', '3387ff', '0256bd', '0a0561', '000000'],
  },
  PPT: {
    opacity: 1,
    bands: ['b2020-12-21'],
    max: 40,
    palette: ['ffffff', 'eac107', 'e47200', 'd42e00', 'a52828'],
  },
  PPNA: {
    opacity: 1,
    bands: ['b2020-353'],
    max: 600,
    palette: ['86622e', 'dc7d0b', 'f8d911', 'd2ff11', '709426', '38841e'],
  },
  BH: {
    opacity: 1,
    bands: ['b2020-12-21'],
    min: -200,
    max: 150,
    palette: [
      'a70000',
      'e21818',
      'ff8479',
      'ffffff',
      '6bbdff',
      '4861ff',
      '00069b',
    ],
  },
  CPUr: {
    opacity: 1,
    bands: ['b1'],
    min: 1,
    max: 5,
    palette: ['724800', 'f26d00', 'e8b60e', 'ffe225', '6e9916'],
  },
  ROU: {
    opacity: 0.1,
    max: 126,
    palette: ['ffffff', 'eeeeee'],
  },
  BHr: {
    min: 0,
    max: 60,
  },
};

export class Maps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapInfo: any;
  constructor() {
    this.mapInfo = {
      ET: {
        resource: new ee.Image(MAP_PATH['ET']).divide(3),
        visualiationParams: VISUALIZATION_PARAMS['ET'],
      },
      PPT: {
        resource: new ee.Image(MAP_PATH['PPT']).select(['b.*']),
        visualiationParams: VISUALIZATION_PARAMS['PPT'],
      },
      PPNA: {
        resource: new ee.Image(MAP_PATH['PPNA']).select(['b.*']),
        visualiationParams: VISUALIZATION_PARAMS['PPNA'],
      },
      BH: {
        resource: new ee.Image(MAP_PATH['BH']),
        visualiationParams: VISUALIZATION_PARAMS['BH'],
      },
      CPUr: {
        resource: new ee.Image(MAP_PATH['CPUr']),
        visualiationParams: VISUALIZATION_PARAMS['CPUr'],
      },
      ROU: {
        resource: new ee.FeatureCollection(MAP_PATH['ROU']),
        visualiationParams: VISUALIZATION_PARAMS['ROU'],
      },
      BHr: {
        resource: () => {
          const PPT = Maps['PPT'].resource;
          const ET = Maps['ET'].resource;
          return PPT.subtract(ET);
        },
        visualiationParams: VISUALIZATION_PARAMS['BHr'],
      },
    };
  }
  public getMapInfo(mapTypeId: MapType) {
    return this.mapInfo[mapTypeId];
  }
}
