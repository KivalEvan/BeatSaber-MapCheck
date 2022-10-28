import Settings from '../../settings';
import { round, toMMSS } from '../../utils';
import { BeatPerMinute } from '../../beatmap/shared/bpm';
import { htmlTableBPMChanges } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setBPMChanges(bpm?: BeatPerMinute | null): void {
    if (!bpm || !bpm.change.length) {
        hideTableRow(htmlTableBPMChanges);
        return;
    }
    const bpmcText = bpm.change.map((bpmc) => {
        const time = round(bpmc.newTime, Settings.rounding);
        const rt = bpm.toRealTime(bpmc.time);
        return `${time} | ${toMMSS(rt)} -- ${bpmc.BPM}`;
    });
    displayTableRow(htmlTableBPMChanges, bpmcText);
}
