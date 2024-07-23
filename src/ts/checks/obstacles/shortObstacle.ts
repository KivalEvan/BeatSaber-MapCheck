import { Obstacle, PosY, PosX, types } from 'bsmap';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';

const name = '<15ms Obstacle';
const description =
   'Look for obstacle with inadequate duration.\nThis causes player to not take damage when in collision with obstacle.';
const enabled = true;

const tool: ITool<{ minDur: number }> = {
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
   run,
};

function check(args: ToolArgs) {
   const { obstacles } = args.beatmap.data;
   const { timeProcessor } = args.beatmap;
   const { minDur: temp } = tool.input.params;
   const minDur = timeProcessor.toBeatTime(temp, false);
   const ary: types.wrapper.IWrapObstacle[] = [];
   let obstacleLFull: types.wrapper.IWrapObstacle = new Obstacle();
   let obstacleRFull: types.wrapper.IWrapObstacle = new Obstacle();
   let obstacleLHalf: types.wrapper.IWrapObstacle = new Obstacle();
   let obstacleRHalf: types.wrapper.IWrapObstacle = new Obstacle();
   for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];
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
   }
   return ary;
}

function run(args: ToolArgs): IToolOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            type: 'time',
            label: '<15ms obstacle',
            value: result,
            symbol: 'warning',
         },
      ];
   }
   return [];
}

export default tool;
