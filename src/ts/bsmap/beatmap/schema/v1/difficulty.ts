import type { IDifficulty } from '../../../types/beatmap/v1/difficulty.ts';
import type { IWrapBeatmapAttribute } from '../../../types/beatmap/wrapper/beatmap.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import type { IWrapColorNoteAttribute } from '../../../types/beatmap/wrapper/colorNote.ts';
import type { IWrapBombNoteAttribute } from '../../../types/beatmap/wrapper/bombNote.ts';
import type { IWrapEventAttribute } from '../../../types/beatmap/wrapper/event.ts';
import type { IWrapBPMEventAttribute } from '../../../types/beatmap/wrapper/bpmEvent.ts';
import type { IWrapRotationEventAttribute } from '../../../types/beatmap/wrapper/rotationEvent.ts';
import type { IWrapColorBoostEventAttribute } from '../../../types/beatmap/wrapper/colorBoostEvent.ts';
import { bombNote } from './bombNote.ts';
import { colorNote } from './colorNote.ts';
import { basicEvent } from './basicEvent.ts';
import { colorBoostEvent } from './colorBoostEvent.ts';
import { rotationEvent } from './rotationEvent.ts';
import { bpmEvent } from './bpmEvent.ts';
import { obstacle } from './obstacle.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';

const defaultValue = {
   _version: '1.5.0',
   _beatsPerMinute: 120,
   _beatsPerBar: 4,
   _shuffle: 0,
   _shufflePeriod: 0,
   _noteJumpSpeed: 0,
   _noteJumpStartBeatOffset: 0,
   _notes: [],
   _obstacles: [],
   _events: [],
   _time: 0,
   _BPMChanges: [],
   _bookmarks: [],
} as Required<IDifficulty>;
export const difficulty: ISchemaContainer<IWrapBeatmapAttribute, IDifficulty> = {
   defaultValue,
   serialize(data: IWrapBeatmapAttribute): IDifficulty {
      return {
         _version: '1.5.0',
         // FIXME: none of these shouldve ever existed, why
         _beatsPerMinute: 120,
         _beatsPerBar: 4,
         _shuffle: 0,
         _shufflePeriod: 0.5,
         _noteJumpSpeed: 10,
         _noteJumpStartBeatOffset: 0,
         //
         _notes: [
            ...data.difficulty.colorNotes.map(colorNote.serialize),
            ...data.difficulty.bombNotes.map(bombNote.serialize),
         ],
         _obstacles: data.difficulty.obstacles.map(obstacle.serialize),
         _events: [
            ...data.lightshow.basicEvents.map(basicEvent.serialize),
            ...data.lightshow.colorBoostEvents.map(colorBoostEvent.serialize),
            ...data.difficulty.rotationEvents.map(rotationEvent.serialize),
            ...data.difficulty.bpmEvents.map(bpmEvent.serialize),
         ],
         _time: data.difficulty.customData._time,
         _BPMChanges: data.difficulty.customData._bpmChanges,
         _bookmarks: data.difficulty.customData._bookmarks,
      };
   },
   deserialize(data: DeepPartial<IDifficulty> = {}): DeepPartial<IWrapBeatmapAttribute> {
      const colorNotes: Partial<IWrapColorNoteAttribute>[] = [];
      const bombNotes: Partial<IWrapBombNoteAttribute>[] = [];
      (data._notes ?? defaultValue._notes).forEach((obj) => {
         if (obj?._type === 3) {
            bombNotes.push(bombNote.deserialize(obj));
         } else {
            colorNotes.push(colorNote.deserialize(obj));
         }
      });

      const basicEvents: Partial<IWrapEventAttribute>[] = [];
      const colorBoostEvents: Partial<IWrapColorBoostEventAttribute>[] = [];
      const rotationEvents: Partial<IWrapRotationEventAttribute>[] = [];
      const bpmEvents: Partial<IWrapBPMEventAttribute>[] = [];
      (data._events ?? defaultValue._events).forEach((obj) => {
         switch (obj?._type) {
            case 5:
               colorBoostEvents.push(colorBoostEvent.deserialize(obj));
               break;
            case 14:
            case 15:
               rotationEvents.push(rotationEvent.deserialize(obj));
               break;
            case 100:
            case 10:
               bpmEvents.push(bpmEvent.deserialize(obj));
               break;
            default:
               basicEvents.push(basicEvent.deserialize(obj));
         }
      });

      return {
         version: 1,
         difficulty: {
            colorNotes,
            bombNotes,
            obstacles: (data._obstacles ?? []).map(obstacle.deserialize),
            bpmEvents,
            rotationEvents,
            customData: {
               _bpmChanges: data._BPMChanges ?? defaultValue._BPMChanges,
               _bookmarks: data._bookmarks ?? defaultValue._bookmarks,
               _time: data._time ?? defaultValue._time,
            },
         },
         lightshow: {
            basicEvents,
            colorBoostEvents,
         },
      };
   },
};
