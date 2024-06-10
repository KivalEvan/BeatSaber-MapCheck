import LoadedData from '../loadedData';
import Analyser from '../checks/analyzer';
import UILoading from './loading';
import UIInformation from './information';
import { removeOptions } from '../utils/web';
import { TimeProcessor } from '../bsmap/beatmap/helpers/timeProcessor';
import { CharacteristicRename } from '../bsmap/beatmap/shared/characteristic';
import { DifficultyRename } from '../bsmap/beatmap/shared/difficulty';
import { CharacteristicName } from '../bsmap/types/beatmap/shared/characteristic';
import { DifficultyName } from '../bsmap/types/beatmap/shared/difficulty';
import { IWrapInfo } from '../bsmap/types/beatmap/wrapper/info';
import savedData from '../loadedData';

const logPrefix = 'UI Checks: ';

const htmlChecksSelectCharacteristic: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
   '.checks__select-characteristic',
);
const htmlChecksSelectDifficulty: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
   '.checks__select-difficulty',
);
const htmlChecksDifficultyLabel: NodeListOf<HTMLElement> =
   document.querySelectorAll('.difficulty__label');
const htmlChecksNote: HTMLElement = document.querySelector('.checks__note-content')!;
const htmlChecksObstacle: HTMLElement = document.querySelector('.checks__obstacle-content')!;
const htmlChecksEvent: HTMLElement = document.querySelector('.checks__event-content')!;
const htmlChecksOther: HTMLElement = document.querySelector('.checks__other-content')!;
const htmlChecksGeneral: HTMLElement = document.querySelector('.checks__general-content')!;
const htmlChecksOutputDifficulty: HTMLElement = document.querySelector('.checks__output-diff')!;
const htmlChecksOutputGeneral: HTMLElement = document.querySelector('.checks__output-general')!;
const htmlChecksApplyThis: HTMLInputElement = document.querySelector('.checks__apply-this')!;
const htmlChecksApplyAll: HTMLInputElement = document.querySelector('.checks__apply-all')!;
const htmlChecksApplyGeneral: HTMLInputElement = document.querySelector('.checks__apply-general')!;

htmlChecksApplyThis.addEventListener('click', applyThisHandler);
htmlChecksApplyAll.addEventListener('click', applyAllHandler);
htmlChecksApplyGeneral.addEventListener('click', applyGeneralHandler);

htmlChecksSelectCharacteristic.forEach((elem) =>
   elem.addEventListener('change', selectCharacteristicHandler),
);
htmlChecksSelectDifficulty.forEach((elem) =>
   elem.addEventListener('change', selectDifficultyHandler),
);

function displayOutputGeneral(): void {
   const analysis = LoadedData.analysis?.general;
   if (!analysis) {
      htmlChecksOutputGeneral.textContent = 'ERROR: could not find analysis for general';
      return;
   }
   if (!analysis.html) {
      htmlChecksOutputGeneral.textContent = 'ERROR: could not find HTML for general';
      return;
   }
   htmlChecksOutputGeneral.innerHTML = '';
   analysis.html.forEach((h) => htmlChecksOutputGeneral.appendChild(h));
   if (!htmlChecksOutputGeneral.firstChild) {
      htmlChecksOutputGeneral.textContent = 'No issues found.';
   }
}

