import { TLocationsRelationship } from './location';
import { TPlayerRelationship } from './player';
import { TSessionRelationship } from './session';

export type TNpc = {
  name: string;
  race: string;
  class: string;
  gender: string;
  status: string;

  age: string;
  id: number;
  main_image: string;
  description: string;
  story: string;
  master_notes: string;
  Locations: TLocationsRelationship[];
  Allied_Players: TPlayerRelationship[];
  campaigns: {
    campaigns_id: number;
  }[];
  sessions: TSessionRelationship[];
};

export type TNpcRelationship = {
  Npc_id: number;
};
