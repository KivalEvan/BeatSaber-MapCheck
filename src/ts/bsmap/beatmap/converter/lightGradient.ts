import logger from '../../logger.ts';
import { EasingsFn } from '../../utils/easings.ts';
import { lerpColor } from '../../utils/colors.ts';
import { normalize } from '../../utils/math.ts';
import type { IWrapBeatmap } from '../../types/beatmap/wrapper/beatmap.ts';
import type { IChromaLightGradient } from '../../types/beatmap/v2/custom/chroma.ts';
import type { IWrapEvent } from '../../types/beatmap/wrapper/event.ts';
import type { Easings } from '../../types/easings.ts';
import { BasicEvent } from '../core/event.ts';

function tag(name: string): string[] {
   return ['convert', name];
}

function isLightGradient(obj: unknown): obj is IChromaLightGradient {
   return typeof obj === 'object' && obj != null && '_startColor' in obj && '_endColor' in obj;
}

/**
 * Convert Chroma light gradient to transition event.
 * ```ts
 * const newData = convert.V2ogChromaToChroma(oldData);
 * ```
 */
export function chromaLightGradientToVanillaGradient<T extends IWrapBeatmap>(data: T): T {
   logger.tWarn(
      tag('chromaLightGradientToVanillaGradient'),
      'Converting chroma light gradient is not fully tested and may break certain lightshow effect!',
   );

   const events = data.basicEvents;
   const newEvents: typeof data.basicEvents = [];
   for (let curr = 0, len = events.length; curr < len; curr++) {
      const ev = events[curr];
      if (!ev.isLightEvent()) {
         newEvents.push(ev);
         continue;
      }
      if (isLightGradient(ev.customData._lightGradient)) {
         const eventInGradient = [] as typeof events;
         for (let next = curr + 1; next < len; next++) {
            if (ev.type !== events[next].type) {
               continue;
            }
            if (ev.time + ev.customData._lightGradient._duration >= events[next].time) {
               eventInGradient.push(events[next]);
            }
         }
         if (eventInGradient.length) {
            ev.customData._color = ev.customData._lightGradient._startColor;
            ev.customData._easing = ev.customData._lightGradient._easing;
            ev.value = ev.value >= 1 && ev.value <= 4 ? 1 : ev.value >= 5 && ev.value <= 8 ? 5 : 9;
            const easing =
               EasingsFn[(ev.customData._lightGradient._easing as Easings) ?? 'easeLinear'];
            let hasOff = false;
            let previousEvent: IWrapEvent = ev;
            for (const eig of eventInGradient) {
               if (!hasOff && eig.time > ev.time + ev.customData._lightGradient._duration - 0.001) {
                  newEvents.push(
                     new BasicEvent({
                        time: ev.time + ev.customData._lightGradient._duration - 0.001,
                        type: ev.type,
                        value:
                           ev.value >= 1 && ev.value <= 4
                              ? 4
                              : ev.value >= 5 && ev.value <= 8
                                ? 8
                                : 12,
                        floatValue: 1,
                        customData: {
                           _color: ev.customData._lightGradient._endColor,
                        },
                     }),
                  );
               } else {
                  eig.value = hasOff
                     ? eig.value >= 1 && eig.value <= 4
                        ? 1
                        : eig.value >= 5 && eig.value <= 8
                          ? 5
                          : 9
                     : eig.value >= 1 && eig.value <= 4
                       ? 4
                       : eig.value >= 5 && eig.value <= 8
                         ? 8
                         : 12;
                  eig.customData!._color = lerpColor(
                     ev.customData._lightGradient._startColor,
                     ev.customData._lightGradient._endColor,
                     normalize(eig.time, ev.time, ev.time + ev.customData._lightGradient._duration),
                     'rgba',
                     easing,
                  );
                  if (eig.value === 0) {
                     eig.removeCustomData('_color');
                     if (!hasOff) {
                        newEvents.push(
                           new BasicEvent({
                              time: eig.time - 0.001,
                              type: ev.type,
                              value:
                                 previousEvent.value >= 1 && previousEvent.value <= 4
                                    ? 4
                                    : previousEvent.value >= 5 && previousEvent.value <= 8
                                      ? 8
                                      : 12,
                              floatValue: 1,
                              customData: {
                                 _color: lerpColor(
                                    ev.customData._lightGradient._startColor,
                                    ev.customData._lightGradient._endColor,
                                    normalize(
                                       eig.time - 0.001,
                                       ev.time,
                                       ev.time + ev.customData._lightGradient._duration,
                                    ),
                                    'rgba',
                                    easing,
                                 ),
                              },
                           }),
                        );
                     }
                     hasOff = true;
                  } else {
                     hasOff = false;
                  }
               }
               previousEvent = eig;
            }
            ev.removeCustomData('_lightGradient');
         } else {
            ev.customData._color = ev.customData._lightGradient._startColor;
            ev.customData._easing = ev.customData._lightGradient._easing;
            ev.value = ev.value >= 1 && ev.value <= 4 ? 1 : ev.value >= 5 && ev.value <= 8 ? 5 : 9;
            newEvents.push(
               new BasicEvent({
                  time: ev.time + ev.customData._lightGradient._duration,
                  type: ev.type,
                  value:
                     ev.value >= 1 && ev.value <= 4 ? 4 : ev.value >= 5 && ev.value <= 8 ? 8 : 12,
                  floatValue: 1,
                  customData: {
                     _color: ev.customData._lightGradient._endColor,
                  },
               }),
            );
            ev.removeCustomData('_lightGradient');
         }
      }
      newEvents.push(ev);
   }
   data.basicEvents = newEvents;
   return data;
}
