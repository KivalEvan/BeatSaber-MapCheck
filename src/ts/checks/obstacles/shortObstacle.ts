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

const tool: ICheck<{ minDur: number }> = {
   name,
   description,
   type: CheckType.OBSTACLE,
   order: {
      input: CheckInputOrder.OBSTACLES_SHORT,
      output: CheckOutputOrder.OBSTACLES_SHORT,
   },
   input: {
      params: { enabled, minDur: 0.015 },
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
      o.customData.__mapcheck_secondtime + o.customData.__mapcheck_duration_secondtime >
      compareTo.customData.__mapcheck_secondtime +
         compareTo.customData.__mapcheck_duration_secondtime +
         prevOffset
   );
}

function check(args: CheckArgs) {
   const { obstacles } = args.beatmap.data.difficulty;
   const { minDur } = tool.input.params;
   const ary: types.wrapper.IWrapObstacle[] = [];
   let obstacleLFull: types.wrapper.IWrapObstacle = new Obstacle({ time: Number.MIN_SAFE_INTEGER });
   let obstacleRFull: types.wrapper.IWrapObstacle = new Obstacle({ time: Number.MIN_SAFE_INTEGER });
   let obstacleLHalf: types.wrapper.IWrapObstacle = new Obstacle({ time: Number.MIN_SAFE_INTEGER });
   let obstacleRHalf: types.wrapper.IWrapObstacle = new Obstacle({ time: Number.MIN_SAFE_INTEGER });
   for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];
      const wallDur = o.customData.__mapcheck_duration_secondtime;
      if (o.posY === PosY.BOTTOM && o.height > 2 && wallDur > 0) {
         if (o.width > 2 || (o.width > 1 && o.posX === 1)) {
            if (customIsLonger(o, obstacleLFull)) {
               if (wallDur < minDur) {
                  ary.push(o);
               }
               obstacleLFull = o;
            }
            if (customIsLonger(o, obstacleRFull)) {
               if (wallDur < minDur) {
                  ary.push(o);
               }
               obstacleRFull = o;
            }
         } else if (o.width === 2) {
            if (o.posX === PosX.LEFT) {
               if (customIsLonger(o, obstacleLFull)) {
                  if (wallDur < minDur) {
                     ary.push(o);
                  }
                  obstacleLFull = o;
               }
            } else if (o.posX === PosX.MIDDLE_RIGHT) {
               if (customIsLonger(o, obstacleRFull)) {
                  if (wallDur < minDur) {
                     ary.push(o);
                  }
                  obstacleRFull = o;
               }
            }
         } else if (o.width === 1) {
            if (o.posX === PosX.MIDDLE_LEFT) {
               if (customIsLonger(o, obstacleLFull)) {
                  if (wallDur < minDur) {
                     ary.push(o);
                  }
                  obstacleLFull = o;
               }
            } else if (o.posX === PosX.MIDDLE_RIGHT) {
               if (customIsLonger(o, obstacleRFull)) {
                  if (wallDur < minDur) {
                     ary.push(o);
                  }
                  obstacleRFull = o;
               }
            }
         }
      } else if (o.posY === PosY.TOP && o.height > 2 && wallDur > 0) {
         if (o.width > 2 || (o.width > 1 && o.posX === PosX.MIDDLE_LEFT)) {
            if (customIsLonger(o, obstacleLHalf)) {
               if (
                  wallDur < minDur &&
                  customIsLonger(o, obstacleLFull, minDur) &&
                  customIsLonger(o, obstacleLHalf, minDur)
               ) {
                  ary.push(o);
               }
               obstacleLHalf = o;
            }
            if (customIsLonger(o, obstacleRHalf)) {
               if (
                  wallDur < minDur &&
                  customIsLonger(o, obstacleRFull, minDur) &&
                  customIsLonger(o, obstacleRHalf, minDur)
               ) {
                  ary.push(o);
               }
               obstacleRHalf = o;
            }
         } else if (o.width === 2) {
            if (o.posX === PosX.LEFT) {
               if (customIsLonger(o, obstacleLHalf)) {
                  if (
                     wallDur < minDur &&
                     customIsLonger(o, obstacleLFull, minDur) &&
                     customIsLonger(o, obstacleLHalf, minDur)
                  ) {
                     ary.push(o);
                  }
                  obstacleLHalf = o;
               }
            } else if (o.posX === PosX.MIDDLE_RIGHT) {
               if (customIsLonger(o, obstacleRHalf)) {
                  if (
                     wallDur < minDur &&
                     customIsLonger(o, obstacleRFull, minDur) &&
                     customIsLonger(o, obstacleRHalf, minDur)
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
                     wallDur < minDur &&
                     customIsLonger(o, obstacleLFull, minDur) &&
                     customIsLonger(o, obstacleLHalf, minDur)
                  ) {
                     ary.push(o);
                  }
                  obstacleLHalf = o;
               }
            } else if (o.posX === PosX.MIDDLE_RIGHT) {
               if (customIsLonger(o, obstacleRHalf)) {
                  if (
                     wallDur < minDur &&
                     customIsLonger(o, obstacleRFull, minDur) &&
                     customIsLonger(o, obstacleRHalf, minDur)
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
