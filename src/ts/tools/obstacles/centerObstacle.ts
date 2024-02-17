import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { round } from '../../utils';
import { printResultTime } from '../helpers';
import UIInput from '../../ui/helpers/input';
import { BeatPerMinute } from '../../beatmap/shared/bpm';
import { PosX, PosY } from '../../beatmap/shared/constants';
import { Obstacle } from '../../beatmap/v4/obstacle';
import { IWrapObstacle } from '../../types/beatmap/wrapper/obstacle';

const name = '2-wide Center Obstacle';
const description =
   'Look for 2-wide center obstacle including obstacles that are relatively close to each other.';
const enabled = true;
const defaultMaxTime = 0.25;
let localBPM!: BeatPerMinute;

const [htmlLabelMaxTime, htmlInputMaxTime] = UIInput.createNumber(
   function (this: HTMLInputElement) {
      tool.input.params.recovery = Math.abs(parseFloat(this.value)) / 1000;
      this.value = round(tool.input.params.recovery * 1000, 1).toString();
      if (localBPM) {
         htmlInputMaxBeat.value = round(
            localBPM.toBeatTime(tool.input.params.recovery),
            2,
         ).toString();
      }
   },
   'recovery time (ms): ',
   round(defaultMaxTime * 1000, 1),
   0,
);
const [htmlLabelMaxBeat, htmlInputMaxBeat] = UIInput.createNumber(
   function (this: HTMLInputElement) {
      if (!localBPM) {
         this.value = '0';
         return;
      }
      let val = round(Math.abs(parseFloat(this.value)), 2) || 1;
      tool.input.params.recovery = localBPM.toRealTime(val);
      htmlInputMaxTime.value = round(tool.input.params.recovery * 1000, 1).toString();
      this.value = val.toString();
   },
   ' (beat): ',
   0,
   0,
   0.1,
);

const tool: Tool<{ recovery: number }> = {
   name,
   description,
   type: 'obstacle',
   order: {
      input: ToolInputOrder.OBSTACLES_CENTER,
      output: ToolOutputOrder.OBSTACLES_CENTER,
   },
   input: {
      enabled,
      params: {
         recovery: defaultMaxTime,
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
         document.createElement('br'),
         htmlLabelMaxTime,
         htmlInputMaxTime,
         htmlLabelMaxBeat,
         htmlInputMaxBeat,
      ),
      adjustTime: adjustTimeHandler,
   },
   output: {
      html: null,
   },
   run,
};

function adjustTimeHandler(bpm: BeatPerMinute) {
   localBPM = bpm;
   htmlInputMaxBeat.value = round(localBPM.toBeatTime(tool.input.params.recovery), 2).toString();
}

function check(map: ToolArgs) {
   const { obstacles } = map.difficulty!.data;
   const { bpm } = map.settings;
   const { recovery } = tool.input.params;
   const arr: IWrapObstacle[] = [];
   let obstacleLeftFull: IWrapObstacle = new Obstacle();
   let obstacleRightFull: IWrapObstacle = new Obstacle();
   obstacles.forEach((o) => {
      if (o.posY < PosY.TOP && o.height > 1) {
         if (o.width > 2) {
            arr.push(o);
            if (o.isLonger(obstacleLeftFull)) {
               obstacleLeftFull = o;
            }
            if (o.isLonger(obstacleRightFull)) {
               obstacleRightFull = o;
            }
         }
         if (o.width === 2) {
            if (o.posX === PosX.LEFT) {
               if (o.isLonger(obstacleLeftFull)) {
                  if (
                     bpm.toRealTime(o.time) > bpm.toRealTime(obstacleRightFull.time) - recovery &&
                     bpm.toRealTime(o.time) <
                        bpm.toRealTime(obstacleRightFull.time + obstacleRightFull.duration) +
                           recovery
                  ) {
                     arr.push(o);
                  }
                  obstacleLeftFull = o;
               }
            }
            if (o.posX === PosX.MIDDLE_LEFT) {
               arr.push(o);
               if (o.isLonger(obstacleLeftFull)) {
                  obstacleLeftFull = o;
               }
               if (o.isLonger(obstacleRightFull)) {
                  obstacleRightFull = o;
               }
            }
            if (o.posX === PosX.MIDDLE_RIGHT) {
               if (o.isLonger(obstacleRightFull)) {
                  if (
                     bpm.toRealTime(o.time) > bpm.toRealTime(obstacleLeftFull.time) - recovery &&
                     bpm.toRealTime(o.time) <
                        bpm.toRealTime(obstacleLeftFull.time + obstacleLeftFull.duration) + recovery
                  ) {
                     arr.push(o);
                  }
                  obstacleRightFull = o;
               }
            }
         }
         if (o.width === 1) {
            if (o.posX === PosX.MIDDLE_LEFT) {
               if (o.isLonger(obstacleLeftFull)) {
                  if (
                     bpm.toRealTime(o.time) > bpm.toRealTime(obstacleRightFull.time) - recovery &&
                     bpm.toRealTime(o.time) <
                        bpm.toRealTime(obstacleRightFull.time + obstacleRightFull.duration) +
                           recovery
                  ) {
                     arr.push(o);
                  }
                  obstacleLeftFull = o;
               }
            }
            if (o.posX === PosX.MIDDLE_RIGHT) {
               if (o.isLonger(obstacleRightFull)) {
                  if (
                     bpm.toRealTime(o.time) > bpm.toRealTime(obstacleLeftFull.time) - recovery &&
                     bpm.toRealTime(o.time) <
                        bpm.toRealTime(obstacleLeftFull.time + obstacleLeftFull.duration) + recovery
                  ) {
                     arr.push(o);
                  }
                  obstacleRightFull = o;
               }
            }
         }
      }
   });
   return arr
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
   const { recovery } = tool.input.params;

   if (result.length) {
      tool.output.html = printResultTime(
         `2-wide center obstacle (<${round(recovery * 1000)}ms)`,
         result,
         map.settings.bpm,
         'error',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
