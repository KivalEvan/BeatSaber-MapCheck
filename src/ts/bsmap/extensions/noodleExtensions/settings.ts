import type { TimeProcessor } from '../../beatmap/helpers/timeProcessor.ts';
import type { NoteJumpSpeed } from '../../beatmap/helpers/njs.ts';

export const settings: {
   BPM: TimeProcessor | null;
   NJS: NoteJumpSpeed | null;
} = {
   BPM: null,
   NJS: null,
};
