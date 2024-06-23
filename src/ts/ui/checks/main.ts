import Analyser from '../../checks/main';
import UILoading from '../loading';
import { TimeProcessor } from '../../bsmap/beatmap/helpers/timeProcessor';
import { CharacteristicName } from '../../bsmap/types/beatmap/shared/characteristic';
import { DifficultyName } from '../../bsmap/types/beatmap/shared/difficulty';
import LoadedData from '../../loadedData';
import {
   getSelectedCharacteristic,
   getSelectedDifficulty,
   selectionOnChangeHandlers,
} from '../selection';

const logPrefix = 'UI Checks: ';

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
      characteristic = getSelectedCharacteristic();
      difficulty = getSelectedDifficulty();
   }
   if (!characteristic || !difficulty) {
      throw new Error(logPrefix + 'something went wrong!');
   }
   htmlChecksOutputDifficulty.innerHTML = '';
   const analysis = LoadedData.analysis?.beatmap.find(
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
}

function applyThisHandler(): void {
   const characteristic = getSelectedCharacteristic();
   const difficulty = getSelectedDifficulty();
   if (!characteristic || !difficulty) {
      throw new Error(logPrefix + 'characteristic/difficulty does not exist');
   }
   UILoading.status('info', `Re-analysing ${characteristic} ${difficulty}`);
   Analyser.runDifficulty(characteristic, difficulty);
   UILoading.status('info', `Re-analysed ${characteristic} ${difficulty}`);
   displayOutputDifficulty(characteristic, difficulty);
}

function applyAllHandler(): void {
   const characteristic = getSelectedCharacteristic();
   const difficulty = getSelectedDifficulty();
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

selectionOnChangeHandlers.push(displayOutputDifficulty);

export default {
   displayOutputGeneral,
   displayOutputDifficulty,
   setDifficultyLabel,
   adjustBeatTime,
   populateTool,
   reset,
};
