import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';
import { round, getFirstInteractiveTime } from 'bsmap';

const name = 'Hot Start';
const description = 'Check for first interactive object starting from start time.';
const enabled = true;
const defaultTime = 1.5;

const tool: ITool<{ time: number }> = {
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
   run,
};

function run(args: ToolArgs): IToolOutput[] {
   const { time } = tool.input.params;
   const result = args.beatmap.timeProcessor.toRealTime(getFirstInteractiveTime(args.beatmap.data));

   if (result < time) {
      return [
         {
            type: 'string',
            label: 'Hot start',
            value: `${round(result, 2)}s`,
            symbol: 'warning',
         },
      ];
   }
   return [];
}

export default tool;
