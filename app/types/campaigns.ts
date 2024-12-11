import { TBastionRelationship } from './bastion';
import { TItemRelationship } from './item';
import { TLocationsRelationship } from './location';
import { TNpcRelationship } from './npc';
import { TPartyRelationship } from './party';
import { TPlayerRelationship } from './player';
import { TSessionRelationship } from './session';

export type TCampaignDate = {
  month: number;
  year: number;
  date: number;
  type: 'harptos';
};

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
  date: TCampaignDate;
  start_date: TCampaignDate;
};

export type TCampaignRelationships = {
  campaigns_id: number;
};
