export type TCampaign = {
  description: string;
  id: string;
  image: string | null;
  locations: string[];
  master_notes: string | null;
  name: string;
  players: string[];
  quests: string[];
  sessions: string[];
  status: string;
};
