import { Settings } from '../../settings';
import { TimeProcessor } from 'bsmap';
import { round, secToMmss } from 'bsmap/utils';
import { UIInfoHTML } from './html';
import { displayTableRow, hideTableRow } from './helpers';

export function setBPMChanges(bpm?: TimeProcessor | null): void {
   if (!bpm || !bpm.change.length) {
      hideTableRow(UIInfoHTML.htmlTableBPMChanges);
      return;
   }
   const bpmcText = bpm.change.map((bpmc) => {
      const time = round(bpmc.newTime, Settings.props.rounding);
      const rt = bpm.toRealTime(bpmc.time);
      return `${time} | ${secToMmss(rt)} -- ${bpmc.BPM}`;
   });
   displayTableRow(UIInfoHTML.htmlTableBPMChanges, bpmcText, 'bpmChanges');
}
