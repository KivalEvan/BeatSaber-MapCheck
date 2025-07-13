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

const name = 'Difficulty Label Check';
const description = 'For ranking purpose, check difficulty label to fit rankability criteria.';
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
      input: CheckInputOrder.OTHERS_DIFFICULTY_LABEL,
      output: CheckOutputOrder.OTHERS_DIFFICULTY_LABEL,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function run(args: CheckArgs): ICheckOutput[] {
   const result = args.beatmap.info.customData._difficultyLabel;

   if (result && result.length > 30) {
      return [
         {
            type: OutputType.STRING,
            label: `Difficulty label is too long (${result.length} characters)`,
            value: 'exceeded 30 max characters by ranking criteria',
            status: OutputStatus.RANK,
         },
      ];
   }
   return [];
}

export default tool;
