import { TBastion } from './bastion';
import { TNpcRelationship } from './npc';
import { TSessionRelationship } from './session';

export type TPlayer = {
  name: string;
  id: number;
  main_image: string;
  campaigns: {
    campaigns_id: number;
  }[];
  gender: string;
  class: string;
  race: string;
  status: string;
  story: string;
  url: string;
  user_created: string;
  user_updated: string;
  date_created: string;
  date_updated: string;
  private_goals: string;
  goals: string;
  user: string;
  age: string;
  Allied_npcs: TNpcRelationship[];
  sessions: TSessionRelationship[];
  bastions: TBastion[];
};

export type TPlayerRelationship = {
  Player_id: number;
};
