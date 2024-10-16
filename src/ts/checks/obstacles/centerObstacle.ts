import { Obstacle, PosX, PosY, TimeProcessor } from 'bsmap';
import { round } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';

const name = '2-wide Center Obstacle';
const description =
   'Look for 2-wide center obstacle including obstacles that are relatively close to each other.';
const enabled = true;
const defaultMaxTime = 0.25;
let localBPM!: TimeProcessor;

const [htmlLabelMaxTime, htmlInputMaxTime] = UIInput.createNumber(
   function (this: HTMLInputElement) {
      tool.input.params.recovery = Math.abs(parseFloat(this.value)) / 1000;
      this.value = round(tool.input.params.recovery * 1000, 1).toString();
      if (localBPM) {
         htmlInputMaxBeat.value = round(
            localBPM.toBeatTime(tool.input.params.recovery, false),
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
      tool.input.params.recovery = localBPM.toRealTime(val, true);
      htmlInputMaxTime.value = round(tool.input.params.recovery * 1000, 1).toString();
      this.value = val.toString();
   },
   ' (beat): ',
   0,
   0,
   0.1,
);
const htmlEnabled = UIInput.createCheckbox(
   function (this: HTMLInputElement) {
      tool.input.params.enabled = this.checked;
   },
   name,
   description,
   enabled,
);

function update(timeProcessor?: TimeProcessor) {
   htmlEnabled[0].checked = tool.input.params.enabled;
   htmlInputMaxTime.value = (tool.input.params.recovery * 1000).toString();
   if (timeProcessor) adjustTimeHandler(timeProcessor);
}

const tool: ITool<{ recovery: number }> = {
   name,
   description,
   type: 'obstacle',
   order: {
      input: ToolInputOrder.OBSTACLES_CENTER,
      output: ToolOutputOrder.OBSTACLES_CENTER,
   },
   input: {
      params: { enabled, recovery: defaultMaxTime },
      html: UIInput.createBlock(
         htmlEnabled,
         document.createElement('br'),
         htmlLabelMaxTime,
         htmlInputMaxTime,
         htmlLabelMaxBeat,
         htmlInputMaxBeat,
      ),
      update,
      adjustTime: adjustTimeHandler,
   },
   run,
};

function adjustTimeHandler(bpm: TimeProcessor) {
   localBPM = bpm;
   htmlInputMaxBeat.value = round(
      localBPM.toBeatTime(tool.input.params.recovery, false),
      2,
   ).toString();
}

function check(args: ToolArgs) {
   const { obstacles } = args.beatmap.data;
   const { timeProcessor } = args.beatmap;
   const { recovery } = tool.input.params;
   const arr: types.wrapper.IWrapObstacle[] = [];
   let obstacleLeftFull: types.wrapper.IWrapObstacle = new Obstacle();
   let obstacleRightFull: types.wrapper.IWrapObstacle = new Obstacle();
   for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];
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
                     o.customData.__mapcheck_secondtime >
                        obstacleRightFull.customData.__mapcheck_secondtime - recovery &&
                     o.customData.__mapcheck_secondtime <
                        obstacleRightFull.customData.__mapcheck_secondtime +
                           timeProcessor.toRealTime(obstacleRightFull.duration) +
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
                     o.customData.__mapcheck_secondtime >
                        obstacleLeftFull.customData.__mapcheck_secondtime - recovery &&
                     o.customData.__mapcheck_secondtime <
                        obstacleLeftFull.customData.__mapcheck_secondtime +
                           timeProcessor.toRealTime(obstacleLeftFull.duration) +
                           recovery
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
                     o.customData.__mapcheck_secondtime >
                        obstacleRightFull.customData.__mapcheck_secondtime - recovery &&
                     o.customData.__mapcheck_secondtime <
                        obstacleRightFull.customData.__mapcheck_secondtime +
                           timeProcessor.toRealTime(obstacleRightFull.duration) +
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
                     o.customData.__mapcheck_secondtime >
                        obstacleLeftFull.customData.__mapcheck_secondtime - recovery &&
                     o.customData.__mapcheck_secondtime <
                        obstacleLeftFull.customData.__mapcheck_secondtime +
                           timeProcessor.toRealTime(obstacleLeftFull.duration) +
                           recovery
                  ) {
                     arr.push(o);
                  }
                  obstacleRightFull = o;
               }
            }
         }
      }
   }
   return arr;
}

function run(args: ToolArgs): IToolOutput[] {
   const result = check(args);
   const { recovery } = tool.input.params;

   if (result.length) {
      return [
         {
            type: 'time',
            label: `2-wide center obstacle (<${round(recovery * 1000)}ms)`,
            value: result,
            symbol: 'error',
         },
      ];
   }

   return [];
}

export default tool;
