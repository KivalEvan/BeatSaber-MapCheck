import type { IColor } from '../../../colors.ts';
import type { IContributor } from '../../shared/custom/contributor.ts';

export interface ICustomInfo {
   contributors?: IContributor[];
   customEnvironment?: string;
   customEnvironmentHash?: string;
}

export interface ICustomInfoDifficulty {
   offset?: number;
   oldOffset?: number;
   chromaToggle?: string;
   customColors?: boolean;
   difficultyLabel?: string;
   colorLeft?: Omit<IColor, 'a'>;
   colorRight?: Omit<IColor, 'a'>;
   envColorLeft?: Omit<IColor, 'a'>;
   envColorRight?: Omit<IColor, 'a'>;
   obstacleColor?: Omit<IColor, 'a'>;
}
