import type { Version } from '../../types/beatmap/shared/version.ts';

/** Internal use, compare beatmap version to another. */
export function compareVersion(version: Version, compareTo: Version): 'old' | 'new' | 'current' {
   const ver = getVersionArray(version);
   const verCompare = getVersionArray(compareTo);
   for (const num in ver) {
      if (ver[num] < verCompare[num]) {
         return 'old';
      }
      if (ver[num] > verCompare[num]) {
         return 'new';
      }
   }
   return 'current';
}

function getVersionArray(version: Version): number[] {
   return version
      .replace('v', '')
      .split('.')
      .map((el) => parseInt(el));
}
