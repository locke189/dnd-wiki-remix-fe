import { TBastionRelationship } from './bastion';
import { TItemRelationship } from './item';
import { TLocationsRelationship } from './location';
import { TNpc, TNpcRelationship } from './npc';
import { TPartyRelationship } from './party';
import { TPlayerRelationship } from './player';
import { TSessionRelationship } from './session';

export type TCampaign = {
  description: string;
  id: number;
  image: string | null;
  master_notes: string | null;
  name: string;
  sessions: TSessionRelationship[];
  players: TPlayerRelationship[];
  npcs: TNpcRelationship[];
  locations: TLocationsRelationship[];
  parties: TPartyRelationship[];
  bastions: TBastionRelationship[];
  Items: TItemRelationship[];
  quests: string[];
  status: string;
};

export type TCampaignRelationships = {
  campaigns_id: number;
};
