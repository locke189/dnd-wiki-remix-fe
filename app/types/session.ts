import { TContentTodo } from '~/containers/content-todo-list';
import { TLocationsRelationship } from './location';
import { TNpcRelationship } from './npc';
import { TPlayerRelationship } from './player';

export type TSession = {
  name: string;
  id: number;
  date?: string;
  recap?: string;
  master_start?: string;
  master_scenes?: string;
  master_secrets?: string;
  master_notes?: string;
  secret_list?: TContentTodo[];
  scene_list?: TContentTodo[];
  encounters?: TContentTodo[];
  campaign: number;
  players: TPlayerRelationship[];
  Npcs: TNpcRelationship[];
  Locations: TLocationsRelationship[];
};

export type TSessionRelationship = {
  sessions_id: number;
};
