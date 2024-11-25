import { TNpcRelationship } from './npc';
import { TPlayer } from './player';

export type TRoomType =
  | 'bedroom'
  | 'dining_room'
  | 'parlor'
  | 'courtyard'
  | 'kitchen'
  | 'storage'
  | 'arcane_study'
  | 'armory'
  | 'barrack'
  | 'garden'
  | 'library'
  | 'sanctuary'
  | 'smithy'
  | 'storehouse'
  | 'workshop';

export type TRoom = {
  room_type: TRoomType;
  size: 'cramped' | 'roomy' | 'vast';
  hirelings: number[];
  command: string;
  notes: string;
};

export type TBastion = {
  id: number;
  status: 'draft' | 'published' | 'archived';
  name: string;
  npcs: TNpcRelationship[];
  Rooms: TRoom[];
  player: TPlayer;
  campaigns: { campaigns_id: number }[];
  main_image: string;
  items: { Items_id: number }[];
};

export type TBastionRelationship = {
  bastion_id: number;
};
