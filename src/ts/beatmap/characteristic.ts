export type CharacteristicName =
    | 'Standard'
    | 'NoArrows'
    | 'OneSaber'
    | '360Degree'
    | '90Degree'
    | 'Lightshow'
    | 'Lawless';

export const CharacteristicRename: Record<CharacteristicName, string> = {
    Standard: 'Standard',
    NoArrows: 'No Arrows',
    OneSaber: 'One Saber',
    '360Degree': '360 Degree',
    '90Degree': '90 Degree',
    Lightshow: 'Lightshow',
    Lawless: 'Lawless',
};

// for ordering reason
export enum CharacteristicOrder {
    'Standard',
    'NoArrows',
    'OneSaber',
    '360Degree',
    '90Degree',
    'Lightshow',
    'Lawless',
}
