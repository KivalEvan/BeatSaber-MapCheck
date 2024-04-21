import type { ICustomDataBase } from '../../types/beatmap/shared/custom/customData.ts';
import type { ICustomDataNote } from '../../types/beatmap/v3/custom/note.ts';
import type { ICustomDataObstacle } from '../../types/beatmap/v3/custom/obstacle.ts';
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

   renameKey(cd, 'color', '_color');
   renameKey(cd, 'coordinates', '_position');
   renameKey(cd, 'disableNoteGravity', '_disableNoteGravity');
   renameKey(cd, 'disableNoteLook', '_disableNoteLook');
   renameKey(cd, 'flip', '_flip');
   renameKey(cd, 'localRotation', '_localRotation');
   renameKey(cd, 'noteJumpMovementSpeed', '_noteJumpMovementSpeed');
   renameKey(cd, 'noteJumpStartBeatOffset', '_noteJumpStartBeatOffset');
   renameKey(cd, 'size', '_scale');
   renameKey(cd, 'track', '_track');
   renameKey(cd, 'worldRotation', '_rotation');

   // special case
   cd._disableSpawnEffect ??= typeof cd.spawnEffect === 'boolean' ? !cd.spawnEffect : undefined;
   delete cd.spawnEffect;

   cd._interactable ??= typeof cd.uninteractable === 'boolean' ? !cd.uninteractable : undefined;
   delete cd.uninteractable;

   if (cd.animation) {
      cd._animation ??= {
         _color: cd.animation.color,
         _definitePosition: cd.animation.definitePosition,
         _dissolve: cd.animation.dissolve,
         _dissolveArrow: cd.animation.dissolveArrow,
         _interactable: cd.animation.interactable,
         _localRotation: cd.animation.localRotation,
         _position: cd.animation.offsetPosition,
         _rotation: cd.animation.offsetRotation,
         _scale: cd.animation.scale,
         _time: cd.animation.time,
      };
   }
   delete cd.animation;

   return cd as T;
}
