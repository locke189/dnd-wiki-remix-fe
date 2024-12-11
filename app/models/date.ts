//custom DnD date model

export const DateModel = {
  harptos: [
    {
      id: 1,
      name: 'Hammer',
      days: 31,
      season: 'Winter',
      lastDay: 'Midwinter',
    },
    {
      id: 2,
      name: 'Alturiak',
      days: 30,
      season: 'Winter',
    },
    {
      id: 3,
      name: 'Ches',
      days: 30,
      season: 'Spring',
    },
    {
      id: 4,
      name: 'Tarsakh',
      days: 31,
      season: 'Spring',
      lastDay: 'Greengrass',
    },
    {
      id: 5,
      name: 'Mirtul',
      days: 30,
      season: 'Spring',
    },
    {
      id: 6,
      name: 'Kythorn',
      days: 30,
      season: 'Summer',
    },
    {
      id: 7,
      name: 'Flamerule',
      days: 31,
      season: 'Summer',
      lastDay: 'Midsummer',
    },
    {
      id: 8,
      name: 'Eleasis',
      days: 30,
      season: 'Summer',
    },
    {
      id: 9,
      name: 'Eleint',
      days: 31,
      season: 'Autumn',
      lastDay: 'Highharvestide',
    },
    {
      id: 10,
      name: 'Marpenoth',
      days: 30,
      season: 'Autumn',
    },
    {
      id: 11,
      name: 'Uktar',
      days: 31,
      season: 'Autumn',
      lastDay: 'The Feast of the Moon',
    },
    {
      id: 12,
      name: 'Nightal',
      days: 30,
      season: 'Winter',
    },
  ],
};

export const YearModel = {
  harptos: [
    {
      year: 1578,
      suffix: 'DR',
      name: 'Year of the Steadfast Patrol',
    },
    {
      year: 1579,
      suffix: 'DR',
      name: 'Year of the Underking',
    },
    {
      year: 1580,
      suffix: 'DR',
      name: `Year of the Widow's Tears`,
    },
  ],
};

export const DEFAULT_DATE = {
  month: 1,
  year: 1578,
  date: 1,
  type: 'harptos',
};

export const getHarptosDate = (mm: number, dd: number, yyyy: number) => {
  const month = DateModel.harptos.find((m) => m.id === mm);
  const year = YearModel.harptos.find((y) => y.year === yyyy);
  return `${dd !== 31 ? month?.name : ''} ${dd === 31 ? month?.lastDay : dd}, ${
    year?.name
  } ${year?.suffix}`;
};

export const getHarptosMonth = (mm: number) => {
  const month = DateModel.harptos.find((m) => m.id === mm);
  return month;
};

export const getHarptosYear = (yyyy: number) => {
  const year = YearModel.harptos.find((y) => y.year === yyyy);
  return year;
};
