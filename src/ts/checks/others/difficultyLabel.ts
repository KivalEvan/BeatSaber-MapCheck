import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';

const name = 'Difficulty Label Check';
const description = 'For ranking purpose, check difficulty label to fit rankability criteria.';
const enabled = true;

const tool: ITool = {
   name,
   description,
   type: 'other',
   order: {
      input: ToolInputOrder.OTHERS_DIFFICULTY_LABEL,
      output: ToolOutputOrder.OTHERS_DIFFICULTY_LABEL,
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
   const result = args.beatmap.settings.customData._difficultyLabel;

   if (result && result.length > 30) {
      return [
         {
            type: 'string',
            label: `Difficulty label is too long (${result.length} characters)`,
            value: 'exceeded 30 max characters by ranking criteria',
            symbol: 'rank',
         },
      ];
   }
   return [];
}

export default tool;
