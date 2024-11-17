export type TNpc = {
  name: string;
  race: string;
  class: string;
  age: number;
  id: number;
  main_image: string;
  description: string;
  story: string;
  campaigns: {
    campaigns_id: number;
  }[];
  sessions: {
    sessions_id: number;
  }[];
};
