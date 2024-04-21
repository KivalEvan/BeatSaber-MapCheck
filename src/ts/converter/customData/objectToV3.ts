import type { ICustomDataBase } from '../../types/beatmap/shared/custom/customData.ts';
import type { ICustomDataNote } from '../../types/beatmap/v2/custom/note.ts';
import type { ICustomDataObstacle } from '../../types/beatmap/v2/custom/obstacle.ts';
import { renameKey } from './_helpers.ts';

export default function <T extends ICustomDataBase>(
   customData?: ICustomDataNote & ICustomDataObstacle,
): T {
   if (!customData) {
      return {} as T;
   }
   const cd = { ...customData };
   if (!Object.keys(cd).length) {
      return {} as T;
   }

   renameKey(cd, '_color', 'color');
   renameKey(cd, '_position', 'coordinates');
   renameKey(cd, '_disableNoteGravity', 'disableNoteGravity');
   renameKey(cd, '_disableNoteLook', 'disableNoteLook');
   renameKey(cd, '_flip', 'flip');
   renameKey(cd, '_localRotation', 'localRotation');
   renameKey(cd, '_noteJumpMovementSpeed', 'noteJumpMovementSpeed');
   renameKey(cd, '_noteJumpStartBeatOffset', 'noteJumpStartBeatOffset');
   renameKey(cd, '_scale', 'size');
   renameKey(cd, '_track', 'track');
   renameKey(cd, '_rotation', 'worldRotation');

   // special case
   cd.spawnEffect ??=
      typeof cd._disableSpawnEffect === 'boolean' ? !cd._disableSpawnEffect : undefined;
   delete cd._disableSpawnEffect;

   cd.uninteractable ??= typeof cd._interactable === 'boolean' ? !cd._interactable : undefined;
   delete cd._interactable;

   if (cd._animation) {
      cd.animation ??= {
         color: cd._animation._color,
         definitePosition: cd._animation._definitePosition,
         dissolve: cd._animation._dissolve,
         dissolveArrow: cd._animation._dissolveArrow,
         interactable: cd._animation._interactable,
         localRotation: cd._animation._localRotation,
         offsetPosition: cd._animation._position,
         offsetRotation: cd._animation._rotation,
         scale: cd._animation._scale,
         time: cd._animation._time,
      };
   }
   delete cd._animation;

   return cd as T;
}
