import {
   EnvironmentName,
   isFadeEventValue,
   isFlashEventValue,
   isOffEventValue,
   isOnEventValue,
   BasicTrackDefinitions,
   wrapper,
} from 'bsmap';
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
import { PrecalculateKey } from '../../types/precalculate';
import { isLightEvent } from '../../utils/beatmap';

const name = 'Unlit Bomb';
const description = 'Check for lighting around bomb.';
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
      input: CheckInputOrder.EVENTS_UNLIT_BOMB,
      output: CheckOutputOrder.EVENTS_UNLIT_BOMB,
   },
   input: {
      params: { enabled },
      ui: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

const enum LightState {
   OFF = 0,
   FADE = 1,
   ON = 2,
}

// omega scuffed clusterfuck help me pls im cryin rn
const unlitBomb = (
   bombs: wrapper.IWrapBombNote[],
   events: wrapper.IWrapBasicEvent[],
   environment: EnvironmentName,
) => {
   if (!events.length) {
      return [];
   }
   const result: wrapper.IWrapBombNote[] = [];
   const commonEvent = Object.keys(
      BasicTrackDefinitions[environment] ?? BasicTrackDefinitions['DefaultEnvironment'],
   ).map(Number);
   const eventsLight = events
      .filter((ev) => isLightEvent(ev.type, environment) && ev.type in commonEvent)
      .sort((a, b) => a.type - b.type) as wrapper.IWrapBasicEvent[];
   const eventState: {
      [key: number]: {
         state: LightState;
         time: number;
         fadeTime: number;
      };
   } = {
      0: { state: LightState.OFF, time: 0, fadeTime: 0 },
      1: { state: LightState.OFF, time: 0, fadeTime: 0 },
      2: { state: LightState.OFF, time: 0, fadeTime: 0 },
      3: { state: LightState.OFF, time: 0, fadeTime: 0 },
      4: { state: LightState.OFF, time: 0, fadeTime: 0 },
      6: { state: LightState.OFF, time: 0, fadeTime: 0 },
      7: { state: LightState.OFF, time: 0, fadeTime: 0 },
      10: { state: LightState.OFF, time: 0, fadeTime: 0 },
      11: { state: LightState.OFF, time: 0, fadeTime: 0 },
   };
   const eventLitTime: {
      [key: number]: {
         last: [number, boolean];
         states: [number, boolean][];
         localPointer: number;
      };
   } = {};
   commonEvent.forEach((e) => {
      const state = [0, false] as [number, boolean];
      eventLitTime[e] = { last: state, states: [state], localPointer: 0 };
   });
   const fadeTime = 1;
   const reactTime = 0.25;
   for (let i = 0, len = eventsLight.length; i < len; i++) {
      const evt = eventsLight[i];
      if (
         (isOnEventValue(evt.value) || isFlashEventValue(evt.value)) &&
         eventState[evt.type].state !== LightState.ON
      ) {
         eventState[evt.type] = {
            state: LightState.ON,
            time: evt.customData[PrecalculateKey.SECOND_TIME],
            fadeTime: 0,
         };
         if (eventLitTime[evt.type].last[0] >= evt.customData[PrecalculateKey.SECOND_TIME]) {
            const elt = eventLitTime[evt.type].last;
            elt[0] = evt.customData[PrecalculateKey.SECOND_TIME];
            elt[1] = true;
         } else {
            eventLitTime[evt.type].last = [evt.customData[PrecalculateKey.SECOND_TIME], true];
            eventLitTime[evt.type].states.push(eventLitTime[evt.type].last);
         }
      }
      if (isFadeEventValue(evt.value)) {
         eventState[evt.type] = {
            state: LightState.OFF,
            time: evt.customData[PrecalculateKey.SECOND_TIME],
            fadeTime: fadeTime,
         };
         if (eventLitTime[evt.type].last[0] >= evt.customData[PrecalculateKey.SECOND_TIME]) {
            const elt = eventLitTime[evt.type].last;
            elt[1] = true;
         } else {
            eventLitTime[evt.type].last = [evt.customData[PrecalculateKey.SECOND_TIME], true];
            eventLitTime[evt.type].states.push(eventLitTime[evt.type].last);
         }
         eventLitTime[evt.type].last = [
            evt.customData[PrecalculateKey.SECOND_TIME] + fadeTime,
            false,
         ];
         eventLitTime[evt.type].states.push(eventLitTime[evt.type].last);
      }
      if (
         ((evt?.floatValue ?? 1) < 0.25 ||
            isOffEventValue(evt.value) ||
            (evt.customData._color &&
               ((typeof evt.customData._color[3] === 'number' && evt.customData._color[3] < 0.25) ||
                  Math.max(
                     evt.customData._color[0],
                     evt.customData._color[1],
                     evt.customData._color[2],
                  ) < 0.25)) ||
            (evt.customData.color &&
               ((typeof evt.customData.color[3] === 'number' && evt.customData.color[3] < 0.25) ||
                  Math.max(
                     evt.customData.color[0],
                     evt.customData.color[1],
                     evt.customData.color[2],
                  ) < 0.25))) &&
         eventState[evt.type].state !== LightState.OFF
      ) {
         eventState[evt.type] = {
            state: LightState.OFF,
            time: evt.customData[PrecalculateKey.SECOND_TIME],
            fadeTime:
               eventState[evt.type].state === LightState.ON
                  ? reactTime
                  : Math.min(reactTime, eventState[evt.type].fadeTime),
         };
         eventLitTime[evt.type].last = [
            evt.customData[PrecalculateKey.SECOND_TIME] +
               (eventState[evt.type].state === LightState.ON
                  ? reactTime
                  : Math.min(reactTime, eventState[evt.type].fadeTime)),
            false,
         ];
         eventLitTime[evt.type].states.push(eventLitTime[evt.type].last);
      }
   }
   for (let i = 0, len = bombs.length; i < len; i++) {
      const bomb = bombs[i];
      let isLit = false;
      for (const el in eventLitTime) {
         let t = null;
         while (eventLitTime[el].localPointer < eventLitTime[el].states.length) {
            if (
               bomb.customData[PrecalculateKey.SECOND_TIME] - reactTime <
               eventLitTime[el].states[eventLitTime[el].localPointer][0]
            ) {
               break;
            }
            t = eventLitTime[el].states[eventLitTime[el].localPointer];
            eventLitTime[el].localPointer++;
         }
         if (t) {
            isLit = isLit || t[1];
         }
         if (isLit) {
            break;
         }
      }
      if (!isLit) {
         result.push(bomb);
      }
   }
   return result;
};

function run(args: CheckArgs): ICheckOutput[] {
   const result = unlitBomb(
      args.beatmap.data.difficulty.bombNotes,
      args.beatmap.data.lightshow.basicEvents,
      args.beatmap.environment,
   );

   if (result.length) {
      return [
         {
            status: OutputStatus.WARNING,
            label: 'Unlit bomb',
            type: OutputType.TIME,
            value: result,
         },
      ];
   }

   return [];
}

export default tool;
