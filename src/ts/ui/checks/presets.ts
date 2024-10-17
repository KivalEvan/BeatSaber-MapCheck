import { deepCopy } from 'bsmap/utils';
import { presets, original } from '../../checks/presets';
import { updateChecksPreset } from '../../checks/main';
import settings from '../../settings';

const htmlChecksPreset: HTMLSelectElement = document.querySelector('.checks__preset')!;
const htmlChecksReset: HTMLInputElement = document.querySelector('.checks__preset-reset')!;
const htmlChecksSave: HTMLInputElement = document.querySelector('.checks__preset-save')!;

htmlChecksPreset.addEventListener('change', presetChangeHandler);
htmlChecksReset.addEventListener('click', presetResetHandler);
htmlChecksSave.addEventListener('click', presetSaveHandler);

export function init() {
   if (settings.checks.persistent) {
      htmlChecksPreset.value = settings.checks.preset;
   } else {
      htmlChecksPreset.value = htmlChecksPreset.options[0].value;
   }
   presetChangeHandler();
}

function presetChangeHandler(): void {
   const preset = htmlChecksPreset.value as keyof typeof presets;
   if (settings.checks.persistent) {
      settings.checks.preset = preset;
      settings.save();
   }
   htmlChecksSave.disabled = preset !== 'Custom';
   updateChecksPreset(presets[preset]);
}

function presetResetHandler(): void {
   const preset = htmlChecksPreset.value as keyof typeof presets;
   if (preset === 'Custom') {
      presets[preset] = deepCopy(original.Default);
   } else {
      presets[preset] = deepCopy(original[preset]);
   }
   presetChangeHandler();
}

function presetSaveHandler(): void {
   const preset = htmlChecksPreset.value;
   if (preset === 'Custom') {
      saveCustom();
   }
}

function saveCustom(): void {
   if (localStorage) {
      localStorage.setItem('checks', JSON.stringify(presets.Custom));
   }
}
