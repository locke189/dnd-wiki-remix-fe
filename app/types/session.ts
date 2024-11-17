export type TSession = {
  name: string;
  id: number;
  date?: string;
  recap?: string;
  master_start?: string;
  master_scenes?: string;
  master_secrets?: string;
  campaign: number;
  players: {
    Player_id: number;
  }[];
};
