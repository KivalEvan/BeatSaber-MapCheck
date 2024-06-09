import type { IBasicEvent } from '../../../types/beatmap/v3/basicEvent.ts';
import type { IEvent } from '../../../types/beatmap/v2/event.ts';
import { renameKey } from './_helpers.ts';

export default function (
   customData?: IBasicEvent['customData'],
): NonNullable<IEvent['_customData']> {
   if (!customData) {
      return {};
   }
   const cd = { ...customData };
   if (!Object.keys(cd).length) {
      return {};
   }

   renameKey(cd, 'color', '_color');
   renameKey(cd, 'lightID', '_lightID');
   renameKey(cd, 'easing', '_easing');
   renameKey(cd, 'lerpType', '_lerpType');
   renameKey(cd, 'nameFilter', '_nameFilter');
   renameKey(cd, 'rotation', '_rotation');
   renameKey(cd, 'step', '_step');
   renameKey(cd, 'prop', '_prop');
   renameKey(cd, 'speed', '_speed');
   renameKey(cd, 'direction', '_direction');
   renameKey(cd, 'lockRotation', '_lockPosition');

   return cd;
}
