import { TContentTodo } from '~/containers/content-todo-list';
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
  favorite: boolean;
  shop_type: string;
  map_image: string;
  dm_map_image: string;
  rooms: TContentTodo[];
};

export type TLocationsRelationship = {
  Locations_id: number;
};
