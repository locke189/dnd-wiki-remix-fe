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

/*
  [
    {
        "id": 1,
        "campaigns_id": 2,
        "Locations_id": 1
    },
    {
        "id": 2,
        "campaigns_id": 1,
        "Locations_id": 1
    }
]

  */

export type TLocation = {
  id: number;
  status: 'draft' | 'published' | 'archived';
  name: string;
  type: TLocationType;
  image: string;
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
