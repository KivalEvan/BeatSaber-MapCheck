import { BeatPerMinute } from '../../beatmap/shared/bpm';
import { IWrapBaseObject } from '../../types/beatmap/wrapper/baseObject';
import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import UIInput from '../../ui/helpers/input';
import { round, toMmss } from '../../utils';
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
   bpm: BeatPerMinute,
   results: HTMLElement[],
) {
   if (objects.length && objects[0].time < 0) {
      results.push(
         printResult(
            tag + '(s) before start time',
            `${round(objects[0].time, 3)} (${toMmss(bpm.toRealTime(objects[0].time))}`,
            'error',
         ),
      );
   }
}

function objectAfterTime(
   tag: string,
   objects: IWrapBaseObject[],
   bpm: BeatPerMinute,
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

function run(map: ToolArgs) {
   if (!map.difficulty) {
      console.error('Something went wrong!');
      return;
   }
   const { bpm, audioDuration: duration } = map.settings;
   const { colorNotes, bombNotes, obstacles, arcs, chains } = map.difficulty.data;
   const {
      basicEvents,
      colorBoostEvents,
      waypoints,
      lightColorEventBoxGroups,
      lightRotationEventBoxGroups,
      lightTranslationEventBoxGroups,
      fxEventBoxGroups,
   } = map.difficulty.lightshow;

   const htmlResult: HTMLElement[] = [];
   if (duration) {
      let endBeat = bpm.toBeatTime(duration, true);
      objectBeforeTime('Note', colorNotes, bpm, htmlResult);
      objectBeforeTime('Bomb', bombNotes, bpm, htmlResult);
      objectBeforeTime('Obstacle', obstacles, bpm, htmlResult);
      objectBeforeTime('Arc', arcs, bpm, htmlResult);
      objectBeforeTime('Chain', chains, bpm, htmlResult);
      objectBeforeTime('Event', basicEvents, bpm, htmlResult);
      objectBeforeTime('Color Boost', colorBoostEvents, bpm, htmlResult);
      objectBeforeTime('Waypoint', waypoints, bpm, htmlResult);
      objectBeforeTime('Light Color Event Box Group', lightColorEventBoxGroups, bpm, htmlResult);
      objectBeforeTime(
         'Light Rotation Event Box Group',
         lightRotationEventBoxGroups,
         bpm,
         htmlResult,
      );
      objectBeforeTime(
         'Light Translation Event Box Group',
         lightTranslationEventBoxGroups,
         bpm,
         htmlResult,
      );
      objectBeforeTime('FX Event Box Group', fxEventBoxGroups, bpm, htmlResult);

      objectAfterTime('Note', colorNotes, bpm, endBeat, htmlResult);
      objectAfterTime('Bomb', bombNotes, bpm, endBeat, htmlResult);
      objectAfterTime('Obstacle', obstacles, bpm, endBeat, htmlResult);
      objectAfterTime('Arc', arcs, bpm, endBeat, htmlResult);
      objectAfterTime('Chain', chains, bpm, endBeat, htmlResult);
      objectAfterTime('Event', basicEvents, bpm, endBeat, htmlResult);
      objectAfterTime('Color Boost', colorBoostEvents, bpm, endBeat, htmlResult);
      objectAfterTime('Waypoint', waypoints, bpm, endBeat, htmlResult);
      objectAfterTime(
         'Light Color Event Box Group',
         lightColorEventBoxGroups,
         bpm,
         endBeat,
         htmlResult,
      );
      objectAfterTime(
         'Light Rotation Event Box Group',
         lightRotationEventBoxGroups,
         bpm,
         endBeat,
         htmlResult,
      );
      objectAfterTime(
         'Light Translation Event Box Group',
         lightTranslationEventBoxGroups,
         bpm,
         endBeat,
         htmlResult,
      );
      objectAfterTime('FX Event Box Group', fxEventBoxGroups, bpm, endBeat, htmlResult);
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
