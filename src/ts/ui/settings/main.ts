// TODO: generate options instead of hardcoded in HTML
import { ThemeName, UITheme } from '../theme';
import { Settings } from '../../settings';
import { BeatNumbering, ISettingsProps } from '../../types/settings';
import { updateTableRow } from '../information/helpers';

export class UISettings {
   static #htmlSettingsTheme: HTMLSelectElement;
   static #htmlSettingsBeatNumbering: HTMLSelectElement;
   static #htmlSettingsRounding: HTMLInputElement;
   static #htmlSettingsInfoCount: HTMLInputElement;
   static #htmlSettingsDataCheck: HTMLInputElement;
   static #htmlSettingsLoad: NodeListOf<HTMLInputElement>;
   static #htmlSettingsSort: HTMLInputElement;
   static #htmlSettingsShow: NodeListOf<HTMLInputElement>;
   static #htmlSettingsClear: HTMLInputElement;
   static #htmlSettingsChecksPersistent: HTMLInputElement;

   static init(): void {
      UISettings.#htmlSettingsTheme = document.querySelector('.settings__theme')!;
      UISettings.#htmlSettingsBeatNumbering = document.querySelector('.settings__beat-numbering')!;
      UISettings.#htmlSettingsRounding = document.querySelector('.settings__rounding')!;
      UISettings.#htmlSettingsInfoCount = document.querySelector('.settings__info-count')!;
      UISettings.#htmlSettingsDataCheck = document.querySelector('.settings__data-check')!;
      UISettings.#htmlSettingsLoad = document.querySelectorAll('.settings__load');
      UISettings.#htmlSettingsSort = document.querySelector('.settings__sort')!;
      UISettings.#htmlSettingsShow = document.querySelectorAll('.settings__show');
      UISettings.#htmlSettingsClear = document.querySelector('.settings__clear-button')!;
      UISettings.#htmlSettingsChecksPersistent = document.querySelector(
         '.settings__checks-persistent',
      )!;

      UISettings.#htmlSettingsTheme.addEventListener('change', UISettings.#themeChangeHandler);
      UITheme.list.forEach((th) => {
         const optTheme = document.createElement('option');
         optTheme.value = th;
         optTheme.textContent = th;
         UISettings.#htmlSettingsTheme.add(optTheme);
      });
      UISettings.#htmlSettingsBeatNumbering.addEventListener(
         'change',
         UISettings.#beatNumberingChangeHandler,
      );
      UISettings.#htmlSettingsRounding.addEventListener(
         'change',
         UISettings.#roundingChangeHandler,
      );
      UISettings.#htmlSettingsInfoCount.addEventListener(
         'change',
         UISettings.#infoCountChangeHandler,
      );
      UISettings.#htmlSettingsDataCheck.addEventListener(
         'change',
         UISettings.#dataCheckChangeHandler,
      );
      UISettings.#htmlSettingsLoad.forEach((elem) =>
         elem.addEventListener('change', UISettings.#loadCheckHandler),
      );
      UISettings.#htmlSettingsSort.addEventListener('change', UISettings.#sortCheckHandler);
      UISettings.#htmlSettingsShow.forEach((elem) =>
         elem.addEventListener('change', UISettings.#showCheckHandler),
      );
      UISettings.#htmlSettingsChecksPersistent.addEventListener(
         'click',
         UISettings.#checksPersistCheckHandler,
      );
      UISettings.#htmlSettingsClear.addEventListener('click', UISettings.clearHandler);

      UISettings.reset();
   }

   static reset(): void {
      UISettings.setTheme(Settings.props.theme);
      UISettings.setBeatNumbering(Settings.props.beatNumbering);
      UISettings.setRounding(Settings.props.rounding);
      UISettings.setInfoRow(Settings.props.infoRowCount);
      UISettings.setDataCheck(Settings.props.dataCheck);
      UISettings.setSortCheck(Settings.props.sorting);
      UISettings.setShowCheck(Settings.props.show);
      for (const id in Settings.props.load) {
         UISettings.setLoadCheck(id, Settings.props.load[id]);
      }
   }

   static clearHandler(): void {
      Settings.clear();
      Settings.reset();
      location.reload();
   }

   static #themeChangeHandler(ev: Event): void {
      const target = ev.target as HTMLSelectElement;
      Settings.props.theme = target.options[target.options.selectedIndex].value as ThemeName;
      UITheme.set(Settings.props.theme);
      Settings.save();
   }

   static #beatNumberingChangeHandler(ev: Event): void {
      const target = ev.target as HTMLSelectElement;
      Settings.props.beatNumbering = target.options[target.options.selectedIndex]
         .value as BeatNumbering;
      Settings.save();
   }

   static #roundingChangeHandler(ev: Event): void {
      const target = ev.target as HTMLInputElement;
      Settings.props.rounding = parseInt(target.value);
      Settings.save();
   }

   static #infoCountChangeHandler(ev: Event): void {
      const target = ev.target as HTMLInputElement;
      Settings.props.infoRowCount = parseInt(target.value);
      updateTableRow();
      Settings.save();
   }

   static #dataCheckChangeHandler(ev: Event): void {
      const target = ev.target as HTMLInputElement;
      Settings.props.dataCheck = target.checked;
      Settings.save();
   }

   static #showCheckHandler(ev: Event): void {
      const target = ev.target as HTMLInputElement;
      const id = target.id.replace('settings__show-', '') as ISettingsProps['show'];
      Settings.props.show = id;
      Settings.save();
   }

   static #checksPersistCheckHandler(ev: Event): void {
      const target = ev.target as HTMLInputElement;
      Settings.props.checks.persistent = target.checked;
      Settings.save();
   }

   static setShowCheck(id: string): void {
      UISettings.#htmlSettingsShow.forEach((elem) => {
         if (elem.id.endsWith(id)) {
            elem.checked = true;
         }
      });
   }

   static #sortCheckHandler(ev: Event): void {
      const target = ev.target as HTMLInputElement;
      Settings.props.sorting = target.checked;
      Settings.save();
   }

   static setSortCheck(bool: boolean): void {
      if (UISettings.#htmlSettingsSort) {
         UISettings.#htmlSettingsSort.checked = bool;
      }
   }

   static #loadCheckHandler(ev: Event): void {
      const target = ev.target as HTMLInputElement;
      const id = target.name;
      Settings.props.load[id] = target.checked;
      Settings.save();
   }

   static setLoadCheck(id: string, bool: boolean): void {
      UISettings.#htmlSettingsLoad.forEach((elem) => {
         if (elem.name === id) {
            elem.checked = bool;
         }
      });
   }

   static setTheme(str: ThemeName): void {
      UISettings.#htmlSettingsTheme.value = str;
   }

   static setBeatNumbering(str: BeatNumbering): void {
      UISettings.#htmlSettingsBeatNumbering.value = str;
   }

   static setRounding(num: number): void {
      UISettings.#htmlSettingsRounding.value = num.toString();
   }

   static setInfoRow(num: number): void {
      UISettings.#htmlSettingsInfoCount.value = num.toString();
      updateTableRow();
   }

   static setDataCheck(bool: boolean): void {
      UISettings.#htmlSettingsDataCheck.checked = bool;
   }

   static setChecksPersistent(bool: boolean): void {
      UISettings.#htmlSettingsChecksPersistent.checked = bool;
   }
}
