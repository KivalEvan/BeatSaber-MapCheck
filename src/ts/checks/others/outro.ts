import { round } from 'bsmap/utils';
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
import { getLastInteractiveTime } from 'bsmap';
import { PrecalculateKey } from '../../types/precalculate';

const name = 'Quick Outro';
const description = 'Check for last interactive or light event before end.';
const enabled = true;
const defaultMin = 2;
const defaultMax = 15;

const [htmlInput, htmlLabel] = UIInput.createCheckbox(
   function (this: HTMLInputElement) {
      tool.input.params.enabled = this.checked;
   },
   name + ' (s): ',
   description,
   enabled,
);
const [htmlTimeMinLabel, htmlTimeMin] = UIInput.createNumber(
   function (this: HTMLInputElement) {
      tool.input.params.min = round(Math.abs(parseFloat(this.value)), 3);
      this.value = tool.input.params.min.toString();
   },
   'Minimum Interactive Time: ',
   defaultMin,
   0,
   null,
   0.1,
);
const [htmlTimeMaxLabel, htmlTimeMax] = UIInput.createNumber(
   function (this: HTMLInputElement) {
      tool.input.params.max = round(Math.abs(parseFloat(this.value)), 3);
      this.value = tool.input.params.max.toString();
   },
   'Maximum Final Object Time: ',
   defaultMax,
   0,
   null,
   0.1,
);

function update() {
   htmlInput.checked = tool.input.params.enabled;
   htmlTimeMin.value = tool.input.params.min.toString();
   htmlTimeMax.value = tool.input.params.max.toString();
}

const tool: ICheck<{ min: number; max: number }> = {
   name,
   description,
   type: CheckType.OTHER,
   order: {
      input: CheckInputOrder.OTHERS_HOT_START,
      output: CheckOutputOrder.OTHERS_HOT_START,
   },
   input: {
      params: { enabled, min: defaultMin, max: defaultMax },
      ui: () =>
         UIInput.createBlock(
            UIInput.createBlock(htmlInput, htmlLabel),
            UIInput.createBlock(htmlTimeMinLabel, htmlTimeMin),
            UIInput.createBlock(htmlTimeMaxLabel, htmlTimeMax),
         ),
      update,
   },
   run,
};

function run(args: CheckArgs): ICheckOutput[] {
   const { audioDuration, mapDuration } = args;
   const duration = audioDuration || mapDuration || 0;
   if (duration === 0) {
      return [];
   }

   const interactiveOutro = args.beatmap.timeProcessor.toRealTime(
      getLastInteractiveTime(args.beatmap.data),
   );
   const objectOutro = Math.max(
      interactiveOutro,
      args.beatmap.data.lightshow.basicEvents.at(-1)?.customData[PrecalculateKey.SECOND_TIME] || 0,
      args.beatmap.data.lightshow.waypoints.at(-1)?.customData[PrecalculateKey.SECOND_TIME] || 0,
      args.beatmap.data.lightshow.lightColorEventBoxGroups.at(-1)?.customData[
         PrecalculateKey.SECOND_TIME
      ] || 0,
      args.beatmap.data.lightshow.lightRotationEventBoxGroups.at(-1)?.customData[
         PrecalculateKey.SECOND_TIME
      ] || 0,
      args.beatmap.data.lightshow.lightTranslationEventBoxGroups.at(-1)?.customData[
         PrecalculateKey.SECOND_TIME
      ] || 0,
      args.beatmap.data.lightshow.fxEventBoxGroups.at(-1)?.customData[
         PrecalculateKey.SECOND_TIME
      ] || 0,
   );

   const { min, max } = tool.input.params;
   const results: ICheckOutput[] = [];
   if (duration - min <= interactiveOutro) {
      results.push({
         status: OutputStatus.RANK,
         label: 'Quick outro',
         type: OutputType.STRING,
         value: `${round(duration - interactiveOutro, 2)}s`,
      });
   }
   if (duration - max > objectOutro) {
      results.push({
         status: OutputStatus.RANK,
         label: 'Empty outro',
         type: OutputType.STRING,
         value: `${round(duration - objectOutro, 2)}s`,
      });
   }

   return results;
}

export default tool;
