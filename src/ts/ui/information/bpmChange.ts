import Settings from '../../settings';
import { round, toMmss, TimeProcessor } from 'bsmap';
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
