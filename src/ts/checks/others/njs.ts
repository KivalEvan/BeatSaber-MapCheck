import { NoteJumpSpeed } from 'bsmap';
import { round } from 'bsmap/utils';
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

const name = 'NJS Check';
const description = 'Check note jump speed for suitable value.';
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
   const { njs, timeProcessor } = args.beatmap;

   const results: ICheckOutput[] = [];
   if (args.beatmap.info.njs === 0) {
      results.push({
         type: OutputType.STRING,
         label: 'Unset NJS',
         value: 'fallback NJS is used',
         status: OutputStatus.ERROR,
      });
   }
   if (njs.value > 23) {
      results.push({
         type: OutputType.STRING,
         label: `NJS is too high (${round(njs.value, 2)})`,
         value: 'use lower whenever possible',
         status: OutputStatus.WARNING,
      });
   }
   if (njs.value < 3) {
      results.push({
         type: OutputType.STRING,
         label: `NJS is too low (${round(njs.value, 2)})`,
         value: 'timing is less significant below this',
         status: OutputStatus.WARNING,
      });
   }
   if (njs.jd > 36) {
      results.push({
         type: OutputType.STRING,
         label: 'Very high jump distance',
         value: `${round(njs.jd, 2)}`,
         status: OutputStatus.WARNING,
      });
   }
   if (njs.jd < 18) {
      results.push({
         type: OutputType.STRING,
         label: 'Very low jump distance',
         value: `${round(njs.jd, 2)}`,
         status: OutputStatus.WARNING,
      });
   }
   if (njs.jd > njs.calcJdOptimal()[1]) {
      results.push({
         type: OutputType.STRING,
         label: `High jump distance warning (>${round(njs.calcJdOptimal()[1], 2)})`,
         value: 'NJS & offset may be uncomfortable to play',
         status: OutputStatus.WARNING,
      });
   }
   if (timeProcessor.toRealTime(njs.hjd, false) < 0.42) {
      results.push({
         type: OutputType.STRING,
         label: `Very quick reaction time (${round(
            timeProcessor.toRealTime(njs.hjd, false) * 1000,
         )}ms)`,
         value: 'may lead to suboptimal gameplay',
         status: OutputStatus.WARNING,
      });
   }
   if (njs.calcHjd(0) + njs.offset < NoteJumpSpeed.HJD_MIN) {
      results.push({
         type: OutputType.STRING,
         label: 'Unnecessary negative offset',
         value: `will not drop below ${NoteJumpSpeed.HJD_MIN}`,
         status: OutputStatus.WARNING,
      });
   }

   return results;
}

export default tool;
