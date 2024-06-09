import Settings from '../../settings';
import { round, toMmss } from '../../bsmap/utils/mod';
import { TimeProcessor } from '../../bsmap/beatmap/helpers/timeProcessor';
import { htmlTableBPMChanges } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setBPMChanges(bpm?: TimeProcessor | null): void {
   if (!bpm || !bpm.change.length) {
      hideTableRow(htmlTableBPMChanges);
      return;
   }
   const bpmcText = bpm.change.map((bpmc) => {
      const time = round(bpmc.newTime, Settings.rounding);
      const rt = bpm.toRealTime(bpmc.time);
      return `${time} | ${toMmss(rt)} -- ${bpmc.BPM}`;
   });
   displayTableRow(htmlTableBPMChanges, bpmcText);
}
