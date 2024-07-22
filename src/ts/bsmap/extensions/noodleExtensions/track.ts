import type { INEObject } from './types/object.ts';

export function addTrack(objects: INEObject[], track: string): void;
export function addTrack(objects: INEObject, track: string): void;
export function addTrack(objects: INEObject | INEObject[], track: string): void {
   if (!Array.isArray(objects)) {
      if (!objects.customData) {
         objects.customData = {};
      }

      if (!objects.customData.track) {
         objects.customData.track = track;
      } else if (Array.isArray(objects.customData.track)) {
         if (!objects.customData.track.includes(track)) {
            objects.customData.track.push(track);
         }
      } else if (objects.customData.track !== track) {
         objects.customData.track = [objects.customData.track, track];
      }
      return;
   }
   objects.forEach((obj) => {
      addTrack(obj, track);
   });
}

export function removeTrack(objects: INEObject[], track: string): void;
export function removeTrack(objects: INEObject, track: string): void;
export function removeTrack(objects: INEObject | INEObject[], track: string): void {
   if (!Array.isArray(objects)) {
      if (!objects.customData) {
         return;
      }

      if (!objects.customData.track) {
         return;
      } else if (Array.isArray(objects.customData.track)) {
         if (objects.customData.track.includes(track)) {
            objects.customData.track = objects.customData.track.filter((t: string) => t !== track);
            if (objects.customData.track.length === 1) {
               objects.customData.track = objects.customData.track[0];
            }
         }
      } else if (objects.customData.track === track) {
         delete objects.customData.track;
      }
      return;
   }
   objects.forEach((obj) => {
      removeTrack(obj, track);
   });
}
