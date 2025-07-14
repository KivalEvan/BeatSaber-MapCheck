import { round, secToMmss } from 'bsmap/utils';
import * as types from 'bsmap/types';
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
import { PrecalculateKey } from '../../types/precalculate';

const name = 'Outside Playable Object';
const description = 'Look for any object starting before and after song timer.';
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
   type: CheckType.OTHER,
   order: {
      input: CheckInputOrder.OTHERS_OUTSIDE_PLAYABLE,
      output: CheckOutputOrder.OTHERS_OUTSIDE_PLAYABLE,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function objectBeforeTime(
   tag: string,
   objects: types.wrapper.IWrapBaseObject[],
   results: ICheckOutput[],
) {
   if (objects.length && objects[0].time < 0) {
      results.push({
         type: OutputType.STRING,
         label: tag + '(s) before start time',
         value: `${round(objects[0].time, 3)} (${secToMmss(
            objects[0].customData[PrecalculateKey.SECOND_TIME],
         )}`,
         status: OutputStatus.ERROR,
      });
   }
}

function objectAfterTime(
   tag: string,
   objects: types.wrapper.IWrapBaseObject[],
   endTime: number,
   results: ICheckOutput[],
) {
   if (objects.length && objects[objects.length - 1].time > endTime) {
      results.push({
         type: OutputType.STRING,
         label: tag + '(s) after end time',
         value: `${round(objects[objects.length - 1].time, 3)} (${secToMmss(
            objects[objects.length - 1].customData[PrecalculateKey.SECOND_TIME],
         )})`,
         status: OutputStatus.ERROR,
      });
   }
}

function run(args: CheckArgs): ICheckOutput[] {
   const duration = args.audioDuration;
   const timeProcessor = args.beatmap.timeProcessor;
   const { colorNotes, bombNotes, obstacles, arcs, chains } = args.beatmap.data.difficulty;
   const {
      basicEvents,
      colorBoostEvents,
      waypoints,
      lightColorEventBoxGroups,
      lightRotationEventBoxGroups,
      lightTranslationEventBoxGroups,
      fxEventBoxGroups,
   } = args.beatmap.data.lightshow;

   const results: ICheckOutput[] = [];
   if (duration) {
      let endBeat = timeProcessor.toBeatTime(duration, true);
      objectBeforeTime('Note', colorNotes, results);
      objectBeforeTime('Bomb', bombNotes, results);
      objectBeforeTime('Obstacle', obstacles, results);
      objectBeforeTime('Arc', arcs, results);
      objectBeforeTime('Chain', chains, results);
      objectBeforeTime('Event', basicEvents, results);
      objectBeforeTime('Color Boost', colorBoostEvents, results);
      objectBeforeTime('Waypoint', waypoints, results);
      objectBeforeTime('Light Color Event Box Group', lightColorEventBoxGroups, results);
      objectBeforeTime('Light Rotation Event Box Group', lightRotationEventBoxGroups, results);
      objectBeforeTime(
         'Light Translation Event Box Group',
         lightTranslationEventBoxGroups,
         results,
      );
      objectBeforeTime('FX Event Box Group', fxEventBoxGroups, results);

      objectAfterTime('Note', colorNotes, endBeat, results);
      objectAfterTime('Bomb', bombNotes, endBeat, results);
      objectAfterTime('Obstacle', obstacles, endBeat, results);
      objectAfterTime('Arc', arcs, endBeat, results);
      objectAfterTime('Chain', chains, endBeat, results);
      objectAfterTime('Event', basicEvents, endBeat, results);
      objectAfterTime('Color Boost', colorBoostEvents, endBeat, results);
      objectAfterTime('Waypoint', waypoints, endBeat, results);
      objectAfterTime('Light Color Event Box Group', lightColorEventBoxGroups, endBeat, results);
      objectAfterTime(
         'Light Rotation Event Box Group',
         lightRotationEventBoxGroups,
         endBeat,
         results,
      );
      objectAfterTime(
         'Light Translation Event Box Group',
         lightTranslationEventBoxGroups,
         endBeat,
         results,
      );
      objectAfterTime('FX Event Box Group', fxEventBoxGroups, endBeat, results);
   }

   return results;
}

export default tool;
