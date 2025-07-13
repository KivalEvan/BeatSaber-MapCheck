import {
   ICheck,
   ICheckOutput,
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   OutputType,
   OutputStatus,
} from '../../types';
import { UISelect } from '../../ui/helpers/select';
import { ObjectContainerType } from '../../types/container';
import { UIInput } from '../../ui/helpers/input';
import { NoteColor } from 'bsmap';
import * as types from 'bsmap/types';
import { parity, swing } from 'bsmap/extensions';

const name = 'Parity Check';
const description = 'Perform parity check.';
const enabled = true;

const htmlContainer = document.createElement('div');
const htmlSelectRotation = UISelect.create(
   'input__checks-parity-rotation',
   'Wrist rotation type: ',
   'div',
   '',
   { text: 'Normal', value: '90' },
   { text: 'Extended', value: '135' },
   { text: 'Squid', value: '180' },
);
const htmlSelectParityLeft = UISelect.create(
   'input__checks-parity-left',
   'Left hand parity: ',
   'div',
   '',
   { text: 'Auto', value: 'auto' },
   { text: 'Forehand', value: 'forehand' },
   { text: 'Backhand', value: 'backhand' },
);
const htmlSelectParityRight = UISelect.create(
   'input__checks-parity-right',
   'Right hand parity: ',
   'div',
   '',
   { text: 'Auto', value: 'auto' },
   { text: 'Forehand', value: 'forehand' },
   { text: 'Backhand', value: 'backhand' },
);

const [htmlInput, htmlLabel] = UIInput.createCheckbox(
   function (this: HTMLInputElement) {
      tool.input.params.enabled = this.checked;
   },
   name,
   description,
   enabled,
);

htmlContainer.appendChild(UIInput.createBlock(htmlInput, htmlLabel));

function update() {
   htmlInput.checked = tool.input.params.enabled;
}

const tool: ICheck<{ warningThres: number; errorThres: number; allowedRot: number }> = {
   name,
   description,
   type: CheckType.NOTE,
   order: { input: CheckInputOrder.NOTES_PARITY, output: CheckOutputOrder.NOTES_PARITY },
   input: {
      params: { enabled, warningThres: 90, errorThres: 45, allowedRot: 90 },
      ui: () => htmlContainer,
      update,
   },
   run,
};

function inputSelectRotateHandler(this: HTMLInputElement) {}
function inputSelectParityHandler(this: HTMLInputElement) {}

function check(args: CheckArgs) {
   const { timeProcessor, noteContainer } = args.beatmap;
   const { warningThres, errorThres, allowedRot } = tool.input.params;

   const lastNote: { [key: number]: types.wrapper.IWrapColorNote } = {};
   const swingNoteArray: { [key: number]: types.wrapper.IWrapColorNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };
   const bombContext: { [key: number]: types.wrapper.IWrapBombNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };
   const lastBombContext: { [key: number]: types.wrapper.IWrapBombNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };

   const swingParity: {
      [key: number]: parity.Parity<types.wrapper.IWrapColorNote, types.wrapper.IWrapBombNote>;
   } = {
      [NoteColor.RED]: new parity.Parity(
         args.beatmap.data.difficulty.colorNotes,
         args.beatmap.data.difficulty.bombNotes,
         0,
         warningThres,
         errorThres,
         allowedRot,
      ),
      [NoteColor.BLUE]: new parity.Parity(
         args.beatmap.data.difficulty.colorNotes,
         args.beatmap.data.difficulty.bombNotes,
         1,
         warningThres,
         errorThres,
         allowedRot,
      ),
   };
   const parityAry: {
      warning: types.wrapper.IWrapColorNote[];
      error: types.wrapper.IWrapColorNote[];
   } = { warning: [], error: [] };
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const note = noteContainer[i];
      if (note.type === ObjectContainerType.COLOR && lastNote[note.data.color]) {
         if (
            swing.next(
               note.data,
               lastNote[note.data.color],
               timeProcessor,
               swingNoteArray[note.data.color],
            )
         ) {
            // check previous swing parity
            const parityStatus = swingParity[note.data.color].check(
               swingNoteArray[note.data.color],
               lastBombContext[note.data.color],
            );
            switch (parityStatus) {
               case 'warning': {
                  parityAry.warning.push(swingNoteArray[note.data.color][0]);
                  break;
               }
               case 'error': {
                  parityAry.error.push(swingNoteArray[note.data.color][0]);
                  break;
               }
            }
            swingParity[note.data.color].next(
               swingNoteArray[note.data.color],
               lastBombContext[note.data.color],
            );
            lastBombContext[note.data.color] = bombContext[note.data.color];
            bombContext[note.data.color] = [];
            swingNoteArray[note.data.color] = [];
         }
      }
      if (note.type === ObjectContainerType.BOMB) {
         bombContext[NoteColor.RED].push(note.data);
         bombContext[NoteColor.BLUE].push(note.data);
      }
      if (note.type === ObjectContainerType.COLOR) {
         lastNote[note.data.color] = note.data;
         swingNoteArray[note.data.color].push(note.data);
      }
   }
   // final
   for (let i = 0; i < 2; i++) {
      if (lastNote[i]) {
         const parityStatus = swingParity[i].check(swingNoteArray[i], bombContext[i]);
         switch (parityStatus) {
            case 'warning': {
               parityAry.warning.push(swingNoteArray[i][0]);
               break;
            }
            case 'error': {
               parityAry.error.push(swingNoteArray[i][0]);
               break;
            }
         }
      }
   }
   return parityAry;
}

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args);
   result.warning = result.warning;
   result.error = result.error;

   const results: ICheckOutput[] = [];
   if (result.warning.length) {
      results.push({
         status: OutputStatus.WARNING,
         label: 'Parity warning',
         type: OutputType.TIME,
         value: result.warning,
      });
   }
   if (result.error.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Parity error',
         type: OutputType.TIME,
         value: result.error,
      });
   }
   return results;
}

export default tool;
