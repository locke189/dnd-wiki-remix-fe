import { createContext } from 'react';
import { TBastion } from '~/types/bastion';
import { TCampaign } from '~/types/campaigns';
import { TImage } from '~/types/images';
import { TItem } from '~/types/item';
import { TLocation } from '~/types/location';
import { TNpc } from '~/types/npc';
import { TParty } from '~/types/party';
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
  bastions: TBastion[];
  parties: TParty[];
  items: TItem[];
}

export const AppContext = createContext<AppContextProps>({
  // Provide default values for your context properties here
  selectedCampaignId: 0,
  setSelectedCampaignId: () => {},
  npcs: [],
  sessions: [],
  players: [],
  campaigns: [],
  locations: [],
  images: [],
  bastions: [],
  parties: [],
  items: [],
});
