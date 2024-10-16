import {
   IBeatmapItem,
   ITool,
   IToolOutput,
   ToolArgs,
   ToolInputOrder,
   ToolOutputOrder,
} from '../../types';
import UIInput from '../../ui/helpers/input';

const name = 'Varying Swing Speed';
const description = 'Check for varying swing speed due to changes in slider distance.';
const enabled = true;

const tool: ITool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_VARY_SWING,
      output: ToolOutputOrder.NOTES_VARY_SWING,
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

function check(difficulty: IBeatmapItem) {
   const { swingAnalysis } = difficulty;
   return swingAnalysis.container.filter((n) => Math.abs(n.minSpeed - n.maxSpeed) > 0.002);
}

function run(args: ToolArgs): IToolOutput[] {
   const result = check(args.beatmap);

   if (result.length) {
      return [
         {
            type: 'time',
            label: 'Varying swing speed',
            value: result.map((n) => n.data[0]),
            symbol: 'error',
         },
      ];
   }
   return [];
}

export default tool;
