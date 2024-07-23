import { EventList, TimeProcessor, types } from 'bsmap';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';

const name = 'Unlit Bomb';
const description = 'Check for lighting around bomb.';
const enabled = true;

const tool: ITool = {
   name,
   description,
   type: 'event',
   order: {
      input: ToolInputOrder.EVENTS_UNLIT_BOMB,
      output: ToolOutputOrder.EVENTS_UNLIT_BOMB,
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

// omega scuffed clusterfuck help me pls im cryin rn
const unlitBomb = (
   bombs: types.wrapper.IWrapBombNote[],
   events: types.wrapper.IWrapBasicEvent[],
   timeProcessor: TimeProcessor,
   environment: types.EnvironmentAllName,
) => {
   if (!events.length) {
      return [];
   }
   const result: types.wrapper.IWrapBombNote[] = [];
   const commonEvent = EventList[environment]?.[0] ?? EventList['DefaultEnvironment'][0];
   const eventsLight = events
      .filter((ev) => ev.isLightEvent(environment) && commonEvent.includes(ev.type))
      .sort((a, b) => a.type - b.type) as types.wrapper.IWrapBasicEvent[];
   const eventState: {
      [key: number]: {
         state: 'off' | 'fading' | 'on';
         time: number;
         fadeTime: number;
      };
   } = {
      0: { state: 'off', time: 0, fadeTime: 0 },
      1: { state: 'off', time: 0, fadeTime: 0 },
      2: { state: 'off', time: 0, fadeTime: 0 },
      3: { state: 'off', time: 0, fadeTime: 0 },
      4: { state: 'off', time: 0, fadeTime: 0 },
      6: { state: 'off', time: 0, fadeTime: 0 },
      7: { state: 'off', time: 0, fadeTime: 0 },
      10: { state: 'off', time: 0, fadeTime: 0 },
      11: { state: 'off', time: 0, fadeTime: 0 },
   };
   const eventLitTime: {
      [key: number]: [number, boolean][];
   } = {};
   commonEvent.forEach((e) => (eventLitTime[e] = [[0, false]]));
   const fadeTime = timeProcessor.toBeatTime(1, false);
   const reactTime = timeProcessor.toBeatTime(0.25, false);
   for (let i = 0, len = eventsLight.length; i < len; i++) {
      const ev = eventsLight[i];
      if ((ev.isOn() || ev.isFlash()) && eventState[ev.type].state !== 'on') {
         eventState[ev.type] = {
            state: 'on',
            time: ev.time,
            fadeTime: 0,
         };
         const elt = eventLitTime[ev.type].find((e) => e[0] >= ev.time);
         if (elt) {
            elt[0] = ev.time;
            elt[1] = true;
         } else {
            eventLitTime[ev.type].push([ev.time, true]);
         }
      }
      if (ev.isFade()) {
         eventState[ev.type] = {
            state: 'off',
            time: ev.time,
            fadeTime: fadeTime,
         };
         const elt = eventLitTime[ev.type].find((e) => e[0] >= ev.time);
         if (elt) {
            elt[0] = ev.time;
            elt[1] = true;
         } else {
            eventLitTime[ev.type].push([ev.time, true]);
         }
         eventLitTime[ev.type].push([ev.time + fadeTime, false]);
      }
      if (
         ((ev?.floatValue ?? 1) < 0.25 ||
            ev.isOff() ||
            (ev.customData._color &&
               ((typeof ev.customData._color[3] === 'number' && ev.customData._color[3] < 0.25) ||
                  Math.max(
                     ev.customData._color[0],
                     ev.customData._color[1],
                     ev.customData._color[2],
                  ) < 0.25)) ||
            (ev.customData.color &&
               ((typeof ev.customData.color[3] === 'number' && ev.customData.color[3] < 0.25) ||
                  Math.max(ev.customData.color[0], ev.customData.color[1], ev.customData.color[2]) <
                     0.25))) &&
         eventState[ev.type].state !== 'off'
      ) {
         eventState[ev.type] = {
            state: 'off',
            time: ev.time,
            fadeTime:
               eventState[ev.type].state === 'on'
                  ? reactTime
                  : Math.min(reactTime, eventState[ev.type].fadeTime),
         };
         eventLitTime[ev.type].push([
            ev.time +
               (eventState[ev.type].state === 'on'
                  ? reactTime
                  : Math.min(reactTime, eventState[ev.type].fadeTime)),
            false,
         ]);
      }
   }
   for (const el in eventLitTime) {
      eventLitTime[el].reverse();
   }
   for (let i = 0, len = bombs.length, isLit = false; i < len; i++) {
      const note = bombs[i];
      isLit = false;
      // find lit event by time
      for (const el in eventLitTime) {
         const t = eventLitTime[el].find((e) => e[0] <= note.time);
         if (t) {
            isLit = isLit || t[1];
         }
      }
      if (!isLit) {
         result.push(note);
      }
   }
   return result;
};

function run(args: ToolArgs): IToolOutput[] {
   const result = unlitBomb(
      args.beatmap.data.bombNotes,
      args.beatmap.data.basicEvents,
      args.beatmap.timeProcessor,
      args.beatmap.environment,
   );

   if (result.length) {
      return [
         {
            type: 'time',
            label: 'Unlit bomb',
            value: result,
            symbol: 'warning',
         },
      ];
   }

   return [];
}

export default tool;
