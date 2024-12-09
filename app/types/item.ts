// {
//   "id": 1,
//   "status": "draft",
//   "name": "Waterskin",
//   "description": "A container for holding water.",
//   "master_notes": null,
//   "image": null,
//   "price": "2 gp",
//   "is_service": false,
//   "type": "general",
//   "rarity": "uncommon",
//   "main_image": "http://galactus.local:8055/assets/null",
//   "sessions": [],
//   "Locations": [],
//   "bastion": [
//       1
//   ]
// }

import { TBastionRelationship } from './bastion';
import { TCampaign, TCampaignRelationships } from './campaigns';
import { TLocationsRelationship } from './location';
import { TNpcRelationship } from './npc';
import { TPlayerRelationship } from './player';
import { TSessionRelationship } from './session';

export type TItem = {
  id: number;
  status: string;
  name: string;
  description: string;
  master_notes: null;
  image: null;
  price: string;
  is_service: boolean;
  type: string;
  rarity: string;
  main_image: string;
  sessions: TSessionRelationship[];
  Locations: TLocationsRelationship[];
  bastion: TBastionRelationship[];
  Npcs: TNpcRelationship[];
  Players: TPlayerRelationship[];
  campaigns: TCampaignRelationships[];
  favorite: boolean;
};

export type TItemRelationship = {
  Items_id: number;
};
