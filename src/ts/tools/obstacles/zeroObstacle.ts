import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';
import { printResultTime } from '../helpers';

const name = 'Zero Obstacle';
const description = 'Look for obstacle with zero value.';
const enabled = true;

const tool: Tool = {
   name,
   description,
   type: 'obstacle',
   order: {
      input: ToolInputOrder.OBSTACLES_ZERO,
      output: ToolOutputOrder.OBSTACLES_ZERO,
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

function check(args: ToolArgs) {
   const { obstacles } = args.beatmap!.data;
   return obstacles.filter((o) => o.hasZero()).map((o) => o.time);
}

function run(args: ToolArgs) {
   if (!args.beatmap) {
      console.error('Something went wrong!');
      return;
   }
   const result = check(args);

   if (result.length) {
      tool.output.html = printResultTime(
         'Zero value obstacle',
         result,
         args.settings.timeProcessor,
         'error',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
