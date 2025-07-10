import Analyser from '../../checks/main';
import { LoadStatus, UILoading } from '../loading';
import { TimeProcessor } from 'bsmap';
import * as types from 'bsmap/types';
import { State } from '../../state';
import { UISelection } from '../selection';
import { IToolOutput } from '../../types/checks/check';
import { printResult, printResultTime } from './output';
import { UIPresets } from './presets';
import { UIBookmark } from './bookmark';

const logPrefix = 'UI Checks: ';

export class UIChecks {
   static #htmlChecksDifficultyLabel: NodeListOf<HTMLElement>;
   static #htmlChecksNote: HTMLElement;
   static #htmlChecksObstacle: HTMLElement;
   static #htmlChecksEvent: HTMLElement;
   static #htmlChecksOther: HTMLElement;
   static #htmlChecksGeneral: HTMLElement;
   static #htmlChecksOutputDifficulty: HTMLElement;
   static #htmlChecksOutputGeneral: HTMLElement;
   static #htmlChecksApplyThis: HTMLInputElement;
   static #htmlChecksApplyAll: HTMLInputElement;
   static #htmlChecksApplyGeneral: HTMLInputElement;

   static init(): void {
      UIBookmark.init();
      UIPresets.init();

      UIChecks.#htmlChecksDifficultyLabel = document.querySelectorAll('.difficulty__label');
      UIChecks.#htmlChecksNote = document.querySelector('.checks__note-content')!;
      UIChecks.#htmlChecksObstacle = document.querySelector('.checks__obstacle-content')!;
      UIChecks.#htmlChecksEvent = document.querySelector('.checks__event-content')!;
      UIChecks.#htmlChecksOther = document.querySelector('.checks__other-content')!;
      UIChecks.#htmlChecksGeneral = document.querySelector('.checks__general-content')!;
      UIChecks.#htmlChecksOutputDifficulty = document.querySelector('.checks__output-diff')!;
      UIChecks.#htmlChecksOutputGeneral = document.querySelector('.checks__output-general')!;
      UIChecks.#htmlChecksApplyThis = document.querySelector('.checks__apply-this')!;
      UIChecks.#htmlChecksApplyAll = document.querySelector('.checks__apply-all')!;
      UIChecks.#htmlChecksApplyGeneral = document.querySelector('.checks__apply-general')!;

      UIChecks.#htmlChecksApplyThis.addEventListener('click', UIChecks.#applyThisHandler);
      UIChecks.#htmlChecksApplyAll.addEventListener('click', UIChecks.#applyAllHandler);
      UIChecks.#htmlChecksApplyGeneral.addEventListener('click', UIChecks.#applyGeneralHandler);

      UIChecks.populateTool();
      UISelection.selectionOnChangeHandlers.push(UIChecks.displayOutputDifficulty);
   }

   static reset(): void {
      UIChecks.#clearOutput();
      UIChecks.setDifficultyLabel('Difficulty Label');
   }

   static displayOutputGeneral(): void {
      const analysis = State.data.analysis?.general;
      if (!analysis) {
         UIChecks.#htmlChecksOutputGeneral.textContent =
            'ERROR: could not find analysis for general';
         return;
      }
      if (!analysis.output) {
         UIChecks.#htmlChecksOutputGeneral.textContent = 'ERROR: could not find HTML for general';
         return;
      }
      UIChecks.#htmlChecksOutputGeneral.innerHTML = '';
      analysis.output.forEach((h) =>
         UIChecks.#htmlChecksOutputGeneral.appendChild(UIChecks.#outputToHtml(h)),
      );
      if (!UIChecks.#htmlChecksOutputGeneral.firstChild) {
         UIChecks.#htmlChecksOutputGeneral.textContent = 'No issues found.';
      }
   }

