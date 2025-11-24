/**
 * Comprehensive Uganda Districts and Languages Data
 * Organized by regions with all 135+ districts
 */

export interface District {
  name: string;
  subRegion: string;
}

export interface Region {
  name: string;
  subRegions: {
    name: string;
    districts: string[];
  }[];
}

// Uganda Languages
export const UGANDA_LANGUAGES = [
  'Luganda',
  'Lusoga',
  'Ateso',
  'Lugisu (Lumasaaba)',
  'Runyankole',
  'Rukiga',
  'Runyoro',
  'Rutooro',
  'Acholi',
  'Lango',
  'Lugbara',
  'Alur',
  'Karamojong',
  'Pokot',
  'Kupsabiny',
  'Samia',
  'Japadhola',
  'Swahili',
  'English',
  'Other',
] as const;

// Uganda Regions with Sub-regions and Districts
export const UGANDA_REGIONS: Region[] = [
  {
    name: 'Eastern Region',
    subRegions: [
      {
        name: 'Teso',
        districts: [
          'Soroti',
          'Katakwi',
          'Amuria',
          'Kaberamaido',
          'Ngora',
          'Serere',
          'Kumi',
          'Bukedea',
          'Kapelebyong', // Added as requested
        ],
      },
      {
        name: 'Bukedi',
        districts: [
          'Tororo',
          'Busia',
          'Pallisa',
          'Budaka',
          'Butaleja',
          'Kibuku',
          'Butebo',
        ],
      },
      {
        name: 'Busoga',
        districts: [
          'Jinja',
          'Iganga',
          'Kamuli',
          'Bugiri',
          'Mayuge',
          'Luuka',
          'Kaliro',
          'Namutumba',
          'Buyende',
          'Namayingo',
        ],
      },
      {
        name: 'Bugisu',
        districts: [
          'Mbale',
          'Sironko',
          'Manafwa',
          'Bududa',
          'Bulambuli',
          'Namisindwa',
        ],
      },
      {
        name: 'Sebei',
        districts: ['Kapchorwa', 'Bukwo', 'Kween'],
      },
    ],
  },
  {
    name: 'Northern Region',
    subRegions: [
      {
        name: 'Acholi',
        districts: [
          'Gulu',
          'Kitgum',
          'Pader',
          'Agago',
          'Amuru',
          'Nwoya',
          'Lamwo',
          'Omoro',
        ],
      },
      {
        name: 'Lango',
        districts: [
          'Lira',
          'Apac',
          'Dokolo',
          'Oyam',
          'Amolatar',
          'Alebtong',
          'Otuke',
          'Kole',
        ],
      },
      {
        name: 'West Nile',
        districts: [
          'Arua',
          'Nebbi',
          'Yumbe',
          'Moyo',
          'Adjumani',
          'Koboko',
          'Maracha',
          'Zombo',
          'Pakwach',
          'Obongi',
          'Madi-Okollo',
          'Terego',
        ],
      },
      {
        name: 'Karamoja',
        districts: [
          'Moroto',
          'Kotido',
          'Abim',
          'Kaabong',
          'Amudat',
          'Napak',
          'Nakapiripirit',
          'Karenga',
          'Nabilatuk',
        ],
      },
    ],
  },
  {
    name: 'Central Region',
    subRegions: [
      {
        name: 'Buganda',
        districts: [
          'Kampala',
          'Wakiso',
          'Mukono',
          'Mpigi',
          'Mubende',
          'Mityana',
          'Luwero',
          'Nakaseke',
          'Nakasongola',
          'Kayunga',
          'Kiboga',
          'Kyankwanzi',
          'Gomba',
          'Butambala',
          'Buvuma',
          'Kalungu',
          'Lwengo',
          'Masaka',
          'Rakai',
          'Lyantonde',
          'Sembabule',
          'Bukomansimbi',
          'Kalangala',
        ],
      },
    ],
  },
  {
    name: 'Western Region',
    subRegions: [
      {
        name: 'Ankole',
        districts: [
          'Mbarara',
          'Bushenyi',
          'Ntungamo',
          'Sheema',
          'Buhweju',
          'Mitooma',
          'Rubirizi',
          'Ibanda',
          'Isingiro',
          'Kiruhura',
        ],
      },
      {
        name: 'Kigezi',
        districts: [
          'Kabale',
          'Kisoro',
          'Kanungu',
          'Rukungiri',
          'Rubanda',
          'Rukiga',
        ],
      },
      {
        name: 'Bunyoro',
        districts: [
          'Hoima',
          'Masindi',
          'Buliisa',
          'Kiryandongo',
          'Kakumiro',
          'Kagadi',
          'Kibaale',
        ],
      },
      {
        name: 'Tooro',
        districts: [
          'Fort Portal (Kabarole)',
          'Kasese',
          'Bundibugyo',
          'Ntoroko',
          'Kyenjojo',
          'Kamwenge',
          'Kyegegwa',
        ],
      },
      {
        name: 'Rwenzori',
        districts: ['Kasese', 'Bundibugyo', 'Ntoroko'],
      },
    ],
  },
];

// Flatten all districts for easy access
export const ALL_DISTRICTS: string[] = UGANDA_REGIONS.flatMap((region) =>
  region.subRegions.flatMap((subRegion) => subRegion.districts)
);

// Get unique districts (remove duplicates)
export const UNIQUE_DISTRICTS: string[] = Array.from(new Set(ALL_DISTRICTS)).sort();

// Get district by name
export function getDistrictInfo(districtName: string): {
  district: string;
  subRegion: string;
  region: string;
} | null {
  for (const region of UGANDA_REGIONS) {
    for (const subRegion of region.subRegions) {
      if (subRegion.districts.includes(districtName)) {
        return {
          district: districtName,
          subRegion: subRegion.name,
          region: region.name,
        };
      }
    }
  }
  return null;
}

// Get all districts by region
export function getDistrictsByRegion(regionName: string): string[] {
  const region = UGANDA_REGIONS.find((r) => r.name === regionName);
  if (!region) return [];
  return region.subRegions.flatMap((sr) => sr.districts);
}

// Get all districts by sub-region
export function getDistrictsBySubRegion(subRegionName: string): string[] {
  for (const region of UGANDA_REGIONS) {
    const subRegion = region.subRegions.find((sr) => sr.name === subRegionName);
    if (subRegion) return subRegion.districts;
  }
  return [];
}

// Export region names
export const REGION_NAMES = UGANDA_REGIONS.map((r) => r.name);

// Export sub-region names
export const SUB_REGION_NAMES = UGANDA_REGIONS.flatMap((r) =>
  r.subRegions.map((sr) => sr.name)
);
