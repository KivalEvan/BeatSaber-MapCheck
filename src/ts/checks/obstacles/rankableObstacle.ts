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

const name = 'Unrankable Obstacle';
const description = 'Look for non-standard obstacle shape in playable space.';
const enabled = false;

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
      input: CheckInputOrder.OBSTACLES_RANKABLE,
      output: CheckOutputOrder.OBSTACLES_RANKABLE,
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

   const result = [];
   for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];

      if (
         (o.posX < 0 && o.posX + o.width > 0) ||
         (0 <= o.posX &&
            o.posX <= 3 &&
            ((o.posY === 0 && o.height !== 5) ||
               (o.posY === 2 && o.height !== 3) ||
               o.posY === 1 ||
               o.posX + o.width > 4))
      ) {
         result.push(o);
      }
   }
   return result;
}

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            status: OutputStatus.RANK,
            label: 'Unrankable obstacle',
            type: OutputType.TIME,
            value: result,
         },
      ];
   }
   return [];
}

export default tool;
