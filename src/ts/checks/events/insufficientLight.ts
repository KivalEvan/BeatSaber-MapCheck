import {
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   ICheck,
   ICheckOutput,
   OutputStatus,
   OutputType,
} from '../../types';
import { UIInput } from '../../ui/helpers/input';
import {
   EnvironmentName,
   isOffEventValue,
   isV2Environment,
   wrapper,
} from 'bsmap';
import { isLightEvent } from '../../utils/beatmap';

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
   input: {
      params: { enabled },
      ui: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function sufficientLight(events: wrapper.IWrapBasicEvent[], environment: EnvironmentName): boolean {
   let count = 0;
   for (let i = events.length - 1; i >= 0; i--) {
      if (isLightEvent(events[i].type, environment) && !isOffEventValue(events[i].value)) {
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
      if (isV2Environment(env))
         return [
            {
               status: OutputStatus.RANK,
               label: 'Insufficient light event',
               type: OutputType.STRING,
               value: '',
            },
         ];
      else
         return [
            {
               status: OutputStatus.RANK,
               label: 'Unknown light event',
               type: OutputType.STRING,
               value: 'v3 environment light should be manually checked',
            },
         ];
   }
   return [];
}

export default tool;
