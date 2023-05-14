// TODO: Move to project workspace
export const MAP_PATH = {
  APAR: 'projects/pastizalesrou/assets/apar/apar-16',
  APAR_HISTORIC: 'projects/pastizalesrou/assets/apar/apar-16_Historica', // TODO: FIX
  APAR_HISTORIC_AVERAGE:
    'projects/pastizalesrou/assets/apar/apar-16_PromedioHistorico', // TODO: FIX
  APAR_HISTORIC_AVERAGE_BY_YEAR:
    'projects/pastizalesrou/assets/apar/apar_PromedioAnual', // TODO: FIX
  PPNA: 'projects/pastizalesrou/assets/ppna/ppna-16',
  PPNA_HISTORIC: 'projects/pastizalesrou/assets/ppna/ppna-16_Historica',
  PPNA_HISTORIC_AVERAGE:
    'projects/pastizalesrou/assets/ppna/ppna-16_PromedioHistorico',
  PPNA_HISTORIC_AVERAGE_BY_YEAR:
    'projects/pastizalesrou/assets/ppna/ppna_PromedioAnual',

  ET: 'projects/pastizalesrou/assets/et/et-8',
  ET_HISTORIC: 'projects/pastizalesrou/assets/et/et-8_Historica',
  ET_HISTORIC_AVERAGE:
    'projects/pastizalesrou/assets/et/et-8_PromedioHistorico',
  ET_HISTORIC_AVERAGE_BY_YEAR:
    'projects/pastizalesrou/assets/et/et_PromedioAnual',

  PPT: 'users/bagnato/PronosticoForrajero/PPT2003-2020', // TODO: FIX and MOVE
  T: 'users/bagnato/PronosticoForrajero/Tair16_2001-2020', // TODO: FIX and MOVE
  RH: 'projects/pastizalesrou/assets/rh/rh-16_Historica', // TODO: FIX remove Historica prefix when current year data is available
  RH_HISTORIC: 'projects/pastizalesrou/assets/rh/rh-16_Historica',
  RH_HISTORIC_AVERAGE:
    'projects/pastizalesrou/assets/rh/rh-16_PromedioHistorico',
  RH_HISTORIC_AVERAGE_BY_YEAR:
    'projects/pastizalesrou/assets/rh/rh_PromedioAnual',
  RHProp: 'projects/pastizalesrou/assets/rhProp/rhProp-16_Historica',
  RHProp_HISTORIC: 'projects/pastizalesrou/assets/rhProp/rhProp-16_Historica',
  RHProp_HISTORIC_AVERAGE:
    'projects/pastizalesrou/assets/rhProp/rhProp-16_PromedioHistorico',
  RHProp_HISTORIC_AVERAGE_BY_YEAR:
    'projects/pastizalesrou/assets/rhProp/rhProp_PromedioAnual',

  IOSE: 'projects/pastizalesrou/assets/iose/iose_Historica',

  //TODO: Move to pastizalesROU assets and filter to ROU?
  Mapbiomas:
    'projects/MapBiomas_Pampa/public/collection2/mapbiomas_pampa_collection2_integration_v1',

  CPUr: 'users/bagnato/PronosticoForrajero/ComunidadesDePastizal/PastizalesUruguay_moda',
  ROU: 'users/bagnato/LimiteOficial-ROU',

  // Comunidades de pastizales
  // C-I
  PrB: 'users/bagnato/PronosticoForrajero/ComunidadesDePastizal/PastizalesRalosBasalto', // TODO: Move and Rename
  // C-II
  Pr: 'users/bagnato/PronosticoForrajero/ComunidadesDePastizal/PastizalesRalos', // Move and Rename
  //C-III
  PdB: 'users/bagnato/PronosticoForrajero/ComunidadesDePastizal/PastizalesDensosBasalto', // TODO: Move and Rename
  // C-IV
  Pd: 'users/bagnato/PronosticoForrajero/ComunidadesDePastizal/PastizalesDensos', // TODO: Move and Rename
  // C-VI (No a really community)
  PdE: 'users/bagnato/PronosticoForrajero/ComunidadesDePastizal/PastizalesDelEste', // TODO: Move and Rename

  //Seccionales policiales
  SP: 'projects/gee-inia/assets/Seccionales_Policiales',

  // Cuencas
  C_I: 'projects/pastizalesrou/assets/cuencas/Cuencas_G1',
  C_II: 'projects/pastizalesrou/assets/cuencas/Cuencas_G2',
  C_III: 'projects/pastizalesrou/assets/cuencas/Cuencas_G3',
  C_IV: 'projects/pastizalesrou/assets/cuencas/Cuencas_G4',
  C_V: 'projects/pastizalesrou/assets/cuencas/Cuencas_G5',

  //Padrones
  // TODO: FIX when all padrones are available
  PADRONES: 'projects/pastizalesrou/assets/padrones/padrones_colonia',

  //OLD
  // ET: 'users/bagnato/PronosticoForrajero/ET/ET2003-2020',
  // PPT: 'users/bagnato/PronosticoForrajero/GPM16_2001-2020',
  //  PPNA: 'users/bagnato/PronosticoForrajero/PPNA-16_2001-2020_1', //OLD
  // PPNA: 'users/bagnato/PronosticoForrajero/PPNA-16_SerieHistorica',
  // PPNA: 'users/bagnato/PronosticoForrajero/PPNA-16_SerieHistorica_2022-d16',
  // PPNA: 'users/bagnato/PronosticoForrajero/PPNA-16_SerieHistorica_2022-d113',
  // PPNA: 'users/bagnato/PronosticoForrajero/PPNA-16_SerieHistorica_2022-d257',
  //PPNA_CURRENT_YEAR: 'users/bagnato/PronosticoForrajero/PPNA-16_2022_doy1',
  // CPUr: 'users/bagnato/PronosticoForrajero/ComunidadesDePastizal/PastizalesUruguay',
  // CPUr: 'users/bagnato/PronosticoForrajero/ComunidadesDePastizal/PastizalesUruguay_moda',
  // ROU: 'users/bagnato/LimiteOficial-ROU',
};

