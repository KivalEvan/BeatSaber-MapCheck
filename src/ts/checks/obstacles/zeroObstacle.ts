import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';

const name = 'Zero Obstacle';
const description = 'Look for obstacle with zero value.';
const enabled = true;

const tool: ITool = {
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
   run,
};

function check(args: ToolArgs) {
   const { obstacles } = args.beatmap.data;
   return obstacles.filter((o) => o.hasZero());
}

function run(args: ToolArgs): IToolOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            type: 'time',
            label: 'Zero value obstacle',
            value: result,
            symbol: 'error',
         },
      ];
   }
   return [];
}

export default tool;
