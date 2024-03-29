import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { round } from '../../utils';
import { printResultTime } from '../helpers';
import UIInput from '../../ui/helpers/input';
import { BeatPerMinute } from '../../beatmap/shared/bpm';

const name = 'Slow Slider';
const description = 'Look for slider that require slow swing.';
const enabled = true;
const defaultSpeed = 0.025;

let localBPM!: BeatPerMinute;

const [htmlLabelMinTime, htmlInputMinTime] = UIInput.createNumber(
   function (this: HTMLInputElement) {
      tool.input.params.minSpeed = Math.abs(parseFloat(this.value)) / 1000;
      this.value = round(tool.input.params.minSpeed * 1000, 1).toString();
      if (localBPM) {
         htmlInputMinPrec.value = round(
            1 / localBPM.toBeatTime(tool.input.params.minSpeed),
            2,
         ).toString();
      }
   },
   'min speed (ms): ',
   round(defaultSpeed * 1000, 1),
   0,
);
const [htmlLabelMinPrec, htmlInputMinPrec] = UIInput.createNumber(
   function (this: HTMLInputElement) {
      if (!localBPM) {
         this.value = '0';
         return;
      }
      let val = round(Math.abs(parseFloat(this.value)), 2) || 1;
      tool.input.params.minSpeed = localBPM.toRealTime(1 / val);
      htmlInputMinTime.value = round(tool.input.params.minSpeed * 1000, 1).toString();
      this.value = val.toString();
   },
   ' (prec): ',
   0,
   0,
);

const tool: Tool<{ minSpeed: number }> = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_SLOW_SLIDER,
      output: ToolOutputOrder.NOTES_SLOW_SLIDER,
   },
   input: {
      enabled,
      params: {
         minSpeed: defaultSpeed,
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
         htmlLabelMinTime,
         htmlInputMinTime,
         htmlLabelMinPrec,
         htmlInputMinPrec,
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
   htmlInputMinPrec.value = round(
      1 / localBPM.toBeatTime(tool.input.params.minSpeed),
      2,
   ).toString();
}

function check(map: ToolArgs) {
   const { swingAnalysis } = map.difficulty!;
   const { minSpeed } = tool.input.params;

   return swingAnalysis.container
      .filter((s) => s.maxSpeed > minSpeed || s.minSpeed > minSpeed)
      .map((n) => n.time)
      .filter((x, i, ary) => {
         return !i || x !== ary[i - 1];
      });
}

function run(map: ToolArgs) {
   if (!map.difficulty) {
      console.error('Something went wrong!');
      return;
   }
   const { minSpeed } = tool.input.params;
   const result = check(map);

   if (result.length) {
      tool.output.html = printResultTime(
         `Slow slider (>${round(minSpeed * 1000, 1)}ms)`,
         result,
         map.settings.bpm,
         'warning',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
