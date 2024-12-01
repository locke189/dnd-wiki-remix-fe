import { TItemRelationship } from './item';
import { TNpcRelationship } from './npc';
import { TPartyRelationship } from './party';
import { TSessionRelationship } from './session';

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
  campaigns: {
    campaigns_id: number;
  }[];
  Npcs: TNpcRelationship[];
  sessions: TSessionRelationship[];
  sub_locations: TLocation[];
  Parties: TPartyRelationship[];
  items: TItemRelationship[];
};

export type TLocationsRelationship = {
  Locations_id: number;
};
