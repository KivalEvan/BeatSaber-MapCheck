import type { CharacteristicName } from '../../types/beatmap/shared/characteristic.ts';

/** Rename characteristic to human readable. */
export const CharacteristicRename: { readonly [key in CharacteristicName]: string } = {
   Standard: 'Standard',
   NoArrows: 'No Arrows',
   OneSaber: 'One Saber',
   Legacy: 'Legacy',
   '360Degree': '360 Degree',
   '90Degree': '90 Degree',
   Lightshow: 'Lightshow',
   Lawless: 'Lawless',
} as const;

/** Standard characteristic ordering. */
// enum would make sense but typescript enum is cringe and has no type
export const CharacteristicOrder: { readonly [key in CharacteristicName]: number } = {
   Standard: 0,
   NoArrows: 1,
   OneSaber: 2,
   Legacy: 3,
   '360Degree': 4,
   '90Degree': 5,
   Lightshow: 6,
   Lawless: 7,
} as const;
