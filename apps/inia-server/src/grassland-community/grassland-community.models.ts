export class GrasslandCommunityModel {
  id: string;
  name: string;
  link: string;
  description: string;
  order: string;
}

export class GrasslandCommunitySpecieModel {
  id: string;
  name: string;
}

export class GrasslandCommunitySubCommunityModel {
  id: string;
  order: string;
  predominantSpecies: GrasslandCommunitySpecieModel[];
  indicatorSpecies: GrasslandCommunitySpecieModel[];
}
