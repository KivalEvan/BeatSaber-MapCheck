import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';

const name = 'Preview Time';
const description = 'Warn default editor preview time.';
const enabled = true;

const tool: ITool = {
   name,
   description,
   type: 'general',
   order: {
      input: ToolInputOrder.GENERAL_PREVIEW_TIME,
      output: ToolOutputOrder.GENERAL_PREVIEW_TIME,
   },
   input: {
      params: { enabled },
      html: UIInput.createBlock(
         UIInput.createCheckbox(
            function (this: HTMLInputElement) {
               tool.input.params.enabled = this.checked;
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
   const { previewStartTime, previewDuration } = args.info.audio;

   if (previewStartTime === 12 && previewDuration === 10) {
      return [
         {
            type: 'string',
            label: 'Default preview time',
            value: "strongly recommended to set for audience's 1st impression",
            symbol: 'info',
         },
      ];
   }
   return [];
}

export default tool;
