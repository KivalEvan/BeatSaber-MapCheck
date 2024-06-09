import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IDifficulty } from '../../../types/beatmap/v4/difficulty.ts';
import { bombNote } from './bombNote.ts';
import { chain } from './chain.ts';
import { colorNote } from './colorNote.ts';
import { obstacle } from './obstacle.ts';
import { arc } from './arc.ts';
import { rotationEvent } from './rotationEvent.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapBeatmapAttribute } from '../../../types/beatmap/wrapper/beatmap.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../../types/utils.ts';

const defaultValue = {
   version: '4.0.0',
   colorNotes: [],
   bombNotes: [],
   obstacles: [],
   chains: [],
   arcs: [],
   spawnRotations: [],
   colorNotesData: [],
   bombNotesData: [],
   obstaclesData: [],
   chainsData: [],
   arcsData: [],
   spawnRotationsData: [],
   customData: {},
} as DeepRequiredIgnore<IDifficulty, 'customData'>;
export const difficulty: ISchemaContainer<IWrapBeatmapAttribute, IDifficulty> = {
   defaultValue,
   serialize(data: IWrapBeatmapAttribute): IDifficulty {
      const json: Required<IDifficulty> = {
         version: '4.0.0',
         colorNotes: [],
         bombNotes: [],
         obstacles: [],
         chains: [],
         arcs: [],
         spawnRotations: [],
         colorNotesData: [],
         bombNotesData: [],
         obstaclesData: [],
         chainsData: [],
         arcsData: [],
         spawnRotationsData: [],
         customData: deepCopy(data.difficulty.customData),
      };
      for (const jsonObj of data.difficulty.colorNotes.map(colorNote.serialize)) {
         json.colorNotes.push(jsonObj.object);
         jsonObj.object.i = json.colorNotesData.length;
         json.colorNotesData.push(jsonObj.data);
      }
      for (const jsonObj of data.difficulty.bombNotes.map(bombNote.serialize)) {
         json.bombNotes.push(jsonObj.object);
         jsonObj.object.i = json.bombNotesData.length;
         json.bombNotesData.push(jsonObj.data);
      }
      for (const jsonObj of data.difficulty.obstacles.map(obstacle.serialize)) {
         json.obstacles.push(jsonObj.object);
         jsonObj.object.i = json.obstaclesData.length;
         json.obstaclesData.push(jsonObj.data);
      }
      for (const jsonObj of data.difficulty.arcs.map(arc.serialize)) {
         json.arcs.push(jsonObj.object);
         jsonObj.object.ai = json.arcsData.length;
         json.arcsData.push(jsonObj.data);
         jsonObj.object.hi = json.colorNotesData.length;
         json.colorNotesData.push(jsonObj.headData);
         jsonObj.object.ti = json.colorNotesData.length;
         json.colorNotesData.push(jsonObj.tailData);
      }
      for (const jsonObj of data.difficulty.chains.map(chain.serialize)) {
         json.chains.push(jsonObj.object);
         jsonObj.object.i = json.colorNotesData.length;
         json.colorNotesData.push(jsonObj.data);
         jsonObj.object.ci = json.chainsData.length;
         json.chainsData.push(jsonObj.chainData);
      }
      for (const jsonObj of data.difficulty.rotationEvents.map(rotationEvent.serialize)) {
         json.spawnRotations.push(jsonObj.object);
         jsonObj.object.i = json.spawnRotationsData.length;
         json.spawnRotationsData.push(jsonObj.data);
      }
      return json;
   },
   deserialize(data: DeepPartial<IDifficulty> = {}): DeepPartial<IWrapBeatmapAttribute> {
      return {
         version: 4,
         difficulty: {
            colorNotes: (data?.colorNotes ?? defaultValue.colorNotes).map((obj) =>
               colorNote.deserialize({
                  object: obj,
                  data: data?.colorNotesData?.[obj?.i || 0],
               }),
            ),
            bombNotes: (data?.bombNotes ?? defaultValue.bombNotes).map((obj) =>
               bombNote.deserialize({
                  object: obj,
                  data: data?.bombNotesData?.[obj?.i || 0],
               }),
            ),
            obstacles: (data?.obstacles ?? defaultValue.obstacles).map((obj) =>
               obstacle.deserialize({
                  object: obj,
                  data: data?.obstaclesData?.[obj?.i || 0],
               }),
            ),
            arcs: (data?.arcs ?? defaultValue.arcs).map((obj) =>
               arc.deserialize({
                  object: obj,
                  data: data?.arcsData?.[obj?.ai || 0],
                  headData: data?.colorNotesData?.[obj?.hi || 0],
                  tailData: data?.colorNotesData?.[obj?.ti || 0],
               }),
            ),
            chains: (data?.chains ?? defaultValue.chains).map((obj) =>
               chain.deserialize({
                  object: obj,
                  data: data?.colorNotesData?.[obj?.i || 0],
                  chainData: data?.chainsData?.[obj?.ci || 0],
               }),
            ),
            rotationEvents: (data?.spawnRotations ?? defaultValue.spawnRotations).map((obj) =>
               rotationEvent.deserialize({
                  object: obj,
                  data: data?.spawnRotationsData?.[obj?.i || 0],
               }),
            ),
            customData: deepCopy(data?.customData ?? defaultValue.customData),
         },
      };
   },
};
