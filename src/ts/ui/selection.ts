import LoadedData from '../loadedData';
import UIInformation from './information';
import { CharacteristicRename } from '../bsmap/beatmap/shared/characteristic';
import { DifficultyRename } from '../bsmap/beatmap/shared/difficulty';
import { CharacteristicName } from '../bsmap/types/beatmap/shared/characteristic';
import { DifficultyName } from '../bsmap/types/beatmap/shared/difficulty';
import { IWrapInfo } from '../bsmap/types/beatmap/wrapper/info';
import { createTab } from './helpers/tab';

const htmlSelectCharacteristic: HTMLDivElement = document.querySelector('#select-characteristic')!;
const htmlSelectDifficulty: HTMLDivElement = document.querySelector('#select-difficulty')!;

let htmlLoadedCharacteristic: HTMLInputElement[] = [];
let htmlLoadedDifficulty: HTMLInputElement[] = [];

export const selectionOnChangeHandlers: ((
   characteristic?: CharacteristicName,
   difficulty?: DifficultyName,
) => void)[] = [];

function populateSelectCharacteristic(beatmapInfo?: IWrapInfo): void {
   while (htmlSelectCharacteristic.firstChild) {
      htmlSelectCharacteristic.removeChild(htmlSelectCharacteristic.firstChild);
   }
   htmlLoadedCharacteristic = [];
   while (htmlSelectDifficulty.firstChild) {
      htmlSelectDifficulty.removeChild(htmlSelectDifficulty.firstChild);
   }
   htmlLoadedDifficulty = [];
   if (!beatmapInfo) {
      const htmlDiv = document.createElement('div');
      htmlDiv.className = 'selection__content';
      const htmlSpan = document.createElement('span');
      htmlSpan.textContent = 'Empty';
      htmlDiv.appendChild(htmlSpan);
      htmlSelectCharacteristic.appendChild(htmlDiv);
      populateSelectDifficulty();
      return;
   }
   let first = true;
   const addedCharacteristic = new Set();
   beatmapInfo.difficulties.forEach((infoDiff) => {
      if (addedCharacteristic.has(infoDiff.characteristic)) return;
      addedCharacteristic.add(infoDiff.characteristic);
      const characteristicLabel = infoDiff.customData._characteristicLabel
         ? `${infoDiff.customData._characteristicLabel}\n(${CharacteristicRename[infoDiff.characteristic] || infoDiff.characteristic})`
         : CharacteristicRename[infoDiff.characteristic] || infoDiff.characteristic;
      const htmlSelect = createTab(
         `select-${infoDiff.characteristic}`,

         characteristicLabel,
         'select-characteristic',
         infoDiff.characteristic,
         first,
         selectCharacteristicHandler,
      );
      htmlLoadedCharacteristic.push(htmlSelect.firstChild as HTMLInputElement);
      htmlSelectCharacteristic.appendChild(htmlSelect);
      if (first) {
         populateSelectDifficulty(infoDiff.characteristic);
         first = false;
      }
   });
   if (htmlLoadedCharacteristic.length === 0) {
      const htmlDiv = document.createElement('div');
      htmlDiv.className = 'selection__content';
      const htmlSpan = document.createElement('span');
      htmlSpan.textContent = 'Empty';
      htmlDiv.appendChild(htmlSpan);
      htmlSelectCharacteristic.appendChild(htmlDiv);
      populateSelectDifficulty();
   }
}

function populateSelectDifficulty(characteristic?: CharacteristicName): void {
   const beatmapInfo = LoadedData.beatmapInfo;
   let prevSelected = getSelectedDifficulty();
   while (htmlSelectDifficulty.firstChild) {
      htmlSelectDifficulty.removeChild(htmlSelectDifficulty.firstChild);
   }
   htmlLoadedDifficulty = [];
   if (!characteristic || !beatmapInfo) {
      const htmlDiv = document.createElement('div');
      htmlDiv.className = 'selection__content';
      const htmlSpan = document.createElement('span');
      htmlSpan.textContent = 'Empty';
      htmlDiv.appendChild(htmlSpan);
      htmlSelectDifficulty.appendChild(htmlDiv);
      return;
   }
   const targetIdx = beatmapInfo.difficulties.findIndex(
      (e) => e.difficulty === prevSelected && e.characteristic === characteristic,
   );
   for (let i = 0; i < beatmapInfo.difficulties.length; i++) {
      const diff = beatmapInfo.difficulties[i];
      if (characteristic !== diff.characteristic) continue;
      const difficultyLabel = diff.customData._difficultyLabel
         ? `${diff.customData._difficultyLabel}\n(${DifficultyRename[diff.difficulty] || diff.difficulty})`
         : DifficultyRename[diff.difficulty] || diff.difficulty;
      const htmlSelect = createTab(
         `select-${diff.difficulty}`,
         difficultyLabel,
         'select-difficulty',
         diff.difficulty,
         targetIdx === -1 || i === targetIdx,
         selectDifficultyHandler,
      );
      htmlLoadedDifficulty.push(htmlSelect.firstChild as HTMLInputElement);
      htmlSelectDifficulty.appendChild(htmlSelect);
      if (targetIdx === -1 || i === targetIdx) {
         const diffData = LoadedData.beatmaps.find(
            (bm) =>
               bm.settings.difficulty === diff.difficulty &&
               bm.settings.characteristic === beatmapInfo.difficulties[i].characteristic,
         );
         if (!diffData) {
            throw new Error('missing data');
         }
         UIInformation.setDiffInfoTable(LoadedData.beatmapInfo!, diffData);
         selectionOnChangeHandlers.forEach((fn) => fn(diff.characteristic, diff.difficulty));
      }
   }
   if (htmlLoadedDifficulty.length === 0) {
      const htmlDiv = document.createElement('div');
      htmlDiv.className = 'selection__content';
      const htmlSpan = document.createElement('span');
      htmlSpan.textContent = 'Empty';
      htmlDiv.appendChild(htmlSpan);
      htmlSelectDifficulty.appendChild(htmlDiv);
   }
}

function selectCharacteristicHandler(ev: Event): void {
   const target = ev.target as HTMLSelectElement;
   const infoDiff = LoadedData.beatmapInfo?.difficulties.find(
      (elem) => elem.characteristic === target.value,
   );
   populateSelectDifficulty(infoDiff?.characteristic);
}

function selectDifficultyHandler(ev: Event): void {
   const target = ev.target as HTMLSelectElement;
   const infoDiff = LoadedData.beatmapInfo?.difficulties.find(
      (elem) => elem.characteristic === getSelectedCharacteristic(),
   );
   if (!infoDiff) {
      throw new Error('aaaaaaaaaaaaaaaaaaa');
   }
   const diff = LoadedData.beatmaps?.find(
      (bm) =>
         bm.settings.difficulty === target.value &&
         bm.settings.characteristic === infoDiff.characteristic,
   );
   if (diff) {
      UIInformation.setDiffInfoTable(LoadedData.beatmapInfo!, diff);
      selectionOnChangeHandlers.forEach((fn) =>
         fn(diff.settings.characteristic, diff.settings.difficulty),
      );
   }
}

export function getSelectedCharacteristic(): CharacteristicName | null {
   return (
      (htmlLoadedCharacteristic.filter((elem) => elem.checked)[0]?.value as CharacteristicName) ??
      null
   );
}

export function getSelectedDifficulty(): DifficultyName | null {
   return (htmlLoadedDifficulty.filter((elem) => elem.checked)[0]?.value as DifficultyName) ?? null;
}

function reset() {
   populateSelectCharacteristic();
}

export default {
   populateSelectCharacteristic,
   reset,
};
