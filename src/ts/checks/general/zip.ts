import { State } from '../../state';
import {
   ICheck,
   ICheckOutput,
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   OutputStatus,
   OutputType,
} from '../../types';
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

const tool: ICheck = {
   name,
   description,
   type: CheckType.GENERAL,
   order: {
      input: CheckInputOrder.GENERAL_ZIP,
      output: CheckOutputOrder.GENERAL_ZIP,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function run(args: CheckArgs): ICheckOutput[] {
   if (State.flag.nested) {
      return [
         {
            status: OutputStatus.ERROR,
            label: 'Beatmap in folder ZIP',
            type: OutputType.STRING,
            value: 'Info file and the rest should be in the root of zip file.',
         },
      ];
   }
   return [];
}

export default tool;
