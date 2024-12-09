export type TCampaign = {
  description: string;
  id: number;
  image: string | null;
  locations: string[];
  master_notes: string | null;
  name: string;
  players: string[];
  quests: string[];
  sessions: string[];
  status: string;
  Items: string[];
};

export type TCampaignRelationships = {
  campaigns_id: number;
};
