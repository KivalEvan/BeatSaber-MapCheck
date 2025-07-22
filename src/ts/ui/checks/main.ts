import { getAllComponents, applyBpmToComponents } from '../../checks/components';
import { LoadStatus, UILoading } from '../loading';
import { TimeProcessor } from 'bsmap';
import * as types from 'bsmap/types';
import { State } from '../../state';
import { UISelection } from '../selection';
import { CheckType, ICheckOutput, OutputType } from '../../types/checks/check';
import { printResult, printResultTime } from './output';
import { UIPresets } from './presets';
import { UIBookmark } from './bookmark';
import { checkAllDifficulty, checkDifficulty, checkGeneral } from '../../checks/main';

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

   static #outputToHtml(output: ICheckOutput): HTMLDivElement {
      switch (output.type) {
         case OutputType.STRING:
            return printResult(output.label, output.value, output.status);
         case OutputType.NUMBER:
            return printResult(output.label, output.value.join(', '), output.status);
         case OutputType.TIME:
            return printResultTime(output.label, output.value, output.status);
         case OutputType.HTML:
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
      applyBpmToComponents(bpm);
   }

   static populateTool(): void {
      getAllComponents()
         .sort((a, b) => a.order.input - b.order.input)
         .forEach((tl) => {
            if (tl.input.ui) {
               switch (tl.type) {
                  case CheckType.NOTE: {
                     UIChecks.#htmlChecksNote.appendChild(tl.input.ui());
                     break;
                  }
                  case CheckType.OBSTACLE: {
                     UIChecks.#htmlChecksObstacle.appendChild(tl.input.ui());
                     break;
                  }
                  case CheckType.EVENT: {
                     UIChecks.#htmlChecksEvent.appendChild(tl.input.ui());
                     break;
                  }
                  case CheckType.OTHER: {
                     UIChecks.#htmlChecksOther.appendChild(tl.input.ui());
                     break;
                  }
                  case CheckType.GENERAL: {
                     UIChecks.#htmlChecksGeneral.appendChild(tl.input.ui());
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
      checkDifficulty(characteristic, difficulty);
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
      checkAllDifficulty();
      UILoading.status(LoadStatus.INFO, `Re-analysed all difficulties`);
      UIChecks.displayOutputDifficulty(characteristic, difficulty);
   }

   static #applyGeneralHandler(): void {
      UILoading.status(LoadStatus.INFO, `Re-analysing general`);
      checkGeneral();
      UILoading.status(LoadStatus.INFO, `Re-analysed general`);
      UIChecks.displayOutputGeneral();
   }
}
