import { TLocationsRelationship } from './location';
import { TNpcRelationship } from './npc';
import { TPlayerRelationship } from './player';

export type TParty = {
  id: number;
  name: string;
  description: string;
  main_image: string;
  status: string;
  campaigns: {
    campaigns_id: number;
  }[];
  locations: TLocationsRelationship[];
  npcs: TNpcRelationship[];
  players: TPlayerRelationship[];
  master_notes: string;
  favorite: boolean;
};

export type TPartyRelationship = {
  Parties_id: number;
};
