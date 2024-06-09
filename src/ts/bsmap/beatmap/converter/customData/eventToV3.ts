import type { IEvent } from '../../../types/beatmap/v2/event.ts';
import type { IBasicEvent } from '../../../types/beatmap/v3/basicEvent.ts';
import { renameKey } from './_helpers.ts';

export default function (
   customData?: IEvent['_customData'],
): NonNullable<IBasicEvent['customData']> {
   if (!customData) {
      return {};
   }
   const cd = { ...customData };
   if (!Object.keys(cd).length) {
      return {};
   }

   renameKey(cd, '_color', 'color');
   renameKey(cd, '_lightID', 'lightID');
   renameKey(cd, '_easing', 'easing');
   renameKey(cd, '_lerpType', 'lerpType');
   renameKey(cd, '_nameFilter', 'nameFilter');
   renameKey(cd, '_rotation', 'rotation');
   renameKey(cd, '_step', 'step');
   renameKey(cd, '_prop', 'prop');
   renameKey(cd, '_direction', 'direction');
   renameKey(cd, '_lockPosition', 'lockRotation');

   // special case
   if (typeof cd._preciseSpeed === 'number') cd.speed = cd._preciseSpeed;
   else cd.speed ??= cd._speed;
   delete cd._speed;
   delete cd._preciseSpeed;

   delete cd._propID;
   delete cd._lightGradient;
   delete cd._reset;
   delete cd._counterSpin;
   delete cd._stepMult;
   delete cd._propMult;
   delete cd._speedMult;

   return cd;
}
