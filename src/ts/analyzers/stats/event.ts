import { EventList } from '../../beatmap/shared/environment';
import { BasicEvent } from '../../beatmap/v3/basicEvent';
import { EnvironmentAllName } from '../../types/beatmap/shared/environment';
import { IEventCount } from '../../types/mapcheck/analyzers/stats';

/** Count number of type of events with their properties in given array and return a event count object.
 * ```ts
 * const list = count(events);
 * console.log(list);
 * ```
 */
export const countEvent = (
    events: BasicEvent[],
    environment: EnvironmentAllName = 'DefaultEnvironment'
): IEventCount => {
    const commonEvent =
        EventList[environment]?.[0] ?? EventList['DefaultEnvironment'][0];
    const eventCount: IEventCount = {};
    for (let i = commonEvent.length - 1; i >= 0; i--) {
        eventCount[commonEvent[i]] = {
            total: 0,
            chroma: 0,
            chromaOld: 0,
        };
    }

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
            if (events[i].hasChroma()) {
                eventCount[events[i].type].chroma++;
            }
            if (events[i].hasOldChroma()) {
                eventCount[events[i].type].chromaOld++;
            }
        }
    }
    return eventCount;
};
