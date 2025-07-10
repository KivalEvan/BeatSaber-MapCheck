import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
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

const tool: ITool = {
   name,
   description,
   type: 'other',
   order: {
      input: ToolInputOrder.OTHERS_DIFFICULTY_LABEL,
      output: ToolOutputOrder.OTHERS_DIFFICULTY_LABEL,
   },
   input: {
      params: { enabled },
      html: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function run(args: ToolArgs): IToolOutput[] {
   const result = args.beatmap.info.customData._difficultyLabel;

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
