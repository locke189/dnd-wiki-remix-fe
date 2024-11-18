import { alchemistItems, alchemistServices } from './items-alchemist';
import { armorItems, armorServices } from './items-armor';
import { generalItems, generalServices } from './items-general';
import { magicItems, magicServices } from './items-magic';
import { miscItems, miscServices } from './items-misc';
import { weaponItems, weaponServices } from './items-weapon';

export const allItems = [
  ...generalItems,
  ...generalServices,
  ...armorItems,
  ...armorServices,
  ...magicItems,
  ...magicServices,
  ...weaponItems,
  ...weaponServices,
  ...alchemistItems,
  ...alchemistServices,
  ...miscItems,
  ...miscServices,
];
