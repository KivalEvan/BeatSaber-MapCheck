import { deepCopy } from 'bsmap/utils';
import { presets, original } from '../../checks/presets';
import { updateChecksPreset } from '../../checks/components';
import { Settings } from '../../settings';

export class UIPresets {
   static #htmlChecksPreset: HTMLSelectElement;
   static #htmlChecksReset: HTMLInputElement;
   static #htmlChecksSave: HTMLInputElement;

   static init(): void {
      UIPresets.#htmlChecksPreset = document.querySelector('.checks__preset')!;
      UIPresets.#htmlChecksReset = document.querySelector('.checks__preset-reset')!;
      UIPresets.#htmlChecksSave = document.querySelector('.checks__preset-save')!;

      UIPresets.#htmlChecksPreset.addEventListener('change', UIPresets.#presetChangeHandler);
      UIPresets.#htmlChecksReset.addEventListener('click', UIPresets.#presetResetHandler);
      UIPresets.#htmlChecksSave.addEventListener('click', UIPresets.#presetSaveHandler);

      if (
         Settings.props.checks.persistent &&
         UIPresets.#htmlChecksPreset.querySelector(
            `option[value="${Settings.props.checks.preset}"]`,
         )
      ) {
         UIPresets.#htmlChecksPreset.value = Settings.props.checks.preset;
      } else {
         UIPresets.#htmlChecksPreset.value = UIPresets.#htmlChecksPreset.options[0].value;
      }
      UIPresets.#presetChangeHandler();
   }

   static #presetChangeHandler(): void {
      const preset = UIPresets.#htmlChecksPreset.value as keyof typeof presets;
      if (Settings.props.checks.persistent) {
         Settings.props.checks.preset = preset;
         Settings.save();
      }
      UIPresets.#htmlChecksSave.disabled = preset !== 'Custom';
      updateChecksPreset(presets[preset]);
   }

   static #presetResetHandler(): void {
      const preset = UIPresets.#htmlChecksPreset.value as keyof typeof presets;
      if (preset === 'Custom') {
         presets[preset] = deepCopy(original.Default);
      } else {
         presets[preset] = deepCopy(original[preset]);
      }
      UIPresets.#presetChangeHandler();
   }

   static #presetSaveHandler(): void {
      const preset = UIPresets.#htmlChecksPreset.value;
      if (preset === 'Custom') {
         UIPresets.#saveCustom();
      }
   }

   static #saveCustom(): void {
      if (localStorage) {
         localStorage.setItem('checks', JSON.stringify(presets.Custom));
      }
   }
}
