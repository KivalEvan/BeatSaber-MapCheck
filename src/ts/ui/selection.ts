import { State } from '../state';
import { UIInfo } from './information/main';
import { UITab } from './helpers/tab';
import {
   CharacteristicName,
   CharacteristicOrder,
   CharacteristicRename,
   DifficultyName,
   DifficultyRename,
   wrapper,
} from 'bsmap';

export class UISelection {
   static #htmlSelectCharacteristic: HTMLDivElement;
   static #htmlSelectDifficulty: HTMLDivElement;
   static #htmlLoadedCharacteristic: HTMLInputElement[] = [];
   static #htmlLoadedDifficulty: HTMLInputElement[] = [];

   static init(): void {
      UISelection.#htmlSelectCharacteristic = document.querySelector('#select-characteristic')!;
      UISelection.#htmlSelectDifficulty = document.querySelector('#select-difficulty')!;

      UISelection.reset();
   }

   static reset() {
      UISelection.populateSelectCharacteristic();
   }

   static selectionOnChangeHandlers: ((
      characteristic?: CharacteristicName,
      difficulty?: DifficultyName,
   ) => void)[] = [];

   static populateSelectCharacteristic(info?: wrapper.IWrapInfo): void {
      while (UISelection.#htmlSelectCharacteristic.firstChild) {
         UISelection.#htmlSelectCharacteristic.removeChild(
            UISelection.#htmlSelectCharacteristic.firstChild,
         );
      }
      UISelection.#htmlLoadedCharacteristic = [];
      while (UISelection.#htmlSelectDifficulty.firstChild) {
         UISelection.#htmlSelectDifficulty.removeChild(
            UISelection.#htmlSelectDifficulty.firstChild,
         );
      }
      UISelection.#htmlLoadedDifficulty = [];
      if (!info) {
         const htmlDiv = document.createElement('div');
         htmlDiv.className = 'selection__content';
         const htmlSpan = document.createElement('span');
         htmlSpan.textContent = 'Empty';
         htmlDiv.appendChild(htmlSpan);
         UISelection.#htmlSelectCharacteristic.appendChild(htmlDiv);
         UISelection.#populateSelectDifficulty();
         return;
      }
      let first = true;
      const addedCharacteristic = new Set();
      info.difficulties
         .toSorted(
            (a, b) => CharacteristicOrder[a.characteristic] - CharacteristicOrder[b.characteristic],
         )
         .forEach((infoDiff) => {
            if (addedCharacteristic.has(infoDiff.characteristic)) return;
            addedCharacteristic.add(infoDiff.characteristic);
            const customCharacteristic = info.customData._characteristics?.find(
               (e) => e.characteristic === infoDiff.characteristic,
            );
            const characteristicLabel = customCharacteristic
               ? `${customCharacteristic.label}\n(${
                    CharacteristicRename[infoDiff.characteristic] || infoDiff.characteristic
                 })`
               : CharacteristicRename[infoDiff.characteristic] || infoDiff.characteristic;
            const htmlSelect = UITab.create(
               `select-${infoDiff.characteristic}`,
               characteristicLabel,
               'select-characteristic',
               infoDiff.characteristic,
               first,
               UISelection.#selectCharacteristicHandler,
            );
            UISelection.#htmlLoadedCharacteristic.push(htmlSelect.firstChild as HTMLInputElement);
            UISelection.#htmlSelectCharacteristic.appendChild(htmlSelect);
            if (first) {
               UISelection.#populateSelectDifficulty(infoDiff.characteristic);
               first = false;
            }
         });
      if (UISelection.#htmlLoadedCharacteristic.length === 0) {
         const htmlDiv = document.createElement('div');
         htmlDiv.className = 'selection__content';
         const htmlSpan = document.createElement('span');
         htmlSpan.textContent = 'Empty';
         htmlDiv.appendChild(htmlSpan);
         UISelection.#htmlSelectCharacteristic.appendChild(htmlDiv);
         UISelection.#populateSelectDifficulty();
      }
   }

   static #populateSelectDifficulty(characteristic?: CharacteristicName): void {
      const beatmapInfo = State.data.info;
      let prevSelected = UISelection.getSelectedDifficulty();
      while (UISelection.#htmlSelectDifficulty.firstChild) {
         UISelection.#htmlSelectDifficulty.removeChild(
            UISelection.#htmlSelectDifficulty.firstChild,
         );
      }
      UISelection.#htmlLoadedDifficulty = [];
      if (!characteristic || !beatmapInfo) {
         const htmlDiv = document.createElement('div');
         htmlDiv.className = 'selection__content';
         const htmlSpan = document.createElement('span');
         htmlSpan.textContent = 'Empty';
         htmlDiv.appendChild(htmlSpan);
         UISelection.#htmlSelectDifficulty.appendChild(htmlDiv);
         return;
      }
      const targetIdx = beatmapInfo.difficulties.findIndex(
         (e) => e.difficulty === prevSelected && e.characteristic === characteristic,
      );
      let firstDefaultSelected = false;
      for (let i = 0; i < beatmapInfo.difficulties.length; i++) {
         const diff = beatmapInfo.difficulties[i];
         if (characteristic !== diff.characteristic) continue;
         const difficultyLabel = diff.customData._difficultyLabel
            ? `${diff.customData._difficultyLabel}\n(${
                 DifficultyRename[diff.difficulty] || diff.difficulty
              })`
            : DifficultyRename[diff.difficulty] || diff.difficulty;
         const isSelected = targetIdx === -1 ? !firstDefaultSelected : i === targetIdx;
         if (targetIdx === -1 && isSelected) {
            firstDefaultSelected = true;
         }
         const htmlSelect = UITab.create(
            `select-${diff.difficulty}`,
            difficultyLabel,
            'select-difficulty',
            diff.difficulty,
            isSelected,
            UISelection.#selectDifficultyHandler,
         );
         UISelection.#htmlLoadedDifficulty.push(htmlSelect.firstChild as HTMLInputElement);
         UISelection.#htmlSelectDifficulty.appendChild(htmlSelect);
         if (isSelected) {
            const diffData = State.data.beatmaps.find(
               (bm) =>
                  bm.info.difficulty === diff.difficulty &&
                  bm.info.characteristic === beatmapInfo.difficulties[i].characteristic,
            );
            if (!diffData) {
               throw new Error('missing data');
            }
            UIInfo.setDiffInfoTable(State.data.info!, diffData);
            UISelection.selectionOnChangeHandlers.forEach((fn) =>
               fn(diff.characteristic, diff.difficulty),
            );
         }
      }
      if (UISelection.#htmlLoadedDifficulty.length === 0) {
         const htmlDiv = document.createElement('div');
         htmlDiv.className = 'selection__content';
         const htmlSpan = document.createElement('span');
         htmlSpan.textContent = 'Empty';
         htmlDiv.appendChild(htmlSpan);
         UISelection.#htmlSelectDifficulty.appendChild(htmlDiv);
      }
   }

   static #selectCharacteristicHandler(ev: Event): void {
      const target = ev.target as HTMLSelectElement;
      const infoDiff = State.data.info?.difficulties.find(
         (elem) => elem.characteristic === target.value,
      );
      UISelection.#populateSelectDifficulty(infoDiff?.characteristic);
   }

   static #selectDifficultyHandler(ev: Event): void {
      const target = ev.target as HTMLSelectElement;
      const infoDiff = State.data.info?.difficulties.find(
         (elem) => elem.characteristic === UISelection.getSelectedCharacteristic(),
      );
      if (!infoDiff) {
         throw new Error('aaaaaaaaaaaaaaaaaaa');
      }
      const diff = State.data.beatmaps?.find(
         (bm) =>
            bm.info.difficulty === target.value &&
            bm.info.characteristic === infoDiff.characteristic,
      );
      if (diff) {
         UIInfo.setDiffInfoTable(State.data.info!, diff);
         UISelection.selectionOnChangeHandlers.forEach((fn) =>
            fn(diff.info.characteristic, diff.info.difficulty),
         );
      }
   }

   static getSelectedCharacteristic(): CharacteristicName | null {
      return (
         (UISelection.#htmlLoadedCharacteristic.filter((elem) => elem.checked)[0]
            ?.value as CharacteristicName) ?? null
      );
   }

   static getSelectedDifficulty(): DifficultyName | null {
      return (
         (UISelection.#htmlLoadedDifficulty.filter((elem) => elem.checked)[0]
            ?.value as DifficultyName) ?? null
      );
   }
}
