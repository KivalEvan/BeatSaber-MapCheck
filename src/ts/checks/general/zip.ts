import { State } from '../../state';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import { UIInput } from '../../ui/helpers/input';

const name = 'Beatmap ZIP';
const description = 'Entrypoint not in root directory.';
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

const tool: ITool = {
   name,
   description,
   type: 'general',
   order: {
      input: ToolInputOrder.GENERAL_ZIP,
      output: ToolOutputOrder.GENERAL_ZIP,
   },
   input: {
      params: { enabled },
      html: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function run(args: ToolArgs): IToolOutput[] {
   if (State.flag.nested) {
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
