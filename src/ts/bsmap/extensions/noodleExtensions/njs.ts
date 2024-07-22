import { NoteJumpSpeed } from '../../beatmap/helpers/njs.ts';
import type { INEObject } from './types/object.ts';
import { settings } from './settings.ts';
import { TimeProcessor } from '../../beatmap/helpers/timeProcessor.ts';
import type { EasingFunction } from '../../types/easings.ts';
import { lerp, normalize } from '../../utils/math.ts';
import logger from '../../logger.ts';

function tag(name: string): string[] {
   return ['ext', 'NE', 'njs', name];
}

/**
 * Set NJS to object from start to end object.
 *
 * **NOTE:** JD input will override NJS offset.
 */
export function setNjs(
   objects: INEObject[],
   options: {
      timeProc: TimeProcessor;
      njs: NoteJumpSpeed | number;
      offset?: number;
      jd?: number;
   },
): void {
   if (!objects.length) {
      logger.tWarn(tag('setNJS'), 'No object(s) received.');
      return;
   }
   const njs =
      typeof options.njs === 'number'
         ? new NoteJumpSpeed(options.timeProc.bpm, options.njs, options.offset)
         : options.njs;
   const offset = njs.calcHjdFromJd(options.jd) - njs.calcHjd(0);
   objects.forEach((o) => {
      o.customData.noteJumpMovementSpeed = njs.value;
      o.customData.noteJumpStartBeatOffset = offset;
   });
}

/**
 * Simultaneously spawn the object from start to end object.
 *
 * Speed determines how fast should note spawn from start to end. (1 is regular speed)
 *
 * **NOTE:** JD input will override NJS offset.
 */
export function simultaneousSpawn(
   objects: INEObject[],
   options: {
      timeProc: TimeProcessor;
      njs: NoteJumpSpeed | number;
      njsOverride?: boolean;
      jd?: number;
      spawnBeatOffset?: number;
      speed: number;
   },
): void {
   if (!objects.length) {
      logger.tWarn(tag('simultaneousSpawn'), 'No object(s) received.');
      return;
   }
   if (!options.speed) {
      logger.tError(tag('simultaneousSpawn'), 'Speed cannot be 0!');
      options.speed = 1;
   }
   options.spawnBeatOffset = options.spawnBeatOffset ?? 0;
   const njs = typeof options.njs === 'number' ? options.njs : options.njs.value;
   const startTime = objects[0].time;
   objects.forEach((o) => {
      o.customData.noteJumpMovementSpeed = options.njsOverride
         ? (o.customData.noteJumpMovementSpeed ?? njs)
         : njs;
      const currentNJS = new NoteJumpSpeed(
         options.timeProc.bpm,
         o.customData.noteJumpMovementSpeed,
      );
      const offset = currentNJS.calcHjdFromJd(options.jd) - currentNJS.calcHjd(0);
      o.customData.noteJumpStartBeatOffset =
         options.spawnBeatOffset! +
         offset +
         o.time -
         startTime -
         (o.time - startTime) / options.speed;
   });
}

/**
 * Gradually change NJS for objects from start to end objects.
 *
 * **NOTE:** JD input will override NJS offset.
 */
export function gradientNjs(
   objects: INEObject[],
   options: {
      timeProc: TimeProcessor | number;
      njsStart: number;
      njsEnd: number;
      njsOffset?: NoteJumpSpeed | number | null;
      jd?: number;
      easing?: EasingFunction;
   },
): void {
   if (!objects.length) {
      logger.tWarn(tag('gradientNJS'), 'No object(s) received.');
      return;
   }
   options.easing =
      options.easing ??
      function (x: number) {
         return x;
      };
   let offset: number;
   if (typeof options.njsOffset !== 'number') {
      if (options.njsOffset) {
         offset = options.njsOffset.offset;
      } else {
         offset = settings.NJS?.offset ?? 0;
      }
   } else {
      offset = options.njsOffset;
   }
   const startTime = objects[0].time;
   const endTime = objects.at(-1)!.time;
   objects.forEach((o) => {
      o.customData.noteJumpMovementSpeed = lerp(
         normalize(o.time, startTime, endTime),
         options.njsStart,
         options.njsEnd,
         options.easing,
      );
      if (typeof options.jd === 'number') {
         const currNJS = new NoteJumpSpeed(
            options.timeProc instanceof TimeProcessor ? options.timeProc.bpm : options.timeProc,
            o.customData.noteJumpMovementSpeed,
            offset,
         );
         o.customData.noteJumpStartBeatOffset =
            currNJS.calcHjdFromJd(options.jd) - currNJS.calcHjd(0);
      }
   });
}