export const VISUALIZATION_PARAMS = {
  ET: {
    opacity: 1,
    bands: ['b2023-33'],
    max: 80,
    palette: ['ffffff', '9dfcf7', '3387ff', '0256bd', '0a0561', '000000'],
  },
  PPT: {
    opacity: 1,
    bands: ['b2020-12-21'],
    max: 40,
    palette: ['ffffff', 'eac107', 'e47200', 'd42e00', 'a52828'],
  },
  T: {
    bands: ['b2020-353'],
    max: 25.18325027284169,
    min: 20.892060261680967,
    opacity: 1,
    palette: ['0007b3', '5027ff', '9889c7', 'f68893', 'd02e2e', 'b30000'],
  },
  APAR: {
    opacity: 1,
    bands: ['b2023-3'],
    max: 600,
    palette: ['86622e', 'dc7d0b', 'f8d911', 'd2ff11', '709426', '38841e'],
  },
  PPNA: {
    opacity: 1,
    bands: ['b2023-33'],
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
  RH: {
    opacity: 1,
    bands: ['b2022-353'],
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
  IOSE: {
    min: 0,
    max: 1,
    bands: ['b2021'], // Jul 2021 -- Jun 2022
  },
  Mapbiomas: {
    min: 0,
    max: 1,
    bands: ['classification_2021'],
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
  PrB: {
    opacity: 1,
    min: 0,
    max: 1,
    palette: ['ffe225'],
  },
  Pr: {
    opacity: 1,
    min: 0,
    max: 1,
    palette: ['6e9916'],
  },
  PdB: {
    opacity: 1,
    min: 0,
    max: 1,
    palette: ['f26d00'],
  },
  Pd: {
    opacity: 1,
    min: 0,
    max: 1,
    palette: ['e8b60e'],
  },
  PE: {
    opacity: 1,
    min: 0,
    max: 1,
    palette: ['724800'],
  },
  SP: {
    opacity: 0.1,
    max: 126,
    palette: ['ffffff', 'eeeeee'],
  },
  C_I: {
    opacity: 0.1,
    max: 126,
    palette: ['ffffff', 'eeeeee'],
  },
  C_II: {
    opacity: 0.1,
    max: 126,
    palette: ['ffffff', 'eeeeee'],
  },
  C_III: {
    opacity: 0.1,
    max: 126,
    palette: ['ffffff', 'eeeeee'],
  },
  C_IV: {
    opacity: 0.1,
    max: 126,
    palette: ['ffffff', 'eeeeee'],
  },
  C_V: {
    opacity: 0.1,
    max: 126,
    palette: ['ffffff', 'eeeeee'],
  },
  PADRONES: {
    opacity: 0.1,
    max: 126,
    palette: ['ffffff', 'eeeeee'],
  },
};

export const FILTER_PARAMS = {
  SCALE: 231.65635826395828,
  MAX_PIXELS: 1e12,
};
