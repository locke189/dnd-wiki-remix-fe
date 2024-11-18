import {
  Blend,
  Church,
  Hotel,
  House,
  LandPlot,
  Mountain,
  Sailboat,
  Sparkles,
  Swords,
  TreePalm,
  UtensilsCrossed,
  Map,
} from 'lucide-react';
import { TLocation, TLocationType } from '~/types/location';

export const mapLocationTypeToIcon = (type: TLocationType) => {
  switch (type) {
    case 'plane':
      return <Sparkles />;
    case 'realm':
      return <Blend />;
    case 'island':
      return <TreePalm />;
    case 'region':
      return <LandPlot />;
    case 'ship':
      return <Sailboat />;
    case 'city':
      return <Hotel />;
    case 'town':
      return <House />;
    case 'inn_tavern_shop':
      return <UtensilsCrossed />;
    case 'temple_shrine':
      return <Church />;
    case 'dungeon_cave':
      return <Swords />;
    case 'place_road':
      return <Mountain />;
    default:
      return <Map />;
  }
};

export function getLocationTypeData(type: string) {
  switch (type) {
    case 'plane':
      return { icon: <Sparkles />, name: 'Plane' };
    case 'realm':
      return { icon: <Blend />, name: 'Realm' };
    case 'island':
      return { icon: <TreePalm />, name: 'Island' };
    case 'region':
      return { icon: <LandPlot />, name: 'Region' };
    case 'ship':
      return { icon: <Sailboat />, name: 'Ship' };
    case 'city':
      return { icon: <Hotel />, name: 'City' };
    case 'town':
      return { icon: <House />, name: 'Town' };
    case 'inn_tavern_shop':
      return { icon: <UtensilsCrossed />, name: 'Inn/Tavern/Shop' };
    case 'temple_shrine':
      return { icon: <Church />, name: 'Temple/Shrine' };
    case 'dungeon_cave':
      return { icon: <Swords />, name: 'Dungeon/Cave' };
    case 'place_road':
      return { icon: <Mountain />, name: 'Place/Road' };
    default:
      return { icon: <Map />, name: 'Map' };
  }
}

export const getLocationOptions = (locations: TLocation[]) => {
  return locations.map((location: TLocation) => ({
    value: location.id,
    label: `${location.name} - ${getLocationTypeData(location.type).name}`,
  }));
};