   static displayOutputDifficulty(
      characteristic?: types.CharacteristicName | null,
      difficulty?: types.DifficultyName | null,
   ): void {
      if (!characteristic && !difficulty) {
         characteristic = UISelection.getSelectedCharacteristic();
         difficulty = UISelection.getSelectedDifficulty();
      }
      if (!characteristic || !difficulty) {
         throw new Error(logPrefix + 'something went wrong!');
      }
      UIChecks.#htmlChecksOutputDifficulty.innerHTML = '';
      const analysis = State.data.analysis?.beatmap.find(
         (set) => set.difficulty === difficulty && set.characteristic === characteristic,
      );
      if (!analysis) {
         UIChecks.#htmlChecksOutputDifficulty.textContent =
            'ERROR: could not find analysis for ' + characteristic + ' ' + difficulty;
         return;
      }
      if (!analysis.output) {
         UIChecks.#htmlChecksOutputDifficulty.textContent =
            'ERROR: could not find HTML for ' + characteristic + ' ' + difficulty;
         return;
      }
      analysis.output.forEach((h) =>
         UIChecks.#htmlChecksOutputDifficulty.appendChild(UIChecks.#outputToHtml(h)),
      );
      if (!UIChecks.#htmlChecksOutputDifficulty.firstChild) {
         UIChecks.#htmlChecksOutputDifficulty.textContent = 'No issues found.';
      }
   }

   static #outputToHtml(output: IToolOutput): HTMLDivElement {
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

   static setDifficultyLabel(str: string): void {
      UIChecks.#htmlChecksDifficultyLabel.forEach((elem) => (elem.textContent = str));
   }

   static adjustBeatTime(): void {
      const mapInfo = State.data.info;
      if (!mapInfo) {
         throw new Error(logPrefix + 'could not find map info');
      }
      const bpm = TimeProcessor.create(mapInfo.audio.bpm);
      Analyser.adjustTime(bpm);
   }

   static populateTool(): void {
      Analyser.toolListInput.forEach((tl) => {
         if (tl.input.html) {
            switch (tl.type) {
               case 'note': {
                  UIChecks.#htmlChecksNote.appendChild(tl.input.html);
                  break;
               }
               case 'obstacle': {
                  UIChecks.#htmlChecksObstacle.appendChild(tl.input.html);
                  break;
               }
               case 'event': {
                  UIChecks.#htmlChecksEvent.appendChild(tl.input.html);
                  break;
               }
               case 'other': {
                  UIChecks.#htmlChecksOther.appendChild(tl.input.html);
                  break;
               }
               case 'general': {
                  UIChecks.#htmlChecksGeneral.appendChild(tl.input.html);
                  break;
               }
               default: {
                  console.error(
                     logPrefix + 'could not recognise type ' + tl.type + ' for ' + tl.name,
                  );
               }
            }
         }
      });
   }

   static #clearOutput(): void {
      UIChecks.#htmlChecksOutputGeneral.innerHTML = 'No output.';
      UIChecks.#htmlChecksOutputDifficulty.innerHTML = 'No output.';
   }

   static #applyThisHandler(): void {
      const characteristic = UISelection.getSelectedCharacteristic();
      const difficulty = UISelection.getSelectedDifficulty();
      if (!characteristic || !difficulty) {
         throw new Error(logPrefix + 'characteristic/difficulty does not exist');
      }
      UILoading.status(LoadStatus.INFO, `Re-analysing ${characteristic} ${difficulty}`);
      Analyser.runDifficulty(characteristic, difficulty);
      UILoading.status(LoadStatus.INFO, `Re-analysed ${characteristic} ${difficulty}`);
      UIChecks.displayOutputDifficulty(characteristic, difficulty);
   }

   static #applyAllHandler(): void {
      const characteristic = UISelection.getSelectedCharacteristic();
      const difficulty = UISelection.getSelectedDifficulty();
      if (!characteristic || !difficulty) {
         throw new Error(logPrefix + 'characteristic/difficulty does not exist');
      }
      UILoading.status(LoadStatus.INFO, `Re-analysing all difficulties`);
      Analyser.applyAll();
      UILoading.status(LoadStatus.INFO, `Re-analysed all difficulties`);
      UIChecks.displayOutputDifficulty(characteristic, difficulty);
   }

   static #applyGeneralHandler(): void {
      UILoading.status(LoadStatus.INFO, `Re-analysing general`);
      Analyser.runGeneral();
      UILoading.status(LoadStatus.INFO, `Re-analysed general`);
      UIChecks.displayOutputGeneral();
   }
}
