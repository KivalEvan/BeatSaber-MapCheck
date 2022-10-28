import { EventList } from '../../beatmap/shared/environment';
import { BasicEvent } from '../../beatmap/v3/basicEvent';
import { ColorBoostEvent } from '../../beatmap/v3/colorBoostEvent';
import { EnvironmentAllName } from '../../types/beatmap/shared/environment';
import { ICountEvent } from './types/stats';

/** Count number of type of events with their properties in given array and return a event count object.
 * ```ts
 * const list = count(events);
 * console.log(list);
 * ```
 */
export function countEvent(
    events: BasicEvent[],
    boost: ColorBoostEvent[],
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
            if (events[i].isChroma()) {
                eventCount[events[i].type].chroma++;
            }
            if (events[i].isOldChroma()) {
                eventCount[events[i].type].chromaOld++;
            }
        }
    }
    return eventCount;
}
