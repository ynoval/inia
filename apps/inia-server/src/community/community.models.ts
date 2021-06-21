export class CommunityModel {
  id: string;
  name: string;
  link: string;
  description: string;
  order: string;
}

export class CommunitySpecieModel {
  id: string;
  name: string;
}

export class CommunitySubCommunityModel {
  id: string;
  order: string;
  predominantSpecies: CommunitySpecieModel[];
  indicatorSpecies: CommunitySpecieModel[];
}
