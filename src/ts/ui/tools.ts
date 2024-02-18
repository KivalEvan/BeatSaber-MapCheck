import SavedData from '../savedData';
import Analyser from '../tools/analyzer';
import UILoading from './loading';
import UIInformation from './information';
import { removeOptions } from '../utils/web';
import { BeatPerMinute } from '../beatmap/shared/bpm';
import { CharacteristicRename } from '../beatmap/shared/characteristic';
import { DifficultyRename } from '../beatmap/shared/difficulty';
import { CharacteristicName } from '../types/beatmap/shared/characteristic';
import { DifficultyName } from '../types/beatmap/shared/difficulty';
import { IWrapInfo } from '../types/beatmap/wrapper/info';
import savedData from '../savedData';

const logPrefix = 'UI Tools: ';

const htmlToolsSelectCharacteristic: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
   '.tools__select-characteristic',
);
const htmlToolsSelectDifficulty: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
   '.tools__select-difficulty',
);
const htmlToolsDifficultyLabel: NodeListOf<HTMLElement> =
   document.querySelectorAll('.difficulty__label');
const htmlToolsNote: HTMLElement = document.querySelector('.tools__note-content')!;
const htmlToolsObstacle: HTMLElement = document.querySelector('.tools__obstacle-content')!;
const htmlToolsEvent: HTMLElement = document.querySelector('.tools__event-content')!;
const htmlToolsOther: HTMLElement = document.querySelector('.tools__other-content')!;
const htmlToolsGeneral: HTMLElement = document.querySelector('.tools__general-content')!;
const htmlToolsOutputDifficulty: HTMLElement = document.querySelector('.tools__output-diff')!;
const htmlToolsOutputGeneral: HTMLElement = document.querySelector('.tools__output-general')!;
const htmlToolsApplyThis: HTMLInputElement = document.querySelector('.tools__apply-this')!;
const htmlToolsApplyAll: HTMLInputElement = document.querySelector('.tools__apply-all')!;
const htmlToolsApplyGeneral: HTMLInputElement = document.querySelector('.tools__apply-general')!;

htmlToolsApplyThis.addEventListener('click', applyThisHandler);
htmlToolsApplyAll.addEventListener('click', applyAllHandler);
htmlToolsApplyGeneral.addEventListener('click', applyGeneralHandler);

htmlToolsSelectCharacteristic.forEach((elem) =>
   elem.addEventListener('change', selectCharacteristicHandler),
);
htmlToolsSelectDifficulty.forEach((elem) =>
   elem.addEventListener('change', selectDifficultyHandler),
);

function displayOutputGeneral(): void {
   const analysis = SavedData.analysis?.general;
   if (!analysis) {
      htmlToolsOutputGeneral.textContent = 'ERROR: could not find analysis for general';
      return;
   }
   if (!analysis.html) {
      htmlToolsOutputGeneral.textContent = 'ERROR: could not find HTML for general';
      return;
   }
   htmlToolsOutputGeneral.innerHTML = '';
   analysis.html.forEach((h) => htmlToolsOutputGeneral.appendChild(h));
   if (!htmlToolsOutputGeneral.firstChild) {
      htmlToolsOutputGeneral.textContent = 'No issues found.';
   }
}

function displayOutputDifficulty(
   characteristic?: CharacteristicName,
   difficulty?: DifficultyName,
): void {
   if (!characteristic && !difficulty) {
      characteristic = htmlToolsSelectCharacteristic[0].value as CharacteristicName;
      difficulty = htmlToolsSelectDifficulty[0].value as DifficultyName;
   }
   if (!characteristic || !difficulty) {
      throw new Error(logPrefix + 'something went wrong!');
   }
   htmlToolsOutputDifficulty.innerHTML = '';
   const analysis = SavedData.analysis?.map.find(
      (set) => set.difficulty === difficulty && set.characteristic === characteristic,
   );
   if (!analysis) {
      htmlToolsOutputDifficulty.textContent =
         'ERROR: could not find analysis for ' + characteristic + ' ' + difficulty;
      return;
   }
   if (!analysis.html) {
      htmlToolsOutputDifficulty.textContent =
         'ERROR: could not find HTML for ' + characteristic + ' ' + difficulty;
      return;
   }
   analysis.html.forEach((h) => htmlToolsOutputDifficulty.appendChild(h));
   if (!htmlToolsOutputDifficulty.firstChild) {
      htmlToolsOutputDifficulty.textContent = 'No issues found.';
   }
}

function setDifficultyLabel(str: string): void {
   htmlToolsDifficultyLabel.forEach((elem) => (elem.textContent = str));
}

