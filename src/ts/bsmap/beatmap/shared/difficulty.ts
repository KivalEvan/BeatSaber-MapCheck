import type { DifficultyName, DifficultyRank } from '../../types/beatmap/shared/difficulty.ts';

/** Difficulty ordering enum. */
export const DifficultyRanking: { [key in DifficultyName]: DifficultyRank } = {
   Easy: 1,
   Normal: 3,
   Hard: 5,
   Expert: 7,
   ExpertPlus: 9,
} as const;

/** Difficulty rename to human readable. */
export const DifficultyRename: { [key in DifficultyName]: string } = {
   Easy: 'Easy',
   Normal: 'Normal',
   Hard: 'Hard',
   Expert: 'Expert',
   ExpertPlus: 'Expert+',
} as const;
