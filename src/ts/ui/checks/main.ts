import Analyser from '../../checks/main';
import UILoading from '../loading';
import { TimeProcessor, types } from 'bsmap';
import LoadedData from '../../loadedData';
import {
   getSelectedCharacteristic,
   getSelectedDifficulty,
   selectionOnChangeHandlers,
} from '../selection';
import { IToolOutput } from '../../types/checks/check';
import { printResult, printResultTime } from './output';

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

function outputToHtml(output: IToolOutput): HTMLDivElement {
   switch (output.type) {
      case 'string':
         return printResult(output.label, output.value, output.symbol);
      case 'number':
         return printResult(output.label, output.value.join(', '), output.symbol);
      case 'time':
         return printResultTime(output.label, output.value, output.symbol);
      case 'html':
         const htmlContainer = document.createElement('div');
         output.value.forEach((h) => htmlContainer.appendChild(h));
         return htmlContainer;
      default:
         throw new Error('Unexpected result type');
   }
}

function displayOutputGeneral(): void {
   const analysis = LoadedData.analysis?.general;
   if (!analysis) {
      htmlChecksOutputGeneral.textContent = 'ERROR: could not find analysis for general';
      return;
   }
   if (!analysis.output) {
      htmlChecksOutputGeneral.textContent = 'ERROR: could not find HTML for general';
      return;
   }
   htmlChecksOutputGeneral.innerHTML = '';
   analysis.output.forEach((h) => htmlChecksOutputGeneral.appendChild(outputToHtml(h)));
   if (!htmlChecksOutputGeneral.firstChild) {
      htmlChecksOutputGeneral.textContent = 'No issues found.';
   }
}

function displayOutputDifficulty(
   characteristic?: types.CharacteristicName | null,
   difficulty?: types.DifficultyName | null,
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
   if (!analysis.output) {
      htmlChecksOutputDifficulty.textContent =
         'ERROR: could not find HTML for ' + characteristic + ' ' + difficulty;
      return;
   }
   analysis.output.forEach((h) => htmlChecksOutputDifficulty.appendChild(outputToHtml(h)));
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
