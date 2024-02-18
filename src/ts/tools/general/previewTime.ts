import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import UIInput from '../../ui/helpers/input';
import { printResult } from '../helpers';

const name = 'Preview Time';
const description = 'Warn default editor preview time.';
const enabled = true;

const tool: Tool = {
   name,
   description,
   type: 'general',
   order: {
      input: ToolInputOrder.GENERAL_PREVIEW_TIME,
      output: ToolOutputOrder.GENERAL_PREVIEW_TIME,
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
   output: {
      html: null,
   },
   run,
};

function run(map: ToolArgs) {
   const { previewStartTime, previewDuration } = map.info.audio;

   if (previewStartTime === 12 && previewDuration === 10) {
      tool.output.html = printResult(
         'Default preview time',
         "strongly recommended to set for audience's 1st impression",
         'info',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
