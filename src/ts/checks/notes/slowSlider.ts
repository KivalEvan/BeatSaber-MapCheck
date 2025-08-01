import { TimeProcessor } from 'bsmap';
import { round } from 'bsmap/utils';
import {
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   ICheck,
   ICheckOutput,
   OutputStatus,
   OutputType,
} from '../../types';
import { UIInput } from '../../ui/helpers/input';

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
      tool.input.params.minSpeed = localBPM.toRealTime(1 / val, false);
      htmlInputMinTime.value = round(tool.input.params.minSpeed * 1000, 1).toString();
      this.value = val.toString();
   },
   ' (prec): ',
   0,
   0,
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
   htmlInputMinTime.value = (tool.input.params.minSpeed * 1000).toString();
   if (timeProcessor) adjustTimeHandler(timeProcessor);
}

const tool: ICheck<{ minSpeed: number }> = {
   name,
   description,
   type: CheckType.NOTE,
   order: {
      input: CheckInputOrder.NOTES_SLOW_SLIDER,
      output: CheckOutputOrder.NOTES_SLOW_SLIDER,
   },
   input: {
      params: {
         enabled,
         minSpeed: defaultSpeed,
      },
      ui: () =>
         UIInput.createBlock(
            htmlEnabled,
            document.createElement('br'),
            htmlLabelMinTime,
            htmlInputMinTime,
            htmlLabelMinPrec,
            htmlInputMinPrec,
         ),
      update,
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

function check(args: CheckArgs) {
   const { swingAnalysis } = args.beatmap;
   const { minSpeed } = tool.input.params;

   return swingAnalysis.container.filter((s) => s.maxSpeed > minSpeed || s.minSpeed > minSpeed);
}

function run(args: CheckArgs): ICheckOutput[] {
   const { minSpeed } = tool.input.params;
   const result = check(args);

   if (result.length) {
      return [
         {
            status: OutputStatus.WARNING,
            label: `Slow slider (>${round(minSpeed * 1000, 1)}ms)`,
            type: OutputType.TIME,
            value: result.map((n) => n.data[0]),
         },
      ];
   }
   return [];
}

export default tool;
