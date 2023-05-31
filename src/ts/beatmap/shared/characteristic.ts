import { CharacteristicName } from '../../types/beatmap/shared/characteristic';

/** Rename characteristic to human readable. */
export const CharacteristicRename: { readonly [key in CharacteristicName]: string } = {
    Standard: 'Standard',
    NoArrows: 'No Arrows',
    OneSaber: 'One Saber',
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
    '360Degree': 3,
    '90Degree': 4,
    Lightshow: 5,
    Lawless: 6,
} as const;
