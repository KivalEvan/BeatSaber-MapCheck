import { isZeroValueObstacle } from 'bsmap';
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

const name = 'Zero Obstacle';
const description = 'Look for obstacle with zero value.';
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
   type: CheckType.OBSTACLE,
   order: {
      input: CheckInputOrder.OBSTACLES_ZERO,
      output: CheckOutputOrder.OBSTACLES_ZERO,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function check(args: CheckArgs) {
   const { obstacles } = args.beatmap.data.difficulty;
   return obstacles.filter(isZeroValueObstacle);
}

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            status: OutputStatus.ERROR,
            label: 'Zero value obstacle',
            type: OutputType.TIME,
            value: result,
         },
      ];
   }
   return [];
}

export default tool;
