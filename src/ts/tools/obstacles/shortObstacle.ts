import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import UIInput from '../../ui/helpers/input';
import { printResultTime } from '../helpers';
import { PosX, PosY } from '../../beatmap/shared/constants';
import { Obstacle } from '../../beatmap/v4/obstacle';
import { IWrapObstacle } from '../../types/beatmap/wrapper/obstacle';

const name = '<15ms Obstacle';
const description =
   'Look for obstacle with inadequate duration.\nThis causes player to not take damage when in collision with obstacle.';
const enabled = true;

const tool: Tool<{ minDur: number }> = {
   name,
   description,
   type: 'obstacle',
   order: {
      input: ToolInputOrder.OBSTACLES_SHORT,
      output: ToolOutputOrder.OBSTACLES_SHORT,
   },
   input: {
      enabled,
      params: {
         minDur: 0.015,
      },
      html: UIInput.createBlock(
         UIInput.createCheckbox(
            function (this: HTMLInputElement) {
               tool.input.enabled = this.checked;
            },
            name,
            description,
            enabled,
         ),
      ),
   },
   output: {
      html: null,
   },
   run,
};

function check(map: ToolArgs) {
   const { obstacles } = map.difficulty!.data;
   const { bpm } = map.settings;
   const { minDur: temp } = tool.input.params;
   const minDur = bpm.toBeatTime(temp);
   const ary: IWrapObstacle[] = [];
   let obstacleLFull: IWrapObstacle = new Obstacle();
   let obstacleRFull: IWrapObstacle = new Obstacle();
   let obstacleLHalf: IWrapObstacle = new Obstacle();
   let obstacleRHalf: IWrapObstacle = new Obstacle();
   obstacles.forEach((o) => {
      if (o.posY === PosY.BOTTOM && o.height > 2 && o.duration > 0) {
         if (o.width > 2 || (o.width > 1 && o.posX === 1)) {
            if (o.isLonger(obstacleLFull)) {
               if (o.duration < minDur) {
                  ary.push(o);
               }
               obstacleLFull = o;
            }
            if (o.isLonger(obstacleRFull)) {
               if (o.duration < minDur) {
                  ary.push(o);
               }
               obstacleRFull = o;
            }
         } else if (o.width === 2) {
            if (o.posX === PosX.LEFT) {
               if (o.isLonger(obstacleLFull)) {
                  if (o.duration < minDur) {
                     ary.push(o);
                  }
                  obstacleLFull = o;
               }
            } else if (o.posX === PosX.MIDDLE_RIGHT) {
               if (o.isLonger(obstacleRFull)) {
                  if (o.duration < minDur) {
                     ary.push(o);
                  }
                  obstacleRFull = o;
               }
            }
         } else if (o.width === 1) {
            if (o.posX === PosX.MIDDLE_LEFT) {
               if (o.isLonger(obstacleLFull)) {
                  if (o.duration < minDur) {
                     ary.push(o);
                  }
                  obstacleLFull = o;
               }
            } else if (o.posX === PosX.MIDDLE_RIGHT) {
               if (o.isLonger(obstacleRFull)) {
                  if (o.duration < minDur) {
                     ary.push(o);
                  }
                  obstacleRFull = o;
               }
            }
         }
      } else if (o.posY === PosY.TOP && o.height > 2 && o.duration > 0) {
         if (o.width > 2 || (o.width > 1 && o.posX === PosX.MIDDLE_LEFT)) {
            if (o.isLonger(obstacleLHalf)) {
               if (
                  o.duration < minDur &&
                  o.isLonger(obstacleLFull, minDur) &&
                  o.isLonger(obstacleLHalf, minDur)
               ) {
                  ary.push(o);
               }
               obstacleLHalf = o;
            }
            if (o.isLonger(obstacleRHalf)) {
               if (
                  o.duration < minDur &&
                  o.isLonger(obstacleRFull, minDur) &&
                  o.isLonger(obstacleRHalf, minDur)
               ) {
                  ary.push(o);
               }
               obstacleRHalf = o;
            }
         } else if (o.width === 2) {
            if (o.posX === PosX.LEFT) {
               if (o.isLonger(obstacleLHalf)) {
                  if (
                     o.duration < minDur &&
                     o.isLonger(obstacleLFull, minDur) &&
                     o.isLonger(obstacleLHalf, minDur)
                  ) {
                     ary.push(o);
                  }
                  obstacleLHalf = o;
               }
            } else if (o.posX === PosX.MIDDLE_RIGHT) {
               if (o.isLonger(obstacleRHalf)) {
                  if (
                     o.duration < minDur &&
                     o.isLonger(obstacleRFull, minDur) &&
                     o.isLonger(obstacleRHalf, minDur)
                  ) {
                     ary.push(o);
                  }
                  obstacleRHalf = o;
               }
            }
         } else if (o.width === 1) {
            if (o.posX === PosX.MIDDLE_LEFT) {
               if (o.isLonger(obstacleLHalf)) {
                  if (
                     o.duration < minDur &&
                     o.isLonger(obstacleLFull, minDur) &&
                     o.isLonger(obstacleLHalf, minDur)
                  ) {
                     ary.push(o);
                  }
                  obstacleLHalf = o;
               }
            } else if (o.posX === PosX.MIDDLE_RIGHT) {
               if (o.isLonger(obstacleRHalf)) {
                  if (
                     o.duration < minDur &&
                     o.isLonger(obstacleRFull, minDur) &&
                     o.isLonger(obstacleRHalf, minDur)
                  ) {
                     ary.push(o);
                  }
                  obstacleRHalf = o;
               }
            }
         }
      }
   });
   return ary
      .map((o) => o.time)
      .filter(function (x, i, ary) {
         return !i || x !== ary[i - 1];
      });
}

function run(map: ToolArgs) {
   if (!map.difficulty) {
      console.error('Something went wrong!');
      return;
   }
   const result = check(map);

   if (result.length) {
      tool.output.html = printResultTime('<15ms obstacle', result, map.settings.bpm, 'warning');
   } else {
      tool.output.html = null;
   }
}

export default tool;
