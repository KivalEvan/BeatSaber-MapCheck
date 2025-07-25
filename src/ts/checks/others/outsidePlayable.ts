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
         status: OutputStatus.ERROR,
         label: tag + '(s) before start time',
         type: OutputType.TIME,
         value: objects.filter((o) => o.time < 0),
      });
   }
}

function objectAfterTime(
   tag: string,
   objects: types.wrapper.IWrapBaseObject[],
   endTime: number,
   results: ICheckOutput[],
) {
   if (
      objects.length &&
      objects[objects.length - 1].customData[PrecalculateKey.SECOND_TIME] > endTime
   ) {
      results.push({
         status: OutputStatus.ERROR,
         label: tag + '(s) after end time',
         type: OutputType.TIME,
         value: objects.filter((o) => o.customData[PrecalculateKey.SECOND_TIME] > endTime),
      });
   }
}

function run(args: CheckArgs): ICheckOutput[] {
   const duration = args.audioDuration;
   const { colorNotes, bombNotes, obstacles, arcs, chains, njsEvents, rotationEvents } =
      args.beatmap.data.difficulty;
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
      let endTime = duration;
      objectBeforeTime('Note', colorNotes, results);
      objectBeforeTime('Bomb', bombNotes, results);
      objectBeforeTime('Obstacle', obstacles, results);
      objectBeforeTime('Arc', arcs, results);
      objectBeforeTime('Chain', chains, results);
      objectBeforeTime('Rotation Event', rotationEvents, results);
      objectBeforeTime('NJS Event', njsEvents, results);
      objectBeforeTime('Basic Event', basicEvents, results);
      objectBeforeTime('Color Boost Event', colorBoostEvents, results);
      objectBeforeTime('Waypoint', waypoints, results);
      objectBeforeTime('Light Color Event Box Group', lightColorEventBoxGroups, results);
      objectBeforeTime('Light Rotation Event Box Group', lightRotationEventBoxGroups, results);
      objectBeforeTime(
         'Light Translation Event Box Group',
         lightTranslationEventBoxGroups,
         results,
      );
      objectBeforeTime('FX Event Box Group', fxEventBoxGroups, results);

      objectAfterTime('Note', colorNotes, endTime, results);
      objectAfterTime('Bomb', bombNotes, endTime, results);
      objectAfterTime('Obstacle', obstacles, endTime, results);
      objectAfterTime('Arc', arcs, endTime, results);
      objectAfterTime('Chain', chains, endTime, results);
      objectAfterTime('Rotation Event', rotationEvents, endTime, results);
      objectAfterTime('NJS Event', njsEvents, endTime, results);
      objectAfterTime('Basic Event', basicEvents, endTime, results);
      objectAfterTime('Color Boost Event', colorBoostEvents, endTime, results);
      objectAfterTime('Waypoint', waypoints, endTime, results);
      objectAfterTime('Light Color Event Box Group', lightColorEventBoxGroups, endTime, results);
      objectAfterTime(
         'Light Rotation Event Box Group',
         lightRotationEventBoxGroups,
         endTime,
         results,
      );
      objectAfterTime(
         'Light Translation Event Box Group',
         lightTranslationEventBoxGroups,
         endTime,
         results,
      );
      objectAfterTime('FX Event Box Group', fxEventBoxGroups, endTime, results);
   }

   return results;
}

export default tool;
