import { round } from '../../../../utils/math.ts';
import type { IOptimizeOptions } from '../../../../types/beatmap/options/optimize.ts';
import { deepClean, purgeZeros } from '../../../helpers/optimize.ts';
import type { ILightshow } from '../../../../types/beatmap/v3/lightshow.ts';

export function optimizeLightshow(data: ILightshow, options: IOptimizeOptions) {
   // deno-lint-ignore no-explicit-any
   const d = data as Record<string, any>;
   for (let i1 = 0; i1 < d.basicBeatmapEvents!.length; i1++) {
      const o1 = d.basicBeatmapEvents[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
         o1.f = round(o1.f, options.floatTrim);
      }
      deepClean(o1.customData!, `lightshow.basicBeatmapEvents[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      if (options.purgeZeros) purgeZeros(o1);
   }
   for (let i1 = 0; i1 < d.colorBoostBeatmapEvents!.length; i1++) {
      const o1 = d.colorBoostBeatmapEvents[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
      }
      deepClean(o1.customData!, `lightshow.colorBoostBeatmapEvents[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      if (!o1.o) delete (o1 as Partial<typeof o1>).o;
      if (options.purgeZeros) purgeZeros(o1);
   }
   for (let i1 = 0; i1 < d.lightColorEventBoxGroups!.length; i1++) {
      const o1 = d.lightColorEventBoxGroups[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
      }
      for (let i2 = 0; i2 < o1.e!.length; i2++) {
         const o2 = o1.e[i2];
         if (options.floatTrim) {
            o2.r = round(o2.r, options.floatTrim);
            o2.w = round(o2.w, options.floatTrim);
            o2.f.l = round(o2.f.l, options.floatTrim);
         }
         for (let i3 = 0; i3 < o2.e!.length; i3++) {
            const o3 = o2.e[i3];
            if (options.floatTrim) {
               o3.b = round(o3.b, options.floatTrim);
               o3.s = round(o3.s, options.floatTrim);
               o3.sb = round(o3.sb, options.floatTrim);
            }
            deepClean(
               o3.customData!,
               `lightshow.lightColorEventBoxGroups[${i1}].e[${i2}].e[${i3}].customData`,
               options,
            );
            if (!Object.keys(o3.customData!).length) {
               delete o3.customData;
            }
            if (options.purgeZeros) purgeZeros(o3);
         }
         deepClean(
            o2.f.customData!,
            `lightshow.lightRotationEventBoxGroups[${i2}].e[${i2}].customData`,
            options,
         );
         if (!Object.keys(o2.f.customData!).length) {
            delete o2.f.customData;
         }
         if (options.purgeZeros) purgeZeros(o2.f);
         deepClean(
            o2.customData!,
            `lightshow.lightColorEventBoxGroups[${i1}].e[${i2}].customData`,
            options,
         );
         if (!Object.keys(o2.customData!).length) {
            delete o2.customData;
         }
         if (options.purgeZeros) purgeZeros(o2);
      }
      deepClean(o1.customData!, `lightshow.lightColorEventBoxGroups[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      if (options.purgeZeros) purgeZeros(o1);
   }
   for (let i1 = 0; i1 < d.lightRotationEventBoxGroups!.length; i1++) {
      const o1 = d.lightRotationEventBoxGroups[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
      }
      for (let i2 = 0; i2 < o1.e!.length; i2++) {
         const o2 = o1.e[i2];
         if (options.floatTrim) {
            o2.s = round(o2.s, options.floatTrim);
            o2.w = round(o2.w, options.floatTrim);
            o2.f.l = round(o2.f.l, options.floatTrim);
         }
         for (let i3 = 0; i3 < o2.l!.length; i3++) {
            const o3 = o2.l[i3];
            if (options.floatTrim) {
               o3.b = round(o3.b, options.floatTrim);
               o3.r = round(o3.r, options.floatTrim);
            }
            deepClean(
               o3.customData!,
               `lightshow.lightRotationEventBoxGroups[${i3}].e[${i2}].l[${i3}].customData`,
               options,
            );
            if (!Object.keys(o3.customData!).length) {
               delete o3.customData;
            }
            if (options.purgeZeros) purgeZeros(o3);
         }
         deepClean(
            o2.f.customData!,
            `lightshow.lightRotationEventBoxGroups[${i2}].e[${i2}].customData`,
            options,
         );
         if (!Object.keys(o2.f.customData!).length) {
            delete o2.f.customData;
         }
         if (options.purgeZeros) purgeZeros(o2.f);
         deepClean(
            o2.customData!,
            `lightshow.lightRotationEventBoxGroups[${i2}].e[${i2}].customData`,
            options,
         );
         if (!Object.keys(o2.customData!).length) {
            delete o2.customData;
         }
         if (options.purgeZeros) purgeZeros(o2);
      }
      deepClean(o1.customData!, `lightshow.lightRotationEventBoxGroups[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      if (options.purgeZeros) purgeZeros(o1);
   }
   for (let i1 = 0; i1 < d.lightTranslationEventBoxGroups!.length; i1++) {
      const o1 = d.lightTranslationEventBoxGroups[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
      }
      for (let i2 = 0; i2 < o1.e!.length; i2++) {
         const o2 = o1.e[i2];
         if (options.floatTrim) {
            o2.s = round(o2.s, options.floatTrim);
            o2.w = round(o2.w, options.floatTrim);
            o2.f.l = round(o2.f.l, options.floatTrim);
         }
         for (let i3 = 0; i3 < o2.l!.length; i3++) {
            const o3 = o2.l[i3];
            if (options.floatTrim) {
               o3.b = round(o3.b, options.floatTrim);
               o3.t = round(o3.t, options.floatTrim);
            }
            deepClean(
               o3.customData!,
               `lightshow.lightTranslationEventBoxGroups[${i1}].e[${i2}].l[${i3}].customData`,
               options,
            );
            if (!Object.keys(o3.customData!).length) {
               delete o3.customData;
            }
            if (options.purgeZeros) purgeZeros(o3);
         }
         deepClean(
            o2.f.customData!,
            `lightshow.lightRotationEventBoxGroups[${i2}].e[${i2}].customData`,
            options,
         );
         if (!Object.keys(o2.f.customData!).length) {
            delete o2.f.customData;
         }
         if (options.purgeZeros) purgeZeros(o2.f);
         deepClean(
            o2.customData!,
            `lightshow.lightTranslationEventBoxGroups[${i1}].e[${i2}].customData`,
            options,
         );
         if (!Object.keys(o2.customData!).length) {
            delete o2.customData;
         }
         if (options.purgeZeros) purgeZeros(o2);
      }
      deepClean(
         o1.customData!,
         `lightshow.lightTranslationEventBoxGroups[${i1}].customData`,
         options,
      );
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      if (options.purgeZeros) purgeZeros(o1);
   }
   for (let i1 = 0; i1 < d.vfxEventBoxGroups!.length; i1++) {
      const o1 = d.vfxEventBoxGroups[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
      }
      for (let i2 = 0; i2 < o1.e!.length; i2++) {
         const o2 = o1.e[i2];
         if (options.floatTrim) {
            o2.s = round(o2.s, options.floatTrim);
            o2.w = round(o2.w, options.floatTrim);
            o2.f.l = round(o2.f.l, options.floatTrim);
         }
         deepClean(
            o2.f.customData!,
            `lightshow.lightRotationEventBoxGroups[${i2}].e[${i2}].customData`,
            options,
         );
         if (!Object.keys(o2.f.customData!).length) {
            delete o2.f.customData;
         }
         if (options.purgeZeros) purgeZeros(o2.f);
         deepClean(
            o2.customData!,
            `lightshow.vfxEventBoxGroups[${i1}].e[${i2}].customData`,
            options,
         );
         if (!Object.keys(o2.customData!).length) {
            delete o2.customData;
         }
         if (options.purgeZeros) purgeZeros(o2);
      }
      deepClean(o1.customData!, `lightshow.vfxEventBoxGroups[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      if (options.purgeZeros) purgeZeros(o1);
   }
   for (let i1 = 0; i1 < d._fxEventsCollection._fl!.length; i1++) {
      const o1 = d._fxEventsCollection._fl[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
         o1.v = round(o1.v, options.floatTrim);
      }
      deepClean(o1.customData!, `lightshow._fxEventsCollection._fl[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      if (options.purgeZeros) purgeZeros(o1);
   }
   for (let i1 = 0; i1 < d._fxEventsCollection._il!.length; i1++) {
      const o1 = d._fxEventsCollection._il[i1];
      if (options.floatTrim) {
         o1.b = round(o1.b, options.floatTrim);
      }
      deepClean(o1.customData!, `lightshow._fxEventsCollection._il[${i1}].customData`, options);
      if (!Object.keys(o1.customData!).length) {
         delete o1.customData;
      }
      if (options.purgeZeros) purgeZeros(o1);
   }
   deepClean(d.customData!, `lightshow.customData`, options);
   if (!Object.keys(d.customData!).length) {
      delete d.customData;
   }
}
