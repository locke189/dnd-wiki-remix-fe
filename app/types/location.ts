export type TLocationType =
  | 'plane'
  | 'realm'
  | 'island'
  | 'region'
  | 'ship'
  | 'city'
  | 'town'
  | 'inn_tavern_shop'
  | 'temple_shrine'
  | 'dungeon_cave'
  | 'place_road';

export type TLocation = {
  id: number;
  name: string;
  type: TLocationType;
  main_image: string;
  description: string;
  master_notes: string;
  parent_location: number;
  locations: TLocation[];
  campaigns: {
    campaigns_id: number;
  }[];
  sessions: {
    sessions_id: number;
  }[];
  Locations: {
    Locations_id: number;
  }[];
};
