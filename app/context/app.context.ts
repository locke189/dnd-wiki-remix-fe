import { createContext } from 'react';
import { TCampaign } from '~/types/campaigns';
import { TImage } from '~/types/images';
import { TLocation } from '~/types/location';
import { TNpc } from '~/types/npc';
import { TPlayer } from '~/types/player';
import { TSession } from '~/types/session';

interface AppContextProps {
  // Define your context properties here
  selectedCampaignId: number;
  setSelectedCampaignId: (value: number) => void;
  npcs: TNpc[];
  sessions: TSession[];
  players: TPlayer[];
  campaigns: TCampaign[];
  locations: TLocation[];
  images: TImage[];
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);
