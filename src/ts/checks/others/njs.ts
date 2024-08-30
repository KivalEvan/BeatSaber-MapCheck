import { NoteJumpSpeed } from 'bsmap';
import { round } from 'bsmap/utils';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';

const name = 'NJS Check';
const description = 'Check note jump speed for suitable value.';
const enabled = true;

const tool: ITool = {
   name,
   description,
   type: 'other',
   order: {
      input: ToolInputOrder.OTHERS_NJS,
      output: ToolOutputOrder.OTHERS_NJS,
   },
   input: {
      enabled,
      params: {},
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

function run(args: ToolArgs): IToolOutput[] {
   const { njs, timeProcessor } = args.beatmap;

   const results: IToolOutput[] = [];
   if (args.beatmap.settings.njs === 0) {
      results.push({
         type: 'string',
         label: 'Unset NJS',
         value: 'fallback NJS is used',
         symbol: 'error',
      });
   }
   if (njs.value > 23) {
      results.push({
         type: 'string',
         label: `NJS is too high (${round(njs.value, 2)})`,
         value: 'use lower whenever possible',
         symbol: 'warning',
      });
   }
   if (njs.value < 3) {
      results.push({
         type: 'string',
         label: `NJS is too low (${round(njs.value, 2)})`,
         value: 'timing is less significant below this',
         symbol: 'warning',
      });
   }
   if (njs.jd > 36) {
      results.push({
         type: 'string',
         label: 'Very high jump distance',
         value: `${round(njs.jd, 2)}`,
         symbol: 'warning',
      });
   }
   if (njs.jd < 18) {
      results.push({
         type: 'string',
         label: 'Very low jump distance',
         value: `${round(njs.jd, 2)}`,
         symbol: 'warning',
      });
   }
   if (njs.jd > njs.calcJdOptimal()[1]) {
      results.push({
         type: 'string',
         label: `High jump distance warning (>${round(njs.calcJdOptimal()[1], 2)})`,
         value: 'NJS & offset may be uncomfortable to play',
         symbol: 'warning',
      });
   }
   if (timeProcessor.toRealTime(njs.hjd, false) < 0.42) {
      results.push({
         type: 'string',
         label: `Very quick reaction time (${round(
            timeProcessor.toRealTime(njs.hjd, false) * 1000,
         )}ms)`,
         value: 'may lead to suboptimal gameplay',
         symbol: 'warning',
      });
   }
   if (njs.calcHjd(0) + njs.offset < NoteJumpSpeed.HJD_MIN) {
      results.push({
         type: 'string',
         label: 'Unnecessary negative offset',
         value: `will not drop below ${NoteJumpSpeed.HJD_MIN}`,
         symbol: 'warning',
      });
   }

   return results;
}

export default tool;
