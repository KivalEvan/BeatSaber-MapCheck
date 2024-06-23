import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import { round } from '../../bsmap/utils/mod';
import UIInput from '../../ui/helpers/input';
import { TimeProcessor } from '../../bsmap/beatmap/helpers/timeProcessor';

const name = 'Slow Slider';
const description = 'Look for slider that require slow swing.';
const enabled = true;
const defaultSpeed = 0.025;

let localBPM!: TimeProcessor;

const [htmlLabelMinTime, htmlInputMinTime] = UIInput.createNumber(
   function (this: HTMLInputElement) {
      tool.input.params.minSpeed = Math.abs(parseFloat(this.value)) / 1000;
      this.value = round(tool.input.params.minSpeed * 1000, 1).toString();
      if (localBPM) {
         htmlInputMinPrec.value = round(
            1 / localBPM.toBeatTime(tool.input.params.minSpeed, false),
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

const tool: ITool<{ minSpeed: number }> = {
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
   run,
};

function adjustTimeHandler(bpm: TimeProcessor) {
   localBPM = bpm;
   htmlInputMinPrec.value = round(
      1 / localBPM.toBeatTime(tool.input.params.minSpeed, false),
      2,
   ).toString();
}

function check(args: ToolArgs) {
   const { swingAnalysis } = args.beatmap;
   const { minSpeed } = tool.input.params;

   return swingAnalysis.container
      .filter((s) => s.maxSpeed > minSpeed || s.minSpeed > minSpeed)
}

function run(args: ToolArgs): IToolOutput[] {
   const { minSpeed } = tool.input.params;
   const result = check(args);

   if (result.length) {
      return [
         {
            type: 'time',
            label: `Slow slider (>${round(minSpeed * 1000, 1)}ms)`,
            value: result.map(n => n.data[0]),
            symbol: 'warning',
         },
      ];
   }
   return [];
}

export default tool;