function populateSelectDifficulty(characteristic?: CharacteristicName): void {
   const mapInfo = savedData.beatmapInfo;
   if (!characteristic || !mapInfo) {
      return;
   }
   htmlToolsSelectDifficulty.forEach((elem) => {
      for (let i = elem.options.length - 1; i >= 0; i--) {
         elem.remove(i);
      }
   });
   let first = true;
   for (let i = mapInfo.difficulties.length - 1; i >= 0; i--) {
      const diff = mapInfo.difficulties[i];
      if (characteristic !== diff.characteristic) continue;
      htmlToolsSelectDifficulty.forEach((elem) => {
         const optDiff = document.createElement('option');
         optDiff.value = diff.difficulty;
         optDiff.textContent =
            DifficultyRename[diff.difficulty] +
            (diff.customData._difficultyLabel ? ' -- ' + diff.customData._difficultyLabel : '');
         if (first) {
            const diffData = SavedData.beatmapDifficulty.find(
               (el) =>
                  el.difficulty === diff.difficulty &&
                  el.characteristic === mapInfo.difficulties[i].characteristic,
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
      htmlToolsSelectCharacteristic.forEach((elem) => removeOptions(elem));
      htmlToolsSelectDifficulty.forEach((elem) => removeOptions(elem));
      return;
   }
   let first = true;
   const addedCharacteristic = new Set();
   mapInfo.difficulties.forEach((infoDiff) => {
      if (addedCharacteristic.has(infoDiff.characteristic)) return;
      addedCharacteristic.add(infoDiff.characteristic);
      htmlToolsSelectCharacteristic.forEach((elem) => {
         const optCharacteristic = document.createElement('option');
         optCharacteristic.value = infoDiff.characteristic;
         optCharacteristic.textContent = CharacteristicRename[infoDiff.characteristic];
         if (infoDiff.customData._characteristicLabel)
            optCharacteristic.textContent += ` -- ${infoDiff.customData._characteristicLabel}`;
         elem.add(optCharacteristic);
      });
      if (first) {
         populateSelectDifficulty(infoDiff.characteristic);
      }
      first = false;
   });
}

function adjustBeatTime(): void {
   const mapInfo = SavedData.beatmapInfo;
   if (!mapInfo) {
      throw new Error(logPrefix + 'could not find map info');
   }
   const bpm = BeatPerMinute.create(mapInfo.audio.bpm);
   Analyser.adjustTime(bpm);
}

function populateTool(): void {
   Analyser.toolListInput.forEach((tl) => {
      if (tl.input.html) {
         switch (tl.type) {
            case 'note': {
               htmlToolsNote.appendChild(tl.input.html);
               break;
            }
            case 'obstacle': {
               htmlToolsObstacle.appendChild(tl.input.html);
               break;
            }
            case 'event': {
               htmlToolsEvent.appendChild(tl.input.html);
               break;
            }
            case 'other': {
               htmlToolsOther.appendChild(tl.input.html);
               break;
            }
            case 'general': {
               htmlToolsGeneral.appendChild(tl.input.html);
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
   if (htmlToolsOutputGeneral) {
      htmlToolsOutputGeneral.innerHTML = 'No output.';
   }
   if (htmlToolsOutputDifficulty) {
      htmlToolsOutputDifficulty.innerHTML = 'No output.';
   }
}

function reset(): void {
   clearOutput();
   setDifficultyLabel('Difficulty Label');
   populateSelectCharacteristic();
}

function selectCharacteristicHandler(ev: Event): void {
   const target = ev.target as HTMLSelectElement;
   htmlToolsSelectCharacteristic.forEach((elem) => {
      if (elem !== target) {
         elem.value = target.value;
      }
   });
   const infoDiff = SavedData.beatmapInfo?.difficulties.find(
      (elem) => elem.characteristic === target.value,
   );
   populateSelectDifficulty(infoDiff?.characteristic);
}

function selectDifficultyHandler(ev: Event): void {
   const target = ev.target as HTMLSelectElement;
   htmlToolsSelectDifficulty.forEach((elem) => {
      if (elem !== target) {
         elem.value = target.value;
      }
   });
   const infoDiff = SavedData.beatmapInfo?.difficulties.find(
      (elem) => elem.characteristic === htmlToolsSelectCharacteristic.item(0).value,
   );
   if (!infoDiff) {
      throw new Error('aaaaaaaaaaaaaaaaaaa');
   }
   const diff = SavedData.beatmapDifficulty?.find(
      (elem) => elem.difficulty === target.value && elem.characteristic === infoDiff.characteristic,
   );
   if (diff) {
      UIInformation.setDiffInfoTable(SavedData.beatmapInfo!, diff);
      setDifficultyLabel(
         diff.info.customData._difficultyLabel ||
            DifficultyRename[target.value as keyof typeof DifficultyRename],
      );
      displayOutputDifficulty(diff.characteristic, diff.difficulty);
   }
}

function applyThisHandler(): void {
   const characteristic = htmlToolsSelectCharacteristic[0].value as CharacteristicName;
   const difficulty = htmlToolsSelectDifficulty[0].value as DifficultyName;
   if (!characteristic || !difficulty) {
      throw new Error(logPrefix + 'characteristic/difficulty does not exist');
   }
   UILoading.status('info', `Re-analysing ${characteristic} ${difficulty}`);
   Analyser.runDifficulty(characteristic, difficulty);
   UILoading.status('info', `Re-analysed ${characteristic} ${difficulty}`);
   displayOutputDifficulty(characteristic, difficulty);
}

function applyAllHandler(): void {
   const characteristic = htmlToolsSelectCharacteristic[0].value as CharacteristicName;
   const difficulty = htmlToolsSelectDifficulty[0].value as DifficultyName;
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
