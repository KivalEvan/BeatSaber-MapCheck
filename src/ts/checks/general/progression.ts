import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import { round } from '../../bsmap/utils/mod';
import LoadedData from '../../loadedData';
import * as swing from '../../bsmap/extensions/swing/mod';
import UIInput from '../../ui/helpers/input';
import { DifficultyRename } from '../../bsmap/beatmap/shared/difficulty';
import { DifficultyName } from '../../bsmap/types/beatmap/shared/difficulty';

const name = 'Difficulty Progression';
const description = 'For ranking purpose, check difficuly progression to fit rankability criteria.';
const enabled = true;

const htmlDifficultyList = document.createElement('ul');
const diffList: DifficultyName[] = ['ExpertPlus', 'Expert', 'Hard', 'Normal', 'Easy'];
for (const diff of diffList) {
   htmlDifficultyList.appendChild(
      UIInput.createBlock(
         UIInput.createCheckbox(
            function (this: HTMLInputElement) {
               tool.input.params[diff] = this.checked;
            },
            DifficultyRename[diff],
            `Toggle check progression for Standard ${DifficultyRename[diff]}`,
            true,
         ),
      ),
   );
}

const tool: ITool<{ [k in DifficultyName]: boolean }> = {
   name,
   description,
   type: 'general',
   order: {
      input: ToolInputOrder.GENERAL_PROGRESSION,
      output: ToolOutputOrder.GENERAL_PROGRESSION,
   },
   input: {
      enabled,
      params: {
         ExpertPlus: true,
         Expert: true,
         Hard: true,
         Normal: true,
         Easy: true,
      },
      html: UIInput.createBlock(
         UIInput.createBlock(
            UIInput.createCheckbox(
               function (this: HTMLInputElement) {
                  tool.input.enabled = this.checked;
               },
               name,
               description,
               enabled,
            ),
         ),
         htmlDifficultyList,
      ),
   },
   run,
};

function run(args: ToolArgs): IToolOutput[] {
   const audioDuration = args.audioDuration;
   if (!audioDuration) {
      return [];
   }
   const standardSpsAry = LoadedData.beatmaps
      .filter((a) => a.settings.characteristic === 'Standard')
      .map((d) => d.swingAnalysis)
      .filter((a) => tool.input.params[a.difficulty] && a.total.total > 0)
      .sort((a, b) => b.total.average - a.total.average);
   if (!standardSpsAry.length) {
      return [];
   }
   const targetMinSps = Math.max(
      audioDuration < 120 ? 3.2 : audioDuration < 240 ? 4.2 : 5.2,
      round(swing.getSpsHighest(standardSpsAry) * 0.4, 2),
   );

   const results: IToolOutput[] = [];
   if (audioDuration < 360 && swing.getSpsLowest(standardSpsAry) > targetMinSps) {
      standardSpsAry.forEach((e) => e.total.average);
      results.push({
         type: 'string',
         label: `Minimum SPS not met (<${targetMinSps})`,
         value: `lowest SPS is ${round(swing.getSpsLowest(standardSpsAry), 2)}, ${round(
            swing.calcSpsTotalPercDrop(standardSpsAry),
            2,
         )}% drop from highest SPS (${round(swing.getSpsHighest(standardSpsAry), 2)})`,
         symbol: 'rank',
      });
   }
   const progMax = swing.getProgressionMax(standardSpsAry, targetMinSps);
   const progMin = swing.getProgressionMin(standardSpsAry, targetMinSps);
   if (progMax && audioDuration < 360) {
      results.push({
         type: 'string',
         label: 'Violates progression',
         value: `${DifficultyRename[progMax.result.difficulty]} exceeded 40% SPS drop, ${round(
            progMax.result.total.average,
            2,
         )} from ${round(progMax.comparedTo?.total?.average || 0, 2)} ${
            DifficultyRename[progMax.comparedTo!.difficulty]
         }, acceptable range (${round(
            (progMax.comparedTo?.total?.average || 0) * 0.6,
            2,
         )}-${round((progMax.comparedTo?.total.average || 0) * 0.9, 2)})`,
         symbol: 'rank',
      });
   }
   if (progMin && audioDuration < 360) {
      results.push({
         type: 'string',
         label: 'Violates progression',
         value: `${DifficultyRename[progMin.result.difficulty]} has less than 10% SPS drop, ${round(
            progMin.result.total.average,
            2,
         )} from ${round(progMin.comparedTo?.total.average || 0, 2)} ${
            DifficultyRename[progMin.comparedTo!.difficulty]
         }, acceptable range (${round(
            (progMin.comparedTo?.total.average || 0) * 0.6,
            2,
         )}-${round((progMin.comparedTo?.total.average || 0) * 0.9, 2)})`,
         symbol: 'rank',
      });
   }

   return results;
}

export default tool;