function displayOutputDifficulty(
   characteristic?: CharacteristicName,
   difficulty?: DifficultyName,
): void {
   if (!characteristic && !difficulty) {
      characteristic = htmlChecksSelectCharacteristic[0].value as CharacteristicName;
      difficulty = htmlChecksSelectDifficulty[0].value as DifficultyName;
   }
   if (!characteristic || !difficulty) {
      throw new Error(logPrefix + 'something went wrong!');
   }
   htmlChecksOutputDifficulty.innerHTML = '';
   const analysis = LoadedData.analysis?.map.find(
      (set) => set.difficulty === difficulty && set.characteristic === characteristic,
   );
   if (!analysis) {
      htmlChecksOutputDifficulty.textContent =
         'ERROR: could not find analysis for ' + characteristic + ' ' + difficulty;
      return;
   }
   if (!analysis.html) {
      htmlChecksOutputDifficulty.textContent =
         'ERROR: could not find HTML for ' + characteristic + ' ' + difficulty;
      return;
   }
   analysis.html.forEach((h) => htmlChecksOutputDifficulty.appendChild(h));
   if (!htmlChecksOutputDifficulty.firstChild) {
      htmlChecksOutputDifficulty.textContent = 'No issues found.';
   }
}

function setDifficultyLabel(str: string): void {
   htmlChecksDifficultyLabel.forEach((elem) => (elem.textContent = str));
}

function populateSelectDifficulty(characteristic?: CharacteristicName): void {
   const mapInfo = savedData.beatmapInfo;
   if (!characteristic || !mapInfo) {
      return;
   }
   htmlChecksSelectDifficulty.forEach((elem) => {
      for (let i = elem.options.length - 1; i >= 0; i--) {
         elem.remove(i);
      }
   });
   let first = true;
   for (let i = mapInfo.difficulties.length - 1; i >= 0; i--) {
      const diff = mapInfo.difficulties[i];
      if (characteristic !== diff.characteristic) continue;
      htmlChecksSelectDifficulty.forEach((elem) => {
         const optDiff = document.createElement('option');
         optDiff.value = diff.difficulty;
         optDiff.textContent =
            DifficultyRename[diff.difficulty] +
            (diff.customData._difficultyLabel ? ' -- ' + diff.customData._difficultyLabel : '');
         if (first) {
            const diffData = LoadedData.beatmaps.find(
               (bm) =>
                  bm.settings.difficulty === diff.difficulty &&
                  bm.settings.characteristic === mapInfo.difficulties[i].characteristic,
            );
            if (!diffData) {
               throw new Error('missing _mapSetData');
            }
            UIInformation.setDiffInfoTable(savedData.beatmapInfo!, diffData);
            setDifficultyLabel(
               diff.customData._difficultyLabel || DifficultyRename[diff.difficulty],
            );
            displayOutputDifficulty(diff.characteristic, diff.difficulty);
         }
         first = false;
         elem.add(optDiff);
      });
   }
}

function populateSelectCharacteristic(mapInfo?: IWrapInfo): void {
   if (!mapInfo) {
      htmlChecksSelectCharacteristic.forEach((elem) => removeOptions(elem));
      htmlChecksSelectDifficulty.forEach((elem) => removeOptions(elem));
      return;
   }
   let first = true;
   const addedCharacteristic = new Set();
   mapInfo.difficulties.forEach((infoDiff) => {
      if (addedCharacteristic.has(infoDiff.characteristic)) return;
      addedCharacteristic.add(infoDiff.characteristic);
      htmlChecksSelectCharacteristic.forEach((elem) => {
         const optCharacteristic = document.createElement('option');
         optCharacteristic.value = infoDiff.characteristic;
         optCharacteristic.textContent = CharacteristicRename[infoDiff.characteristic];
         if (infoDiff.customData._characteristicLabel) {
            optCharacteristic.textContent += ` -- ${infoDiff.customData._characteristicLabel}`;
         }
         elem.add(optCharacteristic);
      });
      if (first) {
         populateSelectDifficulty(infoDiff.characteristic);
      }
      first = false;
   });
}

function adjustBeatTime(): void {
   const mapInfo = LoadedData.beatmapInfo;
   if (!mapInfo) {
      throw new Error(logPrefix + 'could not find map info');
   }
   const bpm = TimeProcessor.create(mapInfo.audio.bpm);
   Analyser.adjustTime(bpm);
}

