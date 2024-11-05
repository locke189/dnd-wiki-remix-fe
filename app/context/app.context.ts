import { createContext } from 'react';

interface AppContextProps {
  // Define your context properties here
  selectedCampaignId: number;
  setSelectedCampaignId: (value: number) => void;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);
