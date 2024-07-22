import type { IDifficulty } from '../../../types/beatmap/v2/difficulty.ts';
import { colorNote } from './colorNote.ts';
import { arc } from './arc.ts';
import { obstacle } from './obstacle.ts';
import { basicEvent } from './basicEvent.ts';
import { waypoint } from './waypoint.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapColorBoostEventAttribute } from '../../../types/beatmap/wrapper/colorBoostEvent.ts';
import type { IWrapBombNoteAttribute } from '../../../types/beatmap/wrapper/bombNote.ts';
import type { IWrapBPMEventAttribute } from '../../../types/beatmap/wrapper/bpmEvent.ts';
import type { IWrapColorNoteAttribute } from '../../../types/beatmap/wrapper/colorNote.ts';
import type { IWrapBasicEventAttribute } from '../../../types/beatmap/wrapper/basicEvent.ts';
import type { IWrapRotationEventAttribute } from '../../../types/beatmap/wrapper/rotationEvent.ts';
import type { IWrapBeatmapAttribute } from '../../../types/beatmap/wrapper/beatmap.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import { basicEventTypesWithKeywords } from './basicEventTypesWithKeywords.ts';
import { bombNote } from './bombNote.ts';
import { colorBoostEvent } from './colorBoostEvent.ts';
import { rotationEvent } from './rotationEvent.ts';
import { bpmEvent } from './bpmEvent.ts';
import { sortV2NoteFn, sortV2ObjectFn } from '../../helpers/sort.ts';
import { compareVersion } from '../../helpers/version.ts';

export const difficulty: ISchemaContainer<IWrapBeatmapAttribute, IDifficulty> = {
   serialize(data: IWrapBeatmapAttribute): IDifficulty {
      return {
         _version: '2.6.0',
         _notes: [
            ...data.difficulty.colorNotes.map(colorNote.serialize),
            ...data.difficulty.bombNotes.map(bombNote.serialize),
         ].sort(sortV2NoteFn),
         _sliders: data.difficulty.arcs.map(arc.serialize),
         _obstacles: data.difficulty.obstacles.map(obstacle.serialize),
         _events: [
            ...data.lightshow.basicEvents.map(basicEvent.serialize),
            ...data.lightshow.colorBoostEvents.map(colorBoostEvent.serialize),
            ...data.difficulty.rotationEvents.map(rotationEvent.serialize),
            ...data.difficulty.bpmEvents.map(bpmEvent.serialize),
         ].sort(sortV2ObjectFn),
         _waypoints: data.lightshow.waypoints.map(waypoint.serialize),
         _specialEventsKeywordFilters: basicEventTypesWithKeywords.serialize(
            data.lightshow.basicEventTypesWithKeywords,
         ),
         _customData: deepCopy(data.difficulty.customData),
      };
   },
   deserialize(data: DeepPartial<IDifficulty> = {}): DeepPartial<IWrapBeatmapAttribute> {
      const colorNotes: Partial<IWrapColorNoteAttribute>[] = [];
      const bombNotes: Partial<IWrapBombNoteAttribute>[] = [];
      const _notes = data._notes || [];
      for (let i = 0; i < _notes.length; i++) {
         const obj = _notes[i];
         if (obj?._type === 3) {
            bombNotes.push(bombNote.deserialize(obj));
         } else {
            colorNotes.push(colorNote.deserialize(obj));
         }
      }

      const preV25 = compareVersion(data._version || '2.0.0', '2.5.0');
      const basicEvents: Partial<IWrapBasicEventAttribute>[] = [];
      const colorBoostEvents: Partial<IWrapColorBoostEventAttribute>[] = [];
      const rotationEvents: Partial<IWrapRotationEventAttribute>[] = [];
      const bpmEvents: Partial<IWrapBPMEventAttribute>[] = [];
      const _events = data._events || [];
      for (let i = 0; i < _events.length; i++) {
         const obj = _events[i];
         switch (obj?._type) {
            case 5:
               colorBoostEvents.push(colorBoostEvent.deserialize(obj));
               break;
            case 14:
            case 15:
               rotationEvents.push(rotationEvent.deserialize(obj));
               break;
            case 100:
               bpmEvents.push(bpmEvent.deserialize(obj));
               break;
            default: {
               const evt = basicEvent.deserialize(obj);
               if (preV25 < 0) {
                  if (obj._type === 10) {
                     bpmEvents.push(bpmEvent.deserialize(obj));
                  } else {
                     evt.floatValue = 1;
                     basicEvents.push(evt);
                  }
               } else {
                  basicEvents.push(evt);
               }
            }
         }
      }

      return {
         version: 2,
         difficulty: {
            colorNotes,
            bombNotes,
            obstacles: data._obstacles?.map(obstacle.deserialize),
            bpmEvents,
            rotationEvents,
            customData: data._customData,
         },
         lightshow: {
            basicEvents,
            colorBoostEvents,
            waypoints: data._waypoints?.map(waypoint.deserialize),
            basicEventTypesWithKeywords: basicEventTypesWithKeywords.deserialize(
               data._specialEventsKeywordFilters,
            ),
         },
      };
   },
};
