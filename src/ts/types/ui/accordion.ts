import * as types from 'bsmap/types';

export type UIBackgroundColorType = types.DifficultyName | 'none';

export enum UIBackgroundColor {
   'none' = '',
   'Expert+' = 'accordion__label--bg-expertplus',
   'ExpertPlus' = 'accordion__label--bg-expertplus',
   'Expert' = 'accordion__label--bg-expert',
   'Hard' = 'accordion__label--bg-hard',
   'Normal' = 'accordion__label--bg-normal',
   'Easy' = 'accordion__label--bg-easy',
}
