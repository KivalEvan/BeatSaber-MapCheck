import { EventList } from '../../beatmap/shared/environment';
import { EnvironmentAllName } from '../../types/beatmap/shared/environment';
import { IWrapEventBoxGroup } from '../../types/beatmap/wrapper/eventBoxGroup';
import { ICountEventBoxGroup } from './types/stats';

/**
 * Count number of type of events with their properties in given array and return a event count object.
 * ```ts
 * const list = count(events);
 * console.log(list);
 * ```
 */
export function countEbg(
   ebg: IWrapEventBoxGroup[],
   environment: EnvironmentAllName = 'DefaultEnvironment',
): ICountEventBoxGroup {
   const commonEvent = EventList[environment]?.[1] ?? EventList['DefaultEnvironment'][1];
   const ebgCount: ICountEventBoxGroup = {};
   for (let i = commonEvent.length - 1; i >= 0; i--) {
      ebgCount[commonEvent[i]] = {
         groups: 0,
         boxes: 0,
         bases: 0,
      };
   }

   for (let i = ebg.length - 1; i >= 0; i--) {
      if (!ebgCount[ebg[i].id]) {
         ebgCount[ebg[i].id] = {
            groups: 0,
            boxes: 0,
            bases: 0,
         };
      }
      ebgCount[ebg[i].id].groups++;
      ebgCount[ebg[i].id].boxes += ebg[i].boxes.length;
      ebgCount[ebg[i].id].bases += ebg[i].boxes.reduce((t, e) => t + e.events.length, 0);
   }
   return ebgCount;
}