function populateTool(): void {
   Analyser.toolListInput.forEach((tl) => {
      if (tl.input.html) {
         switch (tl.type) {
            case 'note': {
               htmlChecksNote.appendChild(tl.input.html);
               break;
            }
            case 'obstacle': {
               htmlChecksObstacle.appendChild(tl.input.html);
               break;
            }
            case 'event': {
               htmlChecksEvent.appendChild(tl.input.html);
               break;
            }
            case 'other': {
               htmlChecksOther.appendChild(tl.input.html);
               break;
            }
            case 'general': {
               htmlChecksGeneral.appendChild(tl.input.html);
               break;
            }
            default: {
               console.error(logPrefix + 'could not recognise type ' + tl.type + ' for ' + tl.name);
            }
         }
      }
   });
}

function clearOutput(): void {
   if (htmlChecksOutputGeneral) {
      htmlChecksOutputGeneral.innerHTML = 'No output.';
   }
   if (htmlChecksOutputDifficulty) {
      htmlChecksOutputDifficulty.innerHTML = 'No output.';
   }
}

function reset(): void {
   clearOutput();
   setDifficultyLabel('Difficulty Label');
   populateSelectCharacteristic();
}

function selectCharacteristicHandler(ev: Event): void {
   const target = ev.target as HTMLSelectElement;
   htmlChecksSelectCharacteristic.forEach((elem) => {
      if (elem !== target) {
         elem.value = target.value;
      }
   });
   const infoDiff = LoadedData.beatmapInfo?.difficulties.find(
      (elem) => elem.characteristic === target.value,
   );
   populateSelectDifficulty(infoDiff?.characteristic);
}

function selectDifficultyHandler(ev: Event): void {
   const target = ev.target as HTMLSelectElement;
   htmlChecksSelectDifficulty.forEach((elem) => {
      if (elem !== target) {
         elem.value = target.value;
      }
   });
   const infoDiff = LoadedData.beatmapInfo?.difficulties.find(
      (elem) => elem.characteristic === htmlChecksSelectCharacteristic.item(0).value,
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
      setDifficultyLabel(
         diff.settings.customData._difficultyLabel ||
            DifficultyRename[target.value as keyof typeof DifficultyRename],
      );
      displayOutputDifficulty(diff.settings.characteristic, diff.settings.difficulty);
   }
}

function applyThisHandler(): void {
   const characteristic = htmlChecksSelectCharacteristic[0].value as CharacteristicName;
   const difficulty = htmlChecksSelectDifficulty[0].value as DifficultyName;
   if (!characteristic || !difficulty) {
      throw new Error(logPrefix + 'characteristic/difficulty does not exist');
   }
   UILoading.status('info', `Re-analysing ${characteristic} ${difficulty}`);
   Analyser.runDifficulty(characteristic, difficulty);
   UILoading.status('info', `Re-analysed ${characteristic} ${difficulty}`);
   displayOutputDifficulty(characteristic, difficulty);
}

function applyAllHandler(): void {
   const characteristic = htmlChecksSelectCharacteristic[0].value as CharacteristicName;
   const difficulty = htmlChecksSelectDifficulty[0].value as DifficultyName;
   if (!characteristic || !difficulty) {
      throw new Error(logPrefix + 'characteristic/difficulty does not exist');
   }
   UILoading.status('info', `Re-analysing all difficulties`);
   Analyser.applyAll();
   UILoading.status('info', `Re-analysed all difficulties`);
   displayOutputDifficulty(characteristic, difficulty);
}

function applyGeneralHandler(): void {
   UILoading.status('info', `Re-analysing general`);
   Analyser.runGeneral();
   UILoading.status('info', `Re-analysed general`);
   displayOutputGeneral();
}

export default {
   displayOutputGeneral,
   displayOutputDifficulty,
   setDifficultyLabel,
   adjustBeatTime,
   populateSelect: populateSelectCharacteristic,
   populateTool,
   reset,
};
