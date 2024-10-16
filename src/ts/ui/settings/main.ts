// TODO: generate options instead of hardcoded in HTML
import { UIThemeName } from '../../types/ui';
import UITheme from '../theme';
import Settings from '../../settings';
import { BeatNumbering, ISettings } from '../../types/settings';
import { updateTableRow } from '../information/helpers';

const htmlSettingsTheme: HTMLSelectElement = document.querySelector('.settings__theme')!;
const htmlSettingsBeatNumbering: HTMLSelectElement = document.querySelector(
   '.settings__beat-numbering',
)!;
const htmlSettingsRounding: HTMLInputElement = document.querySelector('.settings__rounding')!;
const htmlSettingsInfoCount: HTMLInputElement = document.querySelector('.settings__info-count')!;
const htmlSettingsDataCheck: HTMLInputElement = document.querySelector('.settings__data-check')!;
const htmlSettingsLoad: NodeListOf<HTMLInputElement> = document.querySelectorAll('.settings__load');
const htmlSettingsSort: HTMLInputElement = document.querySelector('.settings__sort')!;
const htmlSettingsShow: NodeListOf<HTMLInputElement> = document.querySelectorAll('.settings__show');
const htmlSettingsClear: HTMLInputElement = document.querySelector('.settings__clear-button')!;
const htmlSettingsChecksPersistent: HTMLInputElement = document.querySelector(
   '.settings__checks-persistent',
)!;

htmlSettingsTheme.addEventListener('change', themeChangeHandler);
UITheme.list.forEach((th) => {
   const optTheme = document.createElement('option');
   optTheme.value = th;
   optTheme.textContent = th;
   htmlSettingsTheme.add(optTheme);
});
htmlSettingsBeatNumbering.addEventListener('change', beatNumberingChangeHandler);
htmlSettingsRounding.addEventListener('change', roundingChangeHandler);
htmlSettingsInfoCount.addEventListener('change', infoCountChangeHandler);
htmlSettingsDataCheck.addEventListener('change', dataCheckChangeHandler);
htmlSettingsLoad.forEach((elem) => elem.addEventListener('change', loadCheckHandler));
htmlSettingsSort.addEventListener('change', sortCheckHandler);
htmlSettingsShow.forEach((elem) => elem.addEventListener('change', showCheckHandler));
htmlSettingsChecksPersistent.addEventListener('click', checksPersistCheckHandler);
htmlSettingsClear.addEventListener('click', clear);

function themeChangeHandler(ev: Event): void {
   const target = ev.target as HTMLSelectElement;
   Settings.theme = target.options[target.options.selectedIndex].value as UIThemeName;
   UITheme.set(Settings.theme);
   Settings.save();
}

function beatNumberingChangeHandler(ev: Event): void {
   const target = ev.target as HTMLSelectElement;
   Settings.beatNumbering = target.options[target.options.selectedIndex].value as BeatNumbering;
   Settings.save();
}

function roundingChangeHandler(ev: Event): void {
   const target = ev.target as HTMLInputElement;
   Settings.rounding = parseInt(target.value);
   Settings.save();
}

function infoCountChangeHandler(ev: Event): void {
   const target = ev.target as HTMLInputElement;
   Settings.infoRowCount = parseInt(target.value);
   updateTableRow();
   Settings.save();
}

function dataCheckChangeHandler(ev: Event): void {
   const target = ev.target as HTMLInputElement;
   Settings.dataCheck = target.checked;
   Settings.save();
}

function showCheckHandler(ev: Event): void {
   const target = ev.target as HTMLInputElement;
   const id = target.id.replace('settings__show-', '') as ISettings['show'];
   Settings.show = id;
   Settings.save();
}

function checksPersistCheckHandler(ev: Event): void {
   const target = ev.target as HTMLInputElement;
   Settings.checks.persistent = target.checked;
   Settings.save();
}

function setShowCheck(id: string): void {
   htmlSettingsShow.forEach((elem) => {
      if (elem.id.endsWith(id)) {
         elem.checked = true;
      }
   });
}

function sortCheckHandler(ev: Event): void {
   const target = ev.target as HTMLInputElement;
   Settings.sorting = target.checked;
   Settings.save();
}

function setSortCheck(bool: boolean): void {
   if (htmlSettingsSort) {
      htmlSettingsSort.checked = bool;
   }
}

function loadCheckHandler(ev: Event): void {
   const target = ev.target as HTMLInputElement;
   const id = target.name;
   Settings.load[id] = target.checked;
   Settings.save();
}

function setLoadCheck(id: string, bool: boolean): void {
   htmlSettingsLoad.forEach((elem) => {
      if (elem.name === id) {
         elem.checked = bool;
      }
   });
}

function setTheme(str: UIThemeName): void {
   htmlSettingsTheme.value = str;
}

function setBeatNumbering(str: BeatNumbering): void {
   htmlSettingsBeatNumbering.value = str;
}

function setRounding(num: number): void {
   htmlSettingsRounding.value = num.toString();
}

function setInfoRow(num: number): void {
   htmlSettingsInfoCount.value = num.toString();
   updateTableRow();
}

function setDataCheck(bool: boolean): void {
   htmlSettingsDataCheck.checked = bool;
}

function setChecksPersistent(bool: boolean): void {
   htmlSettingsChecksPersistent.checked = bool;
}

function clear(): void {
   Settings.clear();
   Settings.reset();
   location.reload();
}

export default {
   setShowCheck,
   setSortCheck,
   setLoadCheck,
   setTheme,
   setBeatNumbering,
   setRounding,
   setInfoRow,
   setDataCheck,
   clear,
};
