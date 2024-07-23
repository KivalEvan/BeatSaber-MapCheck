import { types } from "bsmap";

export type UIBackgroundColorType = types.DifficultyName | 'none';

export enum UIBackgroundColor {
   'none' = '',
   'ExpertPlus' = 'accordion__label--bg-expertplus',
   'Expert' = 'accordion__label--bg-expert',
   'Hard' = 'accordion__label--bg-hard',
   'Normal' = 'accordion__label--bg-normal',
   'Easy' = 'accordion__label--bg-easy',
}
