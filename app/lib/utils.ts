import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { classOptions, genderOptions, raceOptions } from '~/models/global';
import { NpcNames } from '~/models/names';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(imageId: string) {
  return `${process.env.DB_DOMAIN}:${process.env.DB_PORT}/assets/${imageId}`;
}

export const randomizeNPC = () => {
  // randomize npc race
  const raceValues = raceOptions.map((option) => option.value);
  const randomRace = raceValues[
    Math.floor(Math.random() * raceValues.length)
  ] as keyof typeof NpcNames;
  // randomize npc gender
  const genderValues = genderOptions.map((option) => option.value);
  const randomGender =
    genderValues[Math.floor(Math.random() * genderValues.length)];
  // randomize npc class
  const classValues = classOptions.map((option) => option.value);
  const randomClass =
    classValues[Math.floor(Math.random() * classValues.length)];
  // randomize npc name
  const firstNames = NpcNames[randomRace]['first_names'][randomGender];
  const lastNames = NpcNames[randomRace]['last_names'];

  const randomFirstName =
    firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName =
    lastNames[Math.floor(Math.random() * lastNames.length)];

  const randomName = `${randomFirstName} ${randomLastName}`;

  // randomize npc descriptions
  const descriptions = NpcNames[randomRace]['descriptions'][randomGender];
  const randomDescription =
    descriptions[Math.floor(Math.random() * descriptions.length)];

  return {
    name: randomName,
    description: randomDescription,
    race: randomRace,
    class: randomClass,
    gender: randomGender,
  };
};
