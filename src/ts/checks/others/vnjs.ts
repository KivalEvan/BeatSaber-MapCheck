import { NoteJumpSpeed } from 'bsmap';
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
import { PrecalculateKey } from '../../types/precalculate';

const name = 'Variable NJS';
const description = 'Look for appropriate variable NJS by change speed and relative NJS from base.';
const enabled = false;

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

const tool: ICheck = {
   name,
   description,
   type: CheckType.OTHER,
   order: {
      input: CheckInputOrder.OTHERS_NJS,
      output: CheckOutputOrder.OTHERS_NJS,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function run(args: CheckArgs): ICheckOutput[] {
   const { njs } = args.beatmap;
   const njsEvents = args.beatmap.data.difficulty.njsEvents;

   const results: ICheckOutput[] = [];

   const slowVNJS = njsEvents.filter((n) => !n.previous && njs.value + n.value < 4);
   if (slowVNJS.length) {
      results.push({
         status: OutputStatus.WARNING,
         label: 'Very slow vNJS',
         type: OutputType.TIME,
         value: slowVNJS,
      });
   }

   const highVNJS = njsEvents.filter((n) => !n.previous && njs.value + n.value > 24);
   if (highVNJS.length) {
      results.push({
         status: OutputStatus.WARNING,
         label: 'Very high vNJS',
         type: OutputType.TIME,
         value: highVNJS,
      });
   }

   let currentNjs = njs.value;
   let previousTime = 0;
   const quickNjs = [];
   for (const vNjs of njsEvents) {
      if (vNjs.previous || !vNjs.time) continue;

      const timeDiff = vNjs.customData[PrecalculateKey.SECOND_TIME] - previousTime;
      const njsDiff = njs.value + vNjs.value - currentNjs;
      const rate = njsDiff / timeDiff;
      if (Math.abs(rate) > 2) {
         quickNjs.push(vNjs);
      }
      previousTime = vNjs.customData[PrecalculateKey.SECOND_TIME];
      currentNjs = njs.value + vNjs.value;
   }
   if (quickNjs.length) {
      results.push({
         status: OutputStatus.WARNING,
         label: 'Quick vNJS change',
         type: OutputType.TIME,
         value: quickNjs,
      });
   }

   return results;
}

export default tool;
