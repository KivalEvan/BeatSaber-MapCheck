import flag from '../../flag';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';

const name = 'Beatmap ZIP';
const description = 'Entrypoint not in root directory.';
const enabled = true;

const tool: ITool = {
   name,
   description,
   type: 'general',
   order: {
      input: ToolInputOrder.GENERAL_ZIP,
      output: ToolOutputOrder.GENERAL_ZIP,
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
   if (flag.loading.nested) {
      return [
         {
            type: 'string',
            label: 'Beatmap in folder ZIP',
            value: 'Info file and the rest should be in the root of zip file.',
            symbol: 'error',
         },
      ];
   }
   return [];
}

export default tool;