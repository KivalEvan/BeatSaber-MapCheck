import { deepCopy } from 'bsmap/utils';
import { default as beatLeader } from './beatLeader';
import { default as beginner } from './beginner';
import { default as custom } from './custom';
import { default as def } from './default';
import { default as scoreSaber } from './scoreSaber';

export const presets = {
   BeatLeader: beatLeader,
   Beginner: beginner,
   Custom: custom,
   Default: def,
   ScoreSaber: scoreSaber,
};
export const original = {
   BeatLeader: deepCopy(beatLeader),
   Beginner: deepCopy(beginner),
   Custom: deepCopy(custom),
   Default: deepCopy(def),
   ScoreSaber: deepCopy(scoreSaber),
};
