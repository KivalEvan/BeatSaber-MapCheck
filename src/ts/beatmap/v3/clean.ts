import { round } from '../../utils/math';
import { IDifficulty } from '../../types/beatmap/v3/difficulty';
import { ICleanOptions } from '../../types/beatmap/shared/clean';
import { deepClean } from '../shared/clean';

// deno-lint-ignore no-explicit-any
function purgeZeros(data: Record<string, any>) {
   for (const k in data) {
      if (typeof data[k] === 'number' && data[k] === 0) delete data[k];
   }
}

export function cleanDifficulty(data: IDifficulty, options: ICleanOptions) {
   for (const i1 in data.bpmEvents) {
      const o1 = data.bpmEvents[i1];
      deepClean(o1.customData!, `difficulty.bpmEvents[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      purgeZeros(o1);
   }
   for (const i1 in data.rotationEvents) {
      const o1 = data.rotationEvents[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
         o1.r = round(o1.r, options.floatTrim);
      }
      deepClean(o1.customData!, `difficulty.rotationEvents[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      purgeZeros(o1);
   }
   for (const i1 in data.colorNotes) {
      const o1 = data.colorNotes[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
      }
      deepClean(o1.customData!, `difficulty.colorNotes[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      purgeZeros(o1);
   }
   for (const i1 in data.bombNotes) {
      const o1 = data.bombNotes[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
      }
      deepClean(o1.customData!, `difficulty.bombNotes[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      purgeZeros(o1);
   }
   for (const i1 in data.obstacles) {
      const o1 = data.obstacles[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
         o1.d = round(o1.d, options.floatTrim);
      }
      deepClean(o1.customData!, `difficulty.obstacles[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      purgeZeros(o1);
   }
   for (const i1 in data.sliders) {
      const o1 = data.sliders[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
         o1.tb = round(o1.tb, options.floatTrim);
         o1.mu = round(o1.mu, options.floatTrim);
         o1.tmu = round(o1.tmu, options.floatTrim);
      }
      deepClean(o1.customData!, `difficulty.sliders[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      purgeZeros(o1);
   }
   for (const i1 in data.burstSliders) {
      const o1 = data.burstSliders[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
         o1.tb = round(o1.tb, options.floatTrim);
         o1.s = round(o1.s, options.floatTrim);
      }
      deepClean(o1.customData!, `difficulty.burstSliders[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      purgeZeros(o1);
   }
   for (const i1 in data.waypoints) {
      const o1 = data.waypoints[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
      }
      deepClean(o1.customData!, `difficulty.waypoints[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      purgeZeros(o1);
   }
   for (const i1 in data.basicBeatmapEvents) {
      const o1 = data.basicBeatmapEvents[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
         o1.f = round(o1.f, options.floatTrim);
      }
      deepClean(o1.customData!, `difficulty.basicBeatmapEvents[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      purgeZeros(o1);
   }
   for (const i1 in data.colorBoostBeatmapEvents) {
      const o1 = data.colorBoostBeatmapEvents[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
      }
      deepClean(o1.customData!, `difficulty.colorBoostBeatmapEvents[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      if (!o1.o) delete (o1 as Partial<typeof o1>).o;
      purgeZeros(o1);
   }
   for (const i1 in data.lightColorEventBoxGroups) {
      const o1 = data.lightColorEventBoxGroups[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
      }
      for (const i2 in o1.e) {
         const o2 = o1.e[i2];
         if (options.floatTrim) {
            o2.r = round(o2.r, options.floatTrim);
            o2.w = round(o2.w, options.floatTrim);
            o2.f.l = round(o2.f.l, options.floatTrim);
         }
         for (const i3 in o2.e) {
            const o3 = o2.e[i3];
            if (options.floatTrim) {
               o3.b = round(o3.b, options.floatTrim);
               o3.s = round(o3.s, options.floatTrim);
            }
            deepClean(
               o3.customData!,
               `difficulty.lightColorEventBoxGroups[${i1}].e[${i2}].e[${i3}].customData`,
               options,
            );
            if (!Object.keys(o3.customData!).length) {
               delete o3.customData;
            }
            purgeZeros(o3);
         }
         deepClean(
            o2.f.customData!,
            `difficulty.lightRotationEventBoxGroups[${i2}].e[${i2}].customData`,
            options,
         );
         if (!Object.keys(o2.f.customData!).length) {
            delete o2.f.customData;
         }
         purgeZeros(o2.f);
         deepClean(
            o2.customData!,
            `difficulty.lightColorEventBoxGroups[${i1}].e[${i2}].customData`,
            options,
         );
         if (!Object.keys(o2.customData!).length) {
            delete o2.customData;
         }
         purgeZeros(o2);
      }
      deepClean(o1.customData!, `difficulty.lightColorEventBoxGroups[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      purgeZeros(o1);
   }
   for (const i1 in data.lightRotationEventBoxGroups) {
      const o1 = data.lightRotationEventBoxGroups[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
      }
      for (const i2 in o1.e) {
         const o2 = o1.e[i2];
         if (options.floatTrim) {
            o2.s = round(o2.s, options.floatTrim);
            o2.w = round(o2.w, options.floatTrim);
            o2.f.l = round(o2.f.l, options.floatTrim);
         }
         for (const i3 in o2.l) {
            const o3 = o2.l[i3];
            if (options.floatTrim) {
               o3.b = round(o3.b, options.floatTrim);
               o3.r = round(o3.r, options.floatTrim);
            }
            deepClean(
               o3.customData!,
               `difficulty.lightRotationEventBoxGroups[${i3}].e[${i2}].l[${i3}].customData`,
               options,
            );
            if (!Object.keys(o3.customData!).length) {
               delete o3.customData;
            }
            purgeZeros(o3);
         }
         deepClean(
            o2.f.customData!,
            `difficulty.lightRotationEventBoxGroups[${i2}].e[${i2}].customData`,
            options,
         );
         if (!Object.keys(o2.f.customData!).length) {
            delete o2.f.customData;
         }
         purgeZeros(o2.f);
         deepClean(
            o2.customData!,
            `difficulty.lightRotationEventBoxGroups[${i2}].e[${i2}].customData`,
            options,
         );
         if (!Object.keys(o2.customData!).length) {
            delete o2.customData;
         }
         purgeZeros(o2);
      }
      deepClean(
         o1.customData!,
         `difficulty.lightRotationEventBoxGroups[${i1}].customData`,
         options,
      );
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      purgeZeros(o1);
   }
   for (const i1 in data.lightTranslationEventBoxGroups) {
      const o1 = data.lightTranslationEventBoxGroups[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
      }
      for (const i2 in o1.e) {
         const o2 = o1.e[i2];
         if (options.floatTrim) {
            o2.s = round(o2.s, options.floatTrim);
            o2.w = round(o2.w, options.floatTrim);
            o2.f.l = round(o2.f.l, options.floatTrim);
         }
         for (const i3 in o2.l) {
            const o3 = o2.l[i3];
            if (options.floatTrim) {
               o3.b = round(o3.b, options.floatTrim);
               o3.t = round(o3.t, options.floatTrim);
            }
            deepClean(
               o3.customData!,
               `difficulty.lightTranslationEventBoxGroups[${i1}].e[${i2}].l[${i3}].customData`,
               options,
            );
            if (!Object.keys(o3.customData!).length) {
               delete o3.customData;
            }
            purgeZeros(o3);
         }
         deepClean(
            o2.f.customData!,
            `difficulty.lightRotationEventBoxGroups[${i2}].e[${i2}].customData`,
            options,
         );
         if (!Object.keys(o2.f.customData!).length) {
            delete o2.f.customData;
         }
         purgeZeros(o2.f);
         deepClean(
            o2.customData!,
            `difficulty.lightTranslationEventBoxGroups[${i1}].e[${i2}].customData`,
            options,
         );
         if (!Object.keys(o2.customData!).length) {
            delete o2.customData;
         }
         purgeZeros(o2);
      }
      deepClean(
         o1.customData!,
         `difficulty.lightTranslationEventBoxGroups[${i1}].customData`,
         options,
      );
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      purgeZeros(o1);
   }
   for (const i1 in data.vfxEventBoxGroups) {
      const o1 = data.vfxEventBoxGroups[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
      }
      for (const i2 in o1.e) {
         const o2 = o1.e[i2];
         if (options.floatTrim) {
            o2.s = round(o2.s, options.floatTrim);
            o2.w = round(o2.w, options.floatTrim);
            o2.f.l = round(o2.f.l, options.floatTrim);
         }
         deepClean(
            o2.f.customData!,
            `difficulty.lightRotationEventBoxGroups[${i2}].e[${i2}].customData`,
            options,
         );
         if (!Object.keys(o2.f.customData!).length) {
            delete o2.f.customData;
         }
         purgeZeros(o2.f);
         deepClean(
            o2.customData!,
            `difficulty.vfxEventBoxGroups[${i1}].e[${i2}].customData`,
            options,
         );
         if (!Object.keys(o2.customData!).length) {
            delete o2.customData;
         }
         purgeZeros(o2);
      }
      deepClean(o1.customData!, `difficulty.vfxEventBoxGroups[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      purgeZeros(o1);
   }
   for (const i1 in data._fxEventsCollection._fl) {
      const o1 = data._fxEventsCollection._fl[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
         o1.v = round(o1.v, options.floatTrim);
      }
      deepClean(o1.customData!, `difficulty._fxEventsCollection._fl[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      purgeZeros(o1);
   }
   for (const i1 in data._fxEventsCollection._il) {
      const o1 = data._fxEventsCollection._il[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
      }
      deepClean(o1.customData!, `difficulty._fxEventsCollection._il[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      purgeZeros(o1);
   }
   for (const o1 of data.basicEventTypesWithKeywords.d) {
      if (options.stringTrim) {
         o1.k = o1.k.trim();
      }
   }
   deepClean(data.customData!, `difficulty.customData`, options);
   if (!Object.keys(data.customData!).length) {
      delete data.customData;
   }
}
