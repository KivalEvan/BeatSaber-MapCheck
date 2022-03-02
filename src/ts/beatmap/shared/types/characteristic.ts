/** Available characteristic from both base game and modded. */
export type CharacteristicName =
    | 'Standard'
    | 'NoArrows'
    | 'OneSaber'
    | '360Degree'
    | '90Degree'
    | 'Lightshow'
    | 'Lawless';

/** Rename characteristic to human readable. */
export enum CharacteristicRename {
    Standard = 'Standard',
    NoArrows = 'No Arrows',
    OneSaber = 'One Saber',
    '360Degree' = '360 Degree',
    '90Degree' = '90 Degree',
    Lightshow = 'Lightshow',
    Lawless = 'Lawless',
}

/** Standard characteristic ordering. */
export enum CharacteristicOrder {
    'Standard',
    'NoArrows',
    'OneSaber',
    '360Degree',
    '90Degree',
    'Lightshow',
    'Lawless',
}
