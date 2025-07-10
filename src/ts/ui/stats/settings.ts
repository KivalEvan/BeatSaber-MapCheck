import { NoteJumpSpeed } from 'bsmap';
import { round } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { IBeatmapContainer } from '../../types';

export class UIStatsSettings {
   static #htmlSettingsVersion: HTMLTableCellElement;
   static #htmlSettingsNjs: HTMLTableCellElement;
   static #htmlSettingsNjsMin: HTMLTableCellElement;
   static #htmlSettingsNjsMax: HTMLTableCellElement;
   static #htmlSettingsNjsCount: HTMLTableCellElement;
   static #htmlSettingsSdm: HTMLTableCellElement;
   static #htmlSettingsHjd: HTMLTableCellElement;
   static #htmlSettingsJd: HTMLTableCellElement;
   static #htmlSettingsRt: HTMLTableCellElement;

   static init(): void {
      UIStatsSettings.#htmlSettingsVersion = document.querySelector(
         '#stats__table-settings-version',
      )!;
      UIStatsSettings.#htmlSettingsNjs = document.querySelector('#stats__table-settings-njs')!;
      UIStatsSettings.#htmlSettingsNjsMin = document.querySelector(
         '#stats__table-settings-njs-min',
      )!;
      UIStatsSettings.#htmlSettingsNjsMax = document.querySelector(
         '#stats__table-settings-njs-max',
      )!;
      UIStatsSettings.#htmlSettingsNjsCount = document.querySelector(
         '#stats__table-settings-njs-count',
      )!;
      UIStatsSettings.#htmlSettingsSdm = document.querySelector('#stats__table-settings-sdm')!;
      UIStatsSettings.#htmlSettingsHjd = document.querySelector('#stats__table-settings-hjd')!;
      UIStatsSettings.#htmlSettingsJd = document.querySelector('#stats__table-settings-jd')!;
      UIStatsSettings.#htmlSettingsRt = document.querySelector('#stats__table-settings-rt')!;
   }

   static updateTable(info: types.wrapper.IWrapInfo, beatmap: IBeatmapContainer): void {
      const njs = NoteJumpSpeed.create(
         info.audio.bpm,
         beatmap.info.njs || NoteJumpSpeed.FallbackNJS[beatmap.info.difficulty],
         beatmap.info.njsOffset,
      );
      const njsEvents = beatmap.data.difficulty.njsEvents.toSorted((a, b) => a.value - b.value);

      UIStatsSettings.#htmlSettingsVersion.textContent =
         (beatmap.rawData as any).version || (beatmap.rawData as any)._version || 'N/A';
      UIStatsSettings.#htmlSettingsNjs.textContent = round(njs.value, 3).toString();
      UIStatsSettings.#htmlSettingsNjsMax.textContent = round(
         njs.value + (njsEvents.at(0)?.value || 0),
         3,
      ).toString();
      UIStatsSettings.#htmlSettingsNjsMin.textContent = round(
         njs.value + (njsEvents.at(-1)?.value || 0),
         3,
      ).toString();
      UIStatsSettings.#htmlSettingsNjsCount.textContent = round(njsEvents.length, 3).toString();
      UIStatsSettings.#htmlSettingsSdm.textContent = round(njs.offset, 3).toString();
      UIStatsSettings.#htmlSettingsHjd.textContent = round(njs.hjd, 3).toString();
      UIStatsSettings.#htmlSettingsJd.textContent = round(njs.jd, 3).toString();
      UIStatsSettings.#htmlSettingsRt.textContent =
         round(njs.reactionTime * 1000).toString() + 'ms';
   }
}
