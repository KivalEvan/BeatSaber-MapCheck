import { TimeProcessor } from '../../bsmap/beatmap/helpers/timeProcessor';
import { IWrapBaseObject } from '../../bsmap/types/beatmap/wrapper/baseObject';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';
import { round, toMmss } from '../../bsmap/utils/mod';

const name = 'Outside Playable Object';
const description = 'Look for any object starting before and after song timer.';
const enabled = true;

const tool: ITool = {
   name,
   description,
   type: 'other',
   order: {
      input: ToolInputOrder.OTHERS_OUTSIDE_PLAYABLE,
      output: ToolOutputOrder.OTHERS_OUTSIDE_PLAYABLE,
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

function objectBeforeTime(tag: string, objects: IWrapBaseObject[], results: IToolOutput[]) {
   if (objects.length && objects[0].time < 0) {
      results.push({
         type: 'string',
         label: tag + '(s) before start time',
         value: `${round(objects[0].time, 3)} (${toMmss(objects[0].customData.__mapcheck_secondtime)}`,
         symbol: 'error',
      });
   }
}

function objectAfterTime(
   tag: string,
   objects: IWrapBaseObject[],
   endTime: number,
   results: IToolOutput[],
) {
   if (objects.length && objects[objects.length - 1].time > endTime) {
      results.push({
         type: 'string',
         label: tag + '(s) after end time',
         value: `${round(objects[objects.length - 1].time, 3)} (${toMmss(
            objects[objects.length - 1].customData.__mapcheck_secondtime,
         )})`,
         symbol: 'error',
      });
   }
}

function run(args: ToolArgs): IToolOutput[] {
   const duration = args.audioDuration;
   const timeProcessor = args.beatmap.timeProcessor;
   const {
      colorNotes,
      bombNotes,
      obstacles,
      arcs,
      chains,
      basicEvents,
      colorBoostEvents,
      waypoints,
      lightColorEventBoxGroups,
      lightRotationEventBoxGroups,
      lightTranslationEventBoxGroups,
      fxEventBoxGroups,
   } = args.beatmap.data;

   const results: IToolOutput[] = [];
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
