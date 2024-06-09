import { EventList } from '../../beatmap/shared/environment.ts';
import type { EnvironmentAllName } from '../../types/beatmap/shared/environment.ts';
import type { IWrapColorBoostEvent } from '../../types/beatmap/wrapper/colorBoostEvent.ts';
import type { IWrapEvent } from '../../types/beatmap/wrapper/event.ts';
import type { ICountEvent } from './types/stats.ts';

/**
 * Count number of type of events with their properties in given array and return a event count object.
 * ```ts
 * const list = count(events);
 * console.log(list);
 * ```
 */
export function countEvent(
   events: IWrapEvent[],
   boost: IWrapColorBoostEvent[],
   environment: EnvironmentAllName = 'DefaultEnvironment',
): ICountEvent {
   const commonEvent = EventList[environment]?.[0] ?? EventList['DefaultEnvironment'][0];
   const eventCount: ICountEvent = {};
   for (let i = commonEvent.length - 1; i >= 0; i--) {
      eventCount[commonEvent[i]] = {
         total: 0,
         chroma: 0,
         chromaOld: 0,
      };
   }

   eventCount[5] = {
      total: boost.length,
      chroma: 0,
      chromaOld: 0,
   };

   for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].isValidType()) {
         if (!eventCount[events[i].type]) {
            eventCount[events[i].type] = {
               total: 0,
               chroma: 0,
               chromaOld: 0,
            };
         }
         eventCount[events[i].type].total++;
         if (events[i].check()) {
            eventCount[events[i].type].chroma++;
         }
         if (events[i].isOldChroma()) {
            eventCount[events[i].type].chromaOld++;
         }
      }
   }
   return eventCount;
}
