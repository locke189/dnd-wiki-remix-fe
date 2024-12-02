export const LAYOUT_PAGE_HEADER_PORTAL_ID = 'layout-page-header-portal';

// Data for dropdowns
export type TOption = {
  value: string;
  label: string;
};

export const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export const raceOptions = [
  { value: 'dwarf', label: 'Dwarf' },
  { value: 'elf', label: 'Elf' },
  { value: 'halfling', label: 'Halfling' },
  { value: 'human', label: 'Human' },
  { value: 'dragonborn', label: 'Dragonborn' },
  { value: 'gnome', label: 'Gnome' },
  { value: 'half-elf', label: 'Half-Elf' },
  { value: 'half-orc', label: 'Half-Orc' },
  { value: 'tiefling', label: 'Tiefling' },
  { value: 'custom', label: 'Custom' },
];

export const statusOptions = [
  { value: 'alive', label: 'Alive' },
  { value: 'dead', label: 'Dead' },
  { value: 'missing', label: 'Missing' },
  { value: 'unknown', label: 'Unknown' },
];

export const jobOptions = [
  { value: 'acolyte', label: 'Acolyte' },
  { value: 'charlatan', label: 'Charlatan' },
  { value: 'criminal', label: 'Criminal' },
  { value: 'entertainer', label: 'Entertainer' },
  { value: 'folk_hero', label: 'Folk Hero' },
  { value: 'guild_artisan', label: 'Guild Artisan' },
  { value: 'hermit', label: 'Hermit' },
  { value: 'noble', label: 'Noble' },
  { value: 'outlander', label: 'Outlander' },
  { value: 'sage', label: 'Sage' },
  { value: 'sailor', label: 'Sailor' },
  { value: 'soldier', label: 'Soldier' },
  { value: 'urchin', label: 'Urchin' },
  { value: 'alchemist', label: 'Alchemist' },
  { value: 'blacksmith', label: 'Blacksmith' },
  { value: 'bounty_hunter', label: 'Bounty Hunter' },
  { value: 'clerk', label: 'Clerk' },
  { value: 'cook', label: 'Cook' },
  { value: 'farmer', label: 'Farmer' },
  { value: 'fisher', label: 'Fisher' },
  { value: 'gladiator', label: 'Gladiator' },
  { value: 'guard', label: 'Guard' },
  { value: 'healer', label: 'Healer' },
  { value: 'hunter', label: 'Hunter' },
  { value: 'innkeeper', label: 'Innkeeper' },
  { value: 'jester', label: 'Jester' },
  { value: 'merchant', label: 'Merchant' },
  { value: 'miner', label: 'Miner' },
  { value: 'monk', label: 'Monk' },
  { value: 'priest', label: 'Priest' },
  { value: 'scholar', label: 'Scholar' },
  { value: 'scout', label: 'Scout' },
  { value: 'spy', label: 'Spy' },
  { value: 'tavern_keeper', label: 'Tavern Keeper' },
  { value: 'trader', label: 'Trader' },
  { value: 'wanderer', label: 'Wanderer' },
  { value: 'weaver', label: 'Weaver' },
  { value: 'custom', label: 'Custom' },
];

export const ageOptions = [
  { value: 'child', label: 'Child' },
  { value: 'young_adult', label: 'Young Adult' },
  { value: 'adult', label: 'Adult' },
  { value: 'middle_aged', label: 'Middle Aged' },
  { value: 'old', label: 'Old' },
  { value: 'ancient', label: 'Ancient' },
  { value: 'unknown', label: 'Unknown' },
];

export const entityCategoryOptions = [
  { value: 'aberration', label: 'Aberration' },
  { value: 'beast', label: 'Beast' },
  { value: 'celestial', label: 'Celestial' },
  { value: 'construct', label: 'Construct' },
  { value: 'dragon', label: 'Dragon' },
  { value: 'elemental', label: 'Elemental' },
  { value: 'fey', label: 'Fey' },
  { value: 'fiend', label: 'Fiend' },
  { value: 'giant', label: 'Giant' },
  { value: 'humanoid', label: 'Humanoid' },
  { value: 'monstrosity', label: 'Monstrosity' },
  { value: 'ooze', label: 'Ooze' },
  { value: 'plant', label: 'Plant' },
  { value: 'undead', label: 'Undead' },
  { value: 'deity', label: 'Deity' },
  { value: 'inanimate', label: 'Inanimate' },
  { value: 'swarm', label: 'Swarm' },
  { value: 'shapechanger', label: 'Shapechanger' },
  { value: 'titan', label: 'Titan' },
  { value: 'custom', label: 'Custom' },
];

export const classOptions = [
  { value: 'barbarian', label: 'Barbarian' },
  { value: 'bard', label: 'Bard' },
  { value: 'cleric', label: 'Cleric' },
  { value: 'druid', label: 'Druid' },
  { value: 'fighter', label: 'Fighter' },
  { value: 'monk', label: 'Monk' },
  { value: 'paladin', label: 'Paladin' },
  { value: 'ranger', label: 'Ranger' },
  { value: 'rogue', label: 'Rogue' },
  { value: 'sorcerer', label: 'Sorcerer' },
  { value: 'warlock', label: 'Warlock' },
  { value: 'wizard', label: 'Wizard' },
  { value: 'custom', label: 'Custom' },
];

export const locationTypeOptions = [
  { value: 'plane', label: 'Plane' },
  { value: 'realm', label: 'Realm' },
  { value: 'island', label: 'Island' },
  { value: 'region', label: 'Region' },
  { value: 'ship', label: 'Ship' },
  { value: 'city', label: 'City' },
  { value: 'town', label: 'Town' },
  { value: 'inn_tavern_shop', label: 'Inn/Tavern/Shop' },
  { value: 'temple_shrine', label: 'Temple/Shrine' },
  { value: 'dungeon_cave', label: 'Dungeon/Cave' },
  { value: 'place_road', label: 'Place/Road' },
];
