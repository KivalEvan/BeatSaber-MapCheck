import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';
import { round } from '../../bsmap/utils/mod';
import { printResult } from '../helpers';
import { getFirstInteractiveTime } from '../../bsmap/beatmap/helpers/beatmap';

const name = 'Hot Start';
const description = 'Check for first interactive object starting from start time.';
const enabled = true;
const defaultTime = 1.5;

const tool: Tool<{ time: number }> = {
   name,
   description,
   type: 'other',
   order: {
      input: ToolInputOrder.OTHERS_HOT_START,
      output: ToolOutputOrder.OTHERS_HOT_START,
   },
   input: {
      enabled,
      params: {
         time: defaultTime,
      },
      html: UIInput.createBlock(
         UIInput.createCheckbox(
            function (this: HTMLInputElement) {
               tool.input.enabled = this.checked;
            },
            name + ' (s): ',
            description,
            enabled,
         ),
         UIInput.createNumber(
            function (this: HTMLInputElement) {
               tool.input.params.time = round(Math.abs(parseFloat(this.value)), 3);
               this.value = tool.input.params.time.toString();
            },
            '',
            defaultTime,
            0,
            null,
            0.1,
         ),
      ),
   },
   output: {
      html: null,
   },
   run,
};

function run(args: ToolArgs) {
   if (!args.beatmap) {
      console.error('Something went wrong!');
      return;
   }
   const { time } = tool.input.params;
   const result = args.settings.timeProcessor.toRealTime(
      getFirstInteractiveTime(args.beatmap.data),
   );

   if (result < time) {
      tool.output.html = printResult('Hot start', `${round(result, 2)}s`, 'warning');
   } else {
      tool.output.html = null;
   }
}

export default tool;
