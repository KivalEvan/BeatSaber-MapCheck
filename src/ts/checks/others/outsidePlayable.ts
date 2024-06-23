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

function objectBeforeTime(
   tag: string,
   objects: IWrapBaseObject[],
   timeProcessor: TimeProcessor,
   results: IToolOutput[],
) {
   if (objects.length && objects[0].time < 0) {
      results.push({
         type: 'string',
         label: tag + '(s) before start time',
         value: `${round(objects[0].time, 3)} (${toMmss(timeProcessor.toRealTime(objects[0].time))}`,
         symbol: 'error',
      });
   }
}

function objectAfterTime(
   tag: string,
   objects: IWrapBaseObject[],
   bpm: TimeProcessor,
   endTime: number,
   results: IToolOutput[],
) {
   if (objects.length && objects[objects.length - 1].time > endTime) {
      results.push({
         type: 'string',
         label: tag + '(s) after end time',
         value: `${round(objects[objects.length - 1].time, 3)} (${toMmss(
            bpm.toRealTime(objects[objects.length - 1].time),
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
      objectBeforeTime('Note', colorNotes, timeProcessor, results);
      objectBeforeTime('Bomb', bombNotes, timeProcessor, results);
      objectBeforeTime('Obstacle', obstacles, timeProcessor, results);
      objectBeforeTime('Arc', arcs, timeProcessor, results);
      objectBeforeTime('Chain', chains, timeProcessor, results);
      objectBeforeTime('Event', basicEvents, timeProcessor, results);
      objectBeforeTime('Color Boost', colorBoostEvents, timeProcessor, results);
      objectBeforeTime('Waypoint', waypoints, timeProcessor, results);
      objectBeforeTime(
         'Light Color Event Box Group',
         lightColorEventBoxGroups,
         timeProcessor,
         results,
      );
      objectBeforeTime(
         'Light Rotation Event Box Group',
         lightRotationEventBoxGroups,
         timeProcessor,
         results,
      );
      objectBeforeTime(
         'Light Translation Event Box Group',
         lightTranslationEventBoxGroups,
         timeProcessor,
         results,
      );
      objectBeforeTime('FX Event Box Group', fxEventBoxGroups, timeProcessor, results);

      objectAfterTime('Note', colorNotes, timeProcessor, endBeat, results);
      objectAfterTime('Bomb', bombNotes, timeProcessor, endBeat, results);
      objectAfterTime('Obstacle', obstacles, timeProcessor, endBeat, results);
      objectAfterTime('Arc', arcs, timeProcessor, endBeat, results);
      objectAfterTime('Chain', chains, timeProcessor, endBeat, results);
      objectAfterTime('Event', basicEvents, timeProcessor, endBeat, results);
      objectAfterTime('Color Boost', colorBoostEvents, timeProcessor, endBeat, results);
      objectAfterTime('Waypoint', waypoints, timeProcessor, endBeat, results);
      objectAfterTime(
         'Light Color Event Box Group',
         lightColorEventBoxGroups,
         timeProcessor,
         endBeat,
         results,
      );
      objectAfterTime(
         'Light Rotation Event Box Group',
         lightRotationEventBoxGroups,
         timeProcessor,
         endBeat,
         results,
      );
      objectAfterTime(
         'Light Translation Event Box Group',
         lightTranslationEventBoxGroups,
         timeProcessor,
         endBeat,
         results,
      );
      objectAfterTime('FX Event Box Group', fxEventBoxGroups, timeProcessor, endBeat, results);
   }

   return results;
}

export default tool;
