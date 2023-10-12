import { BasicEvent } from '../../beatmap/v3/basicEvent';
import { EnvironmentAllName } from '../../types/beatmap/shared/environment';
import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import UICheckbox from '../../ui/helpers/checkbox';
import { printResult } from '../helpers';

const name = 'Insufficient Lighting Event';
const description = 'Check if there is enough light event.';
const enabled = true;

const tool: Tool = {
   name,
   description,
   type: 'event',
   order: {
      input: ToolInputOrder.EVENTS_INSUFFICIENT_LIGHT,
      output: ToolOutputOrder.EVENTS_INSUFFICIENT_LIGHT,
   },
   input: {
      enabled,
      params: {},
      html: UICheckbox.create(name, description, enabled, function (this: HTMLInputElement) {
         tool.input.enabled = this.checked;
      }),
   },
   output: {
      html: null,
   },
   run,
};

function sufficientLight(events: BasicEvent[], environment: EnvironmentAllName): boolean {
   let count = 0;
   for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].isLightEvent(environment) && !events[i].isOff()) {
         count++;
         if (count > 10) {
            return true;
         }
      }
   }
   return false;
}

function run(map: ToolArgs) {
   if (!map.difficulty) {
      console.error('Something went wrong!');
      return;
   }
   const env =
      map.difficulty.characteristic === '360Degree' || map.difficulty.characteristic === '90Degree'
         ? map.info.allDirectionsEnvironmentName
         : map.info.environmentName;
   const result = sufficientLight(map.difficulty.data.basicEvents, env);

   if (!result) {
      if (
         env === 'DefaultEnvironment' ||
         env === 'OriginsEnvironment' ||
         env === 'TriangleEnvironment' ||
         env === 'NiceEnvironment' ||
         env === 'BigMirrorEnvironment' ||
         env === 'DragonsEnvironment' ||
         env === 'KDAEnvironment' ||
         env === 'MonstercatEnvironment' ||
         env === 'CrabRaveEnvironment' ||
         env === 'PanicEnvironment' ||
         env === 'RocketEnvironment' ||
         env === 'GreenDayEnvironment' ||
         env === 'GreenDayGrenadeEnvironment' ||
         env === 'TimbalandEnvironment' ||
         env === 'FitBeatEnvironment' ||
         env === 'LinkinParkEnvironment' ||
         env === 'BTSEnvironment' ||
         env === 'KaleidoscopeEnvironment' ||
         env === 'InterscopeEnvironment' ||
         env === 'SkrillexEnvironment' ||
         env === 'BillieEnvironment' ||
         env === 'HalloweenEnvironment' ||
         env === 'GagaEnvironment' ||
         env === 'GlassDesertEnvironment'
      )
         tool.output.html = printResult('Insufficient light event', '', 'rank');
      else
         tool.output.html = printResult(
            'Unknown light event',
            'v3 environment light should be manually checked',
            'rank',
         );
   } else {
      tool.output.html = null;
   }
}

export default tool;
