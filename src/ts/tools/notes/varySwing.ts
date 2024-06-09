import { IBeatmapItem, Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';
import { printResultTime } from '../helpers';

const name = 'Varying Swing Speed';
const description = 'Check for varying swing speed due to changes in slider distance.';
const enabled = true;

const tool: Tool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_VARY_SWING,
      output: ToolOutputOrder.NOTES_VARY_SWING,
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

function check(difficulty: IBeatmapItem) {
   const { swingAnalysis } = difficulty;
   return swingAnalysis.container
      .filter((n) => Math.abs(n.minSpeed - n.maxSpeed) > 0.002)
      .map((n) => n.time)
      .filter((x, i, ary) => {
         return !i || x !== ary[i - 1];
      });
}

function run(args: ToolArgs) {
   if (!args.beatmap) {
      console.error('Something went wrong!');
      return;
   }
   const result = check(args.beatmap);

   if (result.length) {
      tool.output.html = printResultTime(
         'Varying swing speed',
         result,
         args.settings.timeProcessor,
         'error',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
