export type DifficultyName = 'Easy' | 'Normal' | 'Hard' | 'Expert' | 'ExpertPlus';

/** Difficulty rename to human readable. */
export enum DifficultyRename {
    'Easy' = 'Easy',
    'Normal' = 'Normal',
    'Hard' = 'Hard',
    'Expert' = 'Expert',
    'ExpertPlus' = 'Expert+',
}

/** Difficulty ordering enum. */
export enum DifficultyRank {
    'Easy' = 1,
    'Normal' = 3,
    'Hard' = 5,
    'Expert' = 7,
    'ExpertPlus' = 9,
}
