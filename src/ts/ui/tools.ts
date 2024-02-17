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

const htmlToolsSelectCharacteristic: NodeListOf<HTMLSelectElement> =
   document.querySelectorAll('.tools__select-mode');
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

htmlToolsSelectCharacteristic.forEach((elem) => elem.addEventListener('change', selectModeHandler));
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

function displayOutputDifficulty(mode?: CharacteristicName, difficulty?: DifficultyName): void {
   if (!mode && !difficulty) {
      mode = htmlToolsSelectCharacteristic[0].value as CharacteristicName;
      difficulty = htmlToolsSelectDifficulty[0].value as DifficultyName;
   }
   if (!mode || !difficulty) {
      throw new Error(logPrefix + 'something went wrong!');
   }
   htmlToolsOutputDifficulty.innerHTML = '';
   const analysis = SavedData.analysis?.map.find(
      (set) => set.difficulty === difficulty && set.mode === mode,
   );
   if (!analysis) {
      htmlToolsOutputDifficulty.textContent =
         'ERROR: could not find analysis for ' + mode + ' ' + difficulty;
      return;
   }
   if (!analysis.html) {
      htmlToolsOutputDifficulty.textContent =
         'ERROR: could not find HTML for ' + mode + ' ' + difficulty;
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

function populateSelectDifficulty(mode?: CharacteristicName): void {
   const mapInfo = savedData.beatmapInfo;
   if (!mode || !mapInfo) {
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
      if (mode !== diff.characteristic) continue;
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
   const addedMode = new Set();
   mapInfo.difficulties.forEach((infoDiff) => {
      if (addedMode.has(infoDiff.characteristic)) return;
      addedMode.add(infoDiff.characteristic);
      htmlToolsSelectCharacteristic.forEach((elem) => {
         const optMode = document.createElement('option');
         optMode.value = infoDiff.characteristic;
         optMode.textContent = CharacteristicRename[infoDiff.characteristic];
         if (infoDiff.customData._characteristicLabel)
            optMode.textContent += ` -- ${infoDiff.customData._characteristicLabel}`;
         elem.add(optMode);
      });
      if (first) {
         populateSelectDifficulty(infoDiff.characteristic);
      }
      first = false;
   });
}

function adjustTime(): void {
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

function selectModeHandler(ev: Event): void {
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
   const mode = htmlToolsSelectCharacteristic[0].value as CharacteristicName;
   const difficulty = htmlToolsSelectDifficulty[0].value as DifficultyName;
   if (!mode || !difficulty) {
      throw new Error(logPrefix + 'mode/difficulty does not exist');
   }
   UILoading.status('info', `Re-analysing ${mode} ${difficulty}`, 100);
   Analyser.runDifficulty(mode, difficulty);
   UILoading.status('info', `Re-analysed ${mode} ${difficulty}`, 100);
   displayOutputDifficulty(mode, difficulty);
}

function applyAllHandler(): void {
   const mode = htmlToolsSelectCharacteristic[0].value as CharacteristicName;
   const difficulty = htmlToolsSelectDifficulty[0].value as DifficultyName;
   if (!mode || !difficulty) {
      throw new Error(logPrefix + 'mode/difficulty does not exist');
   }
   UILoading.status('info', `Re-analysing all difficulties`, 100);
   Analyser.applyAll();
   UILoading.status('info', `Re-analysed all difficulties`, 100);
   displayOutputDifficulty(mode, difficulty);
}

function applyGeneralHandler(): void {
   UILoading.status('info', `Re-analysing all difficulties`, 100);
   Analyser.runGeneral();
   UILoading.status('info', `Re-analysed all difficulties`, 100);
   displayOutputGeneral();
}

export default {
   displayOutputGeneral,
   displayOutputDifficulty,
   setDifficultyLabel,
   adjustTime,
   populateSelect: populateSelectCharacteristic,
   populateTool,
   reset,
};
