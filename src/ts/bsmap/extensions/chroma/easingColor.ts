import type { ApplyEasingsOptions } from './types/colors.ts';
import type { BasicEvent } from '../../beatmap/core/basicEvent.ts';
import type { IChromaEventLight } from '../../types/beatmap/v3/custom/chroma.ts';

export function applyEasingsTransition(events: BasicEvent[], options: ApplyEasingsOptions): void {
   let filteredEvents = events.filter((ev) => ev.isLightEvent() && ev.isOn());
   if (typeof options.type === 'number') {
      filteredEvents = filteredEvents.filter((ev) => ev.type === options.type);
   }
   filteredEvents.forEach((ev) => {
      (ev.customData as IChromaEventLight).easing = options.easing;
   });
}
