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
import { isLightEventType, isOffEventValue } from 'bsmap';

const name = 'Insufficient Lighting Event';
const description = 'Check if there is enough light event.';
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
   type: CheckType.EVENT,
   order: {
      input: CheckInputOrder.EVENTS_INSUFFICIENT_LIGHT,
      output: CheckOutputOrder.EVENTS_INSUFFICIENT_LIGHT,
   },
   input: { params: { enabled }, ui: () => UIInput.createBlock(htmlInput, htmlLabel), update },
   run,
};

function sufficientLight(
   events: types.wrapper.IWrapBasicEvent[],
   environment: types.EnvironmentAllName,
): boolean {
   let count = 0;
   for (let i = events.length - 1; i >= 0; i--) {
      if (isLightEventType(events[i].type, environment) && !isOffEventValue(events[i].value)) {
         count++;
         if (count > 10) {
            return true;
         }
      }
   }
   return false;
}

function run(args: CheckArgs): ICheckOutput[] {
   const env = args.beatmap.environment;
   const result = sufficientLight(args.beatmap.data.lightshow.basicEvents, env);

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
                  status: OutputStatus.RANK,
                  label: 'Insufficient light event',
                  type: OutputType.STRING,
                  value: '',
               },
            ];
         default:
            return [
               {
                  status: OutputStatus.RANK,
                  label: 'Unknown light event',
                  type: OutputType.STRING,
                  value: 'v3 environment light should be manually checked',
               },
            ];
      }
   }
   return [];
}

export default tool;
