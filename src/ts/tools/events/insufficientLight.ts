import { EnvironmentAllName } from '../../types/beatmap/shared/environment';
import { IWrapEvent } from '../../types/beatmap/wrapper/event';
import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import UIInput from '../../ui/helpers/input';
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

function sufficientLight(events: IWrapEvent[], environment: EnvironmentAllName): boolean {
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
   const env = map.difficulty.environment;
   const result = sufficientLight(map.difficulty.lightshow.basicEvents, env);

   if (!result) {
      switch (env) {
         case 'DefaultEnvironment':
         case 'OriginsEnvironment':
         case 'TriangleEnvironment':
         case 'NiceEnvironment':
         case 'BigMirrorEnvironment':
         case 'DragonsEnvironment':
         case 'KDAEnvironment':
         case 'MonstercatEnvironment':
         case 'CrabRaveEnvironment':
         case 'PanicEnvironment':
         case 'RocketEnvironment':
         case 'GreenDayEnvironment':
         case 'GreenDayGrenadeEnvironment':
         case 'TimbalandEnvironment':
         case 'FitBeatEnvironment':
         case 'LinkinParkEnvironment':
         case 'BTSEnvironment':
         case 'KaleidoscopeEnvironment':
         case 'InterscopeEnvironment':
         case 'SkrillexEnvironment':
         case 'BillieEnvironment':
         case 'HalloweenEnvironment':
         case 'GagaEnvironment':
         case 'GlassDesertEnvironment':
            tool.output.html = printResult('Insufficient light event', '', 'rank');
            break;
         default:
            tool.output.html = printResult(
               'Unknown light event',
               'v3 environment light should be manually checked',
               'rank',
            );
      }
   } else {
      tool.output.html = null;
   }
}

export default tool;
