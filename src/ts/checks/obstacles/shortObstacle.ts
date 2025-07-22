import { Obstacle, PosX, PosY } from 'bsmap';
import * as types from 'bsmap/types';
import {
   ICheck,
   ICheckOutput,
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   OutputType,
   OutputStatus,
} from '../../types';
import { UIInput } from '../../ui/helpers/input';
import { PrecalculateKey } from '../../types/precalculate';
import { nearEqual } from 'bsmap/utils';

const name = '<15ms Obstacle';
const description =
   'Look for obstacle with inadequate duration.\nThis causes player to not take damage when in collision with obstacle.';
const enabled = true;

const [htmlInput, htmlLabel] = UIInput.createCheckbox(
   function (this: HTMLInputElement) {
      tool.input.params.enabled = this.checked;
   },
   name,
   description,
   enabled,
);

function update() {
   htmlInput.checked = tool.input.params.enabled;
}

const tool: ICheck<{ minDuration: number }> = {
   name,
   description,
   type: CheckType.OBSTACLE,
   order: {
      input: CheckInputOrder.OBSTACLES_SHORT,
      output: CheckOutputOrder.OBSTACLES_SHORT,
   },
   input: {
      params: { enabled, minDuration: 0.015 },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function customIsLonger(
   o: types.wrapper.IWrapObstacle,
   compareTo: types.wrapper.IWrapObstacle,
   prevOffset = 0,
) {
   return (
      o.customData[PrecalculateKey.SECOND_TIME] +
         o.customData[PrecalculateKey.DURATION_SECOND_TIME] >
      compareTo.customData[PrecalculateKey.SECOND_TIME] +
         compareTo.customData[PrecalculateKey.DURATION_SECOND_TIME] +
         prevOffset
   );
}

function check(args: CheckArgs) {
   const { obstacles } = args.beatmap.data.difficulty;
   const { minDuration } = tool.input.params;
   const ary: types.wrapper.IWrapObstacle[] = [];
   let obstacleLFull: types.wrapper.IWrapObstacle = new Obstacle({
      time: Number.MIN_SAFE_INTEGER,
      customData: { [PrecalculateKey.SECOND_TIME]: 0, [PrecalculateKey.DURATION_SECOND_TIME]: 0 },
   });
   let obstacleRFull: types.wrapper.IWrapObstacle = new Obstacle({
      time: Number.MIN_SAFE_INTEGER,
      customData: { [PrecalculateKey.SECOND_TIME]: 0, [PrecalculateKey.DURATION_SECOND_TIME]: 0 },
   });
   let obstacleLHalf: types.wrapper.IWrapObstacle = new Obstacle({
      time: Number.MIN_SAFE_INTEGER,
      customData: { [PrecalculateKey.SECOND_TIME]: 0, [PrecalculateKey.DURATION_SECOND_TIME]: 0 },
   });
   let obstacleRHalf: types.wrapper.IWrapObstacle = new Obstacle({
      time: Number.MIN_SAFE_INTEGER,
      customData: { [PrecalculateKey.SECOND_TIME]: 0, [PrecalculateKey.DURATION_SECOND_TIME]: 0 },
   });
   for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];
      const wallDuration = o.customData[PrecalculateKey.DURATION_SECOND_TIME];
      if (nearEqual(wallDuration, 0)) {
         ary.push(o);
      } else if (o.posY === PosY.BOTTOM && o.height > 2) {
         if (o.width > 2 || (o.width > 1 && o.posX === 1)) {
            if (customIsLonger(o, obstacleLFull)) {
               if (wallDuration < minDuration) {
                  ary.push(o);
               }
               obstacleLFull = o;
            }
            if (customIsLonger(o, obstacleRFull)) {
               if (wallDuration < minDuration) {
                  ary.push(o);
               }
               obstacleRFull = o;
            }
         } else if (o.width === 2) {
            if (o.posX === PosX.LEFT) {
               if (customIsLonger(o, obstacleLFull)) {
                  if (wallDuration < minDuration) {
                     ary.push(o);
                  }
                  obstacleLFull = o;
               }
            } else if (o.posX === PosX.MIDDLE_RIGHT) {
               if (customIsLonger(o, obstacleRFull)) {
                  if (wallDuration < minDuration) {
                     ary.push(o);
                  }
                  obstacleRFull = o;
               }
            }
         } else if (o.width === 1) {
            if (o.posX === PosX.MIDDLE_LEFT) {
               if (customIsLonger(o, obstacleLFull)) {
                  if (wallDuration < minDuration) {
                     ary.push(o);
                  }
                  obstacleLFull = o;
               }
            } else if (o.posX === PosX.MIDDLE_RIGHT) {
               if (customIsLonger(o, obstacleRFull)) {
                  if (wallDuration < minDuration) {
                     ary.push(o);
                  }
                  obstacleRFull = o;
               }
            }
         }
      } else if (o.posY === PosY.TOP && o.height > 2 && wallDuration > 0) {
         if (o.width > 2 || (o.width > 1 && o.posX === PosX.MIDDLE_LEFT)) {
            if (customIsLonger(o, obstacleLHalf)) {
               if (
                  wallDuration < minDuration &&
                  customIsLonger(o, obstacleLFull, minDuration) &&
                  customIsLonger(o, obstacleLHalf, minDuration)
               ) {
                  ary.push(o);
               }
               obstacleLHalf = o;
            }
            if (customIsLonger(o, obstacleRHalf)) {
               if (
                  wallDuration < minDuration &&
                  customIsLonger(o, obstacleRFull, minDuration) &&
                  customIsLonger(o, obstacleRHalf, minDuration)
               ) {
                  ary.push(o);
               }
               obstacleRHalf = o;
            }
         } else if (o.width === 2) {
            if (o.posX === PosX.LEFT) {
               if (customIsLonger(o, obstacleLHalf)) {
                  if (
                     wallDuration < minDuration &&
                     customIsLonger(o, obstacleLFull, minDuration) &&
                     customIsLonger(o, obstacleLHalf, minDuration)
                  ) {
                     ary.push(o);
                  }
                  obstacleLHalf = o;
               }
            } else if (o.posX === PosX.MIDDLE_RIGHT) {
               if (customIsLonger(o, obstacleRHalf)) {
                  if (
                     wallDuration < minDuration &&
                     customIsLonger(o, obstacleRFull, minDuration) &&
                     customIsLonger(o, obstacleRHalf, minDuration)
                  ) {
                     ary.push(o);
                  }
                  obstacleRHalf = o;
               }
            }
         } else if (o.width === 1) {
            if (o.posX === PosX.MIDDLE_LEFT) {
               if (customIsLonger(o, obstacleLHalf)) {
                  if (
                     wallDuration < minDuration &&
                     customIsLonger(o, obstacleLFull, minDuration) &&
                     customIsLonger(o, obstacleLHalf, minDuration)
                  ) {
                     ary.push(o);
                  }
                  obstacleLHalf = o;
               }
            } else if (o.posX === PosX.MIDDLE_RIGHT) {
               if (customIsLonger(o, obstacleRHalf)) {
                  if (
                     wallDuration < minDuration &&
                     customIsLonger(o, obstacleRFull, minDuration) &&
                     customIsLonger(o, obstacleRHalf, minDuration)
                  ) {
                     ary.push(o);
                  }
                  obstacleRHalf = o;
               }
            }
         }
      }
   }
   return ary;
}

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            status: OutputStatus.WARNING,
            label: '<15ms obstacle',
            type: OutputType.TIME,
            value: result,
         },
      ];
   }
   return [];
}

export default tool;
