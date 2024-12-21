import { NoteJumpSpeed } from 'bsmap';
import { round } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { IBeatmapItem } from '../../types';

const htmlSettingsVersion = document.getElementById(
   'stats__table-settings-version',
) as HTMLTableCellElement;
const htmlSettingsNjs = document.getElementById(
   'stats__table-settings-njs',
) as HTMLTableCellElement;
const htmlSettingsNjsMin = document.getElementById(
   'stats__table-settings-njs-min',
) as HTMLTableCellElement;
const htmlSettingsNjsMax = document.getElementById(
   'stats__table-settings-njs-max',
) as HTMLTableCellElement;
const htmlSettingsNjsCount = document.getElementById(
   'stats__table-settings-njs-count',
) as HTMLTableCellElement;
const htmlSettingsSdm = document.getElementById(
   'stats__table-settings-sdm',
) as HTMLTableCellElement;
const htmlSettingsHjd = document.getElementById(
   'stats__table-settings-hjd',
) as HTMLTableCellElement;
const htmlSettingsJd = document.getElementById('stats__table-settings-jd') as HTMLTableCellElement;
const htmlSettingsRt = document.getElementById('stats__table-settings-rt') as HTMLTableCellElement;

export function updateSettingsTable(
   info: types.wrapper.IWrapInfo,
   beatmapItem: IBeatmapItem,
): void {
   const njs = NoteJumpSpeed.create(
      info.audio.bpm,
      beatmapItem.settings.njs || NoteJumpSpeed.FallbackNJS[beatmapItem.settings.difficulty],
      beatmapItem.settings.njsOffset,
   );
   const njsEvents = beatmapItem.data.njsEvents.toSorted((a, b) => a.value - b.value);

   htmlSettingsVersion.textContent =
      (beatmapItem.rawData as any).version || (beatmapItem.rawData as any)._version || 'N/A';
   htmlSettingsNjs.textContent = round(njs.value, 3).toString();
   htmlSettingsNjsMax.textContent = round(njs.value + (njsEvents.at(0)?.value || 0), 3).toString();
   htmlSettingsNjsMin.textContent = round(njs.value + (njsEvents.at(-1)?.value || 0), 3).toString();
   htmlSettingsNjsCount.textContent = round(njsEvents.length, 3).toString();
   htmlSettingsSdm.textContent = round(njs.offset, 3).toString();
   htmlSettingsHjd.textContent = round(njs.hjd, 3).toString();
   htmlSettingsJd.textContent = round(njs.jd, 3).toString();
   htmlSettingsRt.textContent = round(njs.reactionTime * 1000).toString() + 'ms';
}
