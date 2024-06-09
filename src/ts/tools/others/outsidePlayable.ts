import { TimeProcessor } from '../../bsmap/beatmap/helpers/timeProcessor';
import { IWrapBaseObject } from '../../bsmap/types/beatmap/wrapper/baseObject';
import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';
import { round, toMmss } from '../../bsmap/utils/mod';
import { printResult } from '../helpers';

const name = 'Outside Playable Object';
const description = 'Look for any object starting before and after song timer.';
const enabled = true;

const tool: Tool = {
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
   output: {
      html: null,
   },
   run,
};

function objectBeforeTime(
   tag: string,
   objects: IWrapBaseObject[],
   timeProcessor: TimeProcessor,
   results: HTMLElement[],
) {
   if (objects.length && objects[0].time < 0) {
      results.push(
         printResult(
            tag + '(s) before start time',
            `${round(objects[0].time, 3)} (${toMmss(timeProcessor.toRealTime(objects[0].time))}`,
            'error',
         ),
      );
   }
}

function objectAfterTime(
   tag: string,
   objects: IWrapBaseObject[],
   bpm: TimeProcessor,
   endTime: number,
   results: HTMLElement[],
) {
   if (objects.length && objects[objects.length - 1].time > endTime) {
      results.push(
         printResult(
            tag + '(s) after end time',
            `${round(objects[objects.length - 1].time, 3)} (${toMmss(
               bpm.toRealTime(objects[objects.length - 1].time),
            )})`,
            'error',
         ),
      );
   }
}

function run(args: ToolArgs) {
   if (!args.beatmap) {
      console.error('Something went wrong!');
      return;
   }
   const { timeProcessor, audioDuration: duration } = args.settings;
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

   const htmlResult: HTMLElement[] = [];
   if (duration) {
      let endBeat = timeProcessor.toBeatTime(duration, true);
      objectBeforeTime('Note', colorNotes, timeProcessor, htmlResult);
      objectBeforeTime('Bomb', bombNotes, timeProcessor, htmlResult);
      objectBeforeTime('Obstacle', obstacles, timeProcessor, htmlResult);
      objectBeforeTime('Arc', arcs, timeProcessor, htmlResult);
      objectBeforeTime('Chain', chains, timeProcessor, htmlResult);
      objectBeforeTime('Event', basicEvents, timeProcessor, htmlResult);
      objectBeforeTime('Color Boost', colorBoostEvents, timeProcessor, htmlResult);
      objectBeforeTime('Waypoint', waypoints, timeProcessor, htmlResult);
      objectBeforeTime(
         'Light Color Event Box Group',
         lightColorEventBoxGroups,
         timeProcessor,
         htmlResult,
      );
      objectBeforeTime(
         'Light Rotation Event Box Group',
         lightRotationEventBoxGroups,
         timeProcessor,
         htmlResult,
      );
      objectBeforeTime(
         'Light Translation Event Box Group',
         lightTranslationEventBoxGroups,
         timeProcessor,
         htmlResult,
      );
      objectBeforeTime('FX Event Box Group', fxEventBoxGroups, timeProcessor, htmlResult);

      objectAfterTime('Note', colorNotes, timeProcessor, endBeat, htmlResult);
      objectAfterTime('Bomb', bombNotes, timeProcessor, endBeat, htmlResult);
      objectAfterTime('Obstacle', obstacles, timeProcessor, endBeat, htmlResult);
      objectAfterTime('Arc', arcs, timeProcessor, endBeat, htmlResult);
      objectAfterTime('Chain', chains, timeProcessor, endBeat, htmlResult);
      objectAfterTime('Event', basicEvents, timeProcessor, endBeat, htmlResult);
      objectAfterTime('Color Boost', colorBoostEvents, timeProcessor, endBeat, htmlResult);
      objectAfterTime('Waypoint', waypoints, timeProcessor, endBeat, htmlResult);
      objectAfterTime(
         'Light Color Event Box Group',
         lightColorEventBoxGroups,
         timeProcessor,
         endBeat,
         htmlResult,
      );
      objectAfterTime(
         'Light Rotation Event Box Group',
         lightRotationEventBoxGroups,
         timeProcessor,
         endBeat,
         htmlResult,
      );
      objectAfterTime(
         'Light Translation Event Box Group',
         lightTranslationEventBoxGroups,
         timeProcessor,
         endBeat,
         htmlResult,
      );
      objectAfterTime('FX Event Box Group', fxEventBoxGroups, timeProcessor, endBeat, htmlResult);
   }

   if (htmlResult.length) {
      const htmlContainer = document.createElement('div');
      htmlResult.forEach((h) => htmlContainer.append(h));
      tool.output.html = htmlContainer;
   } else {
      tool.output.html = null;
   }
}

export default tool;
