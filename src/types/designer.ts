export type ViewType = 'front' | 'back';

export type ZoneType = 'center' | 'leftChest';

export interface DesignElement {
  id: string;
  type: 'image';
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  rotation: number;
  colors: string[];
  view: ViewType;
  zone: ZoneType;
}

export interface DesignZone {
  id: ZoneType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type TShirtColor = 'red' | 'blue' | 'black' | 'white' | 'gray';

export interface TShirtConfig {
  color: TShirtColor;
  frontZones: DesignZone[];
  backZones: DesignZone[];
}
