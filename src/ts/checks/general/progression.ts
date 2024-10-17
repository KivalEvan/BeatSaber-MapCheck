import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import LoadedData from '../../loadedData';
import UIInput from '../../ui/helpers/input';
import { DifficultyRename } from 'bsmap';
import { round } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { swing } from 'bsmap/extensions';

const name = 'Difficulty Progression';
const description = 'For ranking purpose, check difficuly progression to fit rankability criteria.';
const enabled = true;

const cachedHtmlDiff: { [key in types.DifficultyName]: HTMLInputElement | null } = {
   'Expert+': null,
   ExpertPlus: null,
   Expert: null,
   Hard: null,
   Normal: null,
   Easy: null,
};

const htmlDifficultyList = document.createElement('ul');
const diffList: types.DifficultyName[] = ['ExpertPlus', 'Expert', 'Hard', 'Normal', 'Easy'];
for (const diff of diffList) {
   const [htmlInput, htmlLabel] = UIInput.createCheckbox(
      function (this: HTMLInputElement) {
         tool.input.params[diff] = this.checked;
      },
      DifficultyRename[diff],
      `Toggle check progression for Standard ${DifficultyRename[diff]}`,
      true,
   );
   cachedHtmlDiff[diff] = htmlInput;
   htmlDifficultyList.appendChild(UIInput.createBlock(htmlInput, htmlLabel));
}

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
   for (const diff of diffList) {
      if (cachedHtmlDiff[diff]) cachedHtmlDiff[diff].checked = tool.input.params[diff];
   }
}

const tool: ITool<{ [k in types.DifficultyName]: boolean }> = {
   name,
   description,
   type: 'general',
   order: {
      input: ToolInputOrder.GENERAL_PROGRESSION,
      output: ToolOutputOrder.GENERAL_PROGRESSION,
   },
   input: {
      params: {
         enabled,
         'Expert+': true,
         ExpertPlus: true,
         Expert: true,
         Hard: true,
         Normal: true,
         Easy: true,
      },
      html: UIInput.createBlock(UIInput.createBlock(htmlInput, htmlLabel), htmlDifficultyList),
      update,
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
      .sort((a, b) => b.total.perSecond - a.total.perSecond);
   if (!standardSpsAry.length) {
      return [];
   }
   const targetMinSps = Math.max(
      audioDuration < 120 ? 3.2 : audioDuration < 240 ? 4.2 : 5.2,
      round(swing.getSpsHighest(standardSpsAry) * 0.4, 2),
   );

   const results: IToolOutput[] = [];
   if (audioDuration < 360 && swing.getSpsLowest(standardSpsAry) > targetMinSps) {
      standardSpsAry.forEach((e) => e.total.perSecond);
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
            progMax.result.total.perSecond,
            2,
         )} from ${round(progMax.comparedTo?.total?.perSecond || 0, 2)} ${
            DifficultyRename[progMax.comparedTo!.difficulty]
         }, acceptable range (${round(
            (progMax.comparedTo?.total?.perSecond || 0) * 0.6,
            2,
         )}-${round((progMax.comparedTo?.total.perSecond || 0) * 0.9, 2)})`,
         symbol: 'rank',
      });
   }
   if (progMin && audioDuration < 360) {
      results.push({
         type: 'string',
         label: 'Violates progression',
         value: `${DifficultyRename[progMin.result.difficulty]} has less than 10% SPS drop, ${round(
            progMin.result.total.perSecond,
            2,
         )} from ${round(progMin.comparedTo?.total.perSecond || 0, 2)} ${
            DifficultyRename[progMin.comparedTo!.difficulty]
         }, acceptable range (${round(
            (progMin.comparedTo?.total.perSecond || 0) * 0.6,
            2,
         )}-${round((progMin.comparedTo?.total.perSecond || 0) * 0.9, 2)})`,
         symbol: 'rank',
      });
   }

   return results;
}

export default tool;
