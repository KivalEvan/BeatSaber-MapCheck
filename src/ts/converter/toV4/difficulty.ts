import logger from '../../logger.ts';
import { Difficulty as V1Difficulty } from '../../beatmap/v1/difficulty.ts';
import { Difficulty as V2Difficulty } from '../../beatmap/v2/difficulty.ts';
import { Difficulty as V3Difficulty } from '../../beatmap/v3/difficulty.ts';
import { Difficulty as V4Difficulty } from '../../beatmap/v4/difficulty.ts';
import type { IWrapDifficulty } from '../../types/beatmap/wrapper/difficulty.ts';
import { deepCopy } from '../../utils/misc.ts';
import { clamp } from '../../utils/math.ts';
import objectToV3 from '../customData/objectToV3.ts';
import { SpawnRotation } from '../../beatmap/v4/rotationEvent.ts';
import { EventLaneRotationValue } from '../../types/beatmap/shared/constants.ts';

function tag(name: string): string[] {
   return ['convert', 'toV4Difficulty', name];
}

export function toV4Difficulty(data: IWrapDifficulty): V4Difficulty {
   logger.tWarn(tag('main'), 'Converting to beatmap v4 may lose certain data!');

   let template = new V4Difficulty();
   switch (true) {
      case data instanceof V1Difficulty:
         fromV1Difficulty(template, data as V1Difficulty);
         break;
      case data instanceof V2Difficulty:
         fromV2Difficulty(template, data as V2Difficulty);
         break;
      case data instanceof V3Difficulty:
         fromV3Difficulty(template, data as V3Difficulty);
         break;
      case data instanceof V4Difficulty:
         template = new V4Difficulty(data);
         break;
      default:
         logger.tWarn(tag('main'), 'Unknown beatmap data, returning empty template');
   }
   template.filename = data.filename;

   return template;
}

function fromV1Difficulty(template: V4Difficulty, data: V1Difficulty) {
   data.colorNotes.forEach((n) => {
      if (n.isBomb()) template.addBombNotes(n);
      if (n.isNote()) {
         let a = 0;
         if (typeof n.customData._cutDirection === 'number') {
            a =
               n.customData._cutDirection > 0
                  ? n.customData._cutDirection % 360
                  : 360 + (n.customData._cutDirection % 360);
         } else if (n.direction >= 1000) {
            a = Math.abs(((n.direction % 1000) % 360) - 360);
         }
         template.addColorNotes({
            time: n.time,
            color: n.type as 0 | 1,
            posX: n.posX,
            posY: n.posY,
            direction:
               n.direction >= 1000 || typeof n.customData._cutDirection === 'number'
                  ? n.direction === 8
                     ? 8
                     : 1
                  : clamp(n.direction, 0, 8),
            angleOffset: a,
         });
      }
   });
   template.addObstacles(...data.obstacles);
   data.basicEvents.forEach((e) => {
      if (e.isLaneRotationEvent()) {
         template.rotationEvents.push(
            new SpawnRotation({
               time: e.time,
               executionTime: e.type === 14 ? 0 : 1,
               rotation:
                  typeof e.customData._rotation === 'number'
                     ? e.customData._rotation
                     : e.value >= 1000
                       ? (e.value - 1360) % 360
                       : EventLaneRotationValue[e.value] ?? 0,
            }),
         );
      }
   });
}

function fromV2Difficulty(template: V4Difficulty, data: V2Difficulty) {
   template.customData.fakeBombNotes = [];
   template.customData.fakeColorNotes = [];
   template.customData.fakeObstacles = [];

   data.colorNotes.forEach((n, i) => {
      const customData = objectToV3(n.customData);
      if (typeof n.customData._cutDirection === 'number') {
         logger.tDebug(
            tag('fromV2Difficulty'),
            `notes[${i}] at time ${n.time} NE _cutDirection will be converted.`,
         );
      }
      if (n.isBomb()) {
         if (n.customData._fake) {
            template.customData.fakeBombNotes!.push({
               b: n.time,
               x: n.posX,
               y: n.posY,
               customData,
            });
         } else {
            template.addBombNotes({
               time: n.time,
               posX: n.posX,
               posY: n.posY,
               customData,
            });
         }
      }
      if (n.isNote()) {
         let a = 0;
         if (typeof n.customData._cutDirection === 'number') {
            a =
               n.customData._cutDirection > 0
                  ? n.customData._cutDirection % 360
                  : 360 + (n.customData._cutDirection % 360);
         } else if (n.direction >= 1000) {
            a = Math.abs(((n.direction % 1000) % 360) - 360);
         }
         if (n.customData._fake) {
            template.customData.fakeColorNotes!.push({
               b: n.time,
               c: n.type as 0 | 1,
               x: n.posX,
               y: n.posY,
               d:
                  n.direction >= 1000 || typeof n.customData._cutDirection === 'number'
                     ? n.direction === 8
                        ? 8
                        : 1
                     : clamp(n.direction, 0, 8),
               a: a,
               customData,
            });
         } else {
            template.addColorNotes({
               time: n.time,
               color: n.type as 0 | 1,
               posX: n.posX,
               posY: n.posY,
               direction:
                  n.direction >= 1000 || typeof n.customData._cutDirection === 'number'
                     ? n.direction === 8
                        ? 8
                        : 1
                     : clamp(n.direction, 0, 8),
               angleOffset: a,
               customData,
            });
         }
      }
   });

   data.obstacles.forEach((o) => {
      const customData = objectToV3(o.customData);
      if (o.customData._fake) {
         template.customData.fakeObstacles!.push({
            b: o.time,
            x: o.posX,
            y: o.type ? 2 : 0,
            d: o.duration,
            w: o.width,
            h: o.type ? 3 : 5,
            customData,
         });
      } else {
         template.addObstacles({
            time: o.time,
            posX: o.posX,
            posY: o.type ? 2 : 0,
            duration: o.duration,
            width: o.width,
            height: o.type ? 3 : 5,
            customData,
         });
      }
   });
   template.addArcs(...data.arcs);
   data.basicEvents.forEach((e) => {
      if (e.isLaneRotationEvent()) {
         template.rotationEvents.push(
            new SpawnRotation({
               time: e.time,
               executionTime: e.type === 14 ? 0 : 1,
               rotation:
                  typeof e.customData._rotation === 'number'
                     ? e.customData._rotation
                     : e.value >= 1000
                       ? (e.value - 1360) % 360
                       : EventLaneRotationValue[e.value] ?? 0,
            }),
         );
      }
   });
}

function fromV3Difficulty(template: V4Difficulty, data: V3Difficulty) {
   template.addColorNotes(...data.colorNotes);
   template.addBombNotes(...data.bombNotes);
   template.addObstacles(...data.obstacles);
   template.addArcs(...data.arcs);
   template.addChains(...data.chains);
   template.addRotationEvents(...data.rotationEvents);
   template.customData = deepCopy(data.customData);
}
