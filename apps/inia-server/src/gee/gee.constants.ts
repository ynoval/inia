//TODO: Move to project workspace
export const MAP_PATH = {
  ET: 'users/bagnato/PronosticoForrajero/ET/ET2003-2020',
  // PPT: 'users/bagnato/PronosticoForrajero/GPM16_2001-2020',
  PPT: 'users/bagnato/PronosticoForrajero/PPT2003-2020',
  T: 'users/bagnato/PronosticoForrajero/Tair16_2001-2020',
  PPNA: 'users/bagnato/PronosticoForrajero/PPNA-16_2001-2020',
  BH: 'users/bagnato/PronosticoForrajero/BH2003-2020',
  CPUr:
    'users/bagnato/PronosticoForrajero/ComunidadesDePastizal/PastizalesUruguay',
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
  T: {
    bands: ['b2020-353'],
    max: 25.18325027284169,
    min: 20.892060261680967,
    opacity: 1,
    palette: ['0007b3', '5027ff', '9889c7', 'f68893', 'd02e2e', 'b30000'],
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
};
