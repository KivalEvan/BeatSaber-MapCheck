import { EnvironmentAllName } from '../../bsmap/types/beatmap/shared/environment';
import { IWrapEvent } from '../../bsmap/types/beatmap/wrapper/event';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';

const name = 'Insufficient Lighting Event';
const description = 'Check if there is enough light event.';
const enabled = true;

const tool: ITool = {
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

function run(args: ToolArgs): IToolOutput[] {
   const env = args.beatmap.environment;
   const result = sufficientLight(args.beatmap.data.basicEvents, env);

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
            return [
               {
                  type: 'string',
                  label: 'Insufficient light event',
                  value: '',
                  symbol: 'rank',
               },
            ];
         default:
            return [
               {
                  type: 'string',
                  label: 'Unknown light event',
                  value: 'v3 environment light should be manually checked',
                  symbol: 'rank',
               },
            ];
      }
   }
   return [];
}

export default tool;
