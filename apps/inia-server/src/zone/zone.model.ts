export class ZoneModel {
  id: string;
  name: string;
  order: string;
  type: "polygon" | "marker" | "rectangle";
  visible: boolean;
  coordinates: {lat: number, lng: number}[];
}
