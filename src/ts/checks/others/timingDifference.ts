import { DifficultyRank } from 'bsmap';
import {
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   ICheck,
   ICheckOutput,
   OutputStatus,
   OutputType,
} from '../../types';
import { UIInput } from '../../ui/helpers/input';
import { DifficultyRanking } from 'bsmap';
import { State } from '../../state';

const name = 'Timing Difference';
const description = 'Check for timing difference between current and above difficulty.';
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
   type: CheckType.OTHER,
   order: {
      input: CheckInputOrder.OTHERS_TIMING_DIFFERENCE,
      output: CheckOutputOrder.OTHERS_TIMING_DIFFERENCE,
   },
   input: {
      params: { enabled },
      ui: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function run(args: CheckArgs): ICheckOutput[] {
   const sets = args.info.difficulties
      .filter((d) => d.characteristic === args.beatmap.info.characteristic)
      .sort((a, b) => DifficultyRanking[a.difficulty] - DifficultyRanking[b.difficulty]);

   const difficultyAbove = sets.find(
      (d) => DifficultyRanking[d.difficulty] > DifficultyRanking[args.beatmap.info.difficulty],
   );
   if (!difficultyAbove) {
      return [];
   }

   const beatmapAbove = State.data?.beatmaps?.find(
      (bm) =>
         bm.info.characteristic === difficultyAbove.characteristic &&
         bm.info.difficulty === difficultyAbove.difficulty,
   );
   if (!beatmapAbove) {
      return [];
   }

   const currentTiming = args.beatmap.swingAnalysis.container.map((n) => n);
   const aboveTiming = beatmapAbove.swingAnalysis.container.map((n) => n);

   const difference = new Set(currentTiming.map((n) => n.time)).difference(
      new Set(aboveTiming.map((n) => n.time)),
   );

   if (difference.size) {
      return [
         {
            status: OutputStatus.INFO,
            label: 'Timing difference',
            type: OutputType.TIME,
            value: currentTiming.filter((n) => difference.has(n.time)).map((n) => n.data[0]),
         },
      ];
   }
   return [];
}

export default tool;
