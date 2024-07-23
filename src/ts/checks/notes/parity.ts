import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UISelect from '../../ui/helpers/select';
import { ObjectContainerType } from '../../types/checks/container';
import UIInput from '../../ui/helpers/input';
import { NoteColor, types } from 'bsmap';
import { swing, parity } from 'bsmap/extensions';

const name = 'Parity Check';
const description = 'Perform parity check.';
const enabled = false;

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

htmlContainer.appendChild(
   UIInput.createBlock(
      UIInput.createCheckbox(
         function (this: HTMLInputElement) {
            tool.input.enabled = this.checked;
         },
         name + ' (EXPERIMENTAL)',
         description,
         enabled,
      ),
   ),
);

const tool: ITool<{ warningThres: number; errorThres: number; allowedRot: number }> = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_PARITY,
      output: ToolOutputOrder.NOTES_PARITY,
   },
   input: {
      enabled,
      params: {
         warningThres: 90,
         errorThres: 45,
         allowedRot: 90,
      },
      html: htmlContainer,
   },
   run,
};

function inputSelectRotateHandler(this: HTMLInputElement) {}
function inputSelectParityHandler(this: HTMLInputElement) {}

function check(args: ToolArgs) {
   const { timeProcessor, noteContainer } = args.beatmap;
   const { warningThres, errorThres, allowedRot } = <
      {
         warningThres: number;
         errorThres: number;
         allowedRot: number;
      }
   >tool.input.params;

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

   const swingParity: { [key: number]: parity.Parity } = {
      [NoteColor.RED]: new parity.Parity(
         args.beatmap.data.colorNotes,
         args.beatmap.data.bombNotes,
         0,
         warningThres,
         errorThres,
         allowedRot,
      ),
      [NoteColor.BLUE]: new parity.Parity(
         args.beatmap.data.colorNotes,
         args.beatmap.data.bombNotes,
         1,
         warningThres,
         errorThres,
         allowedRot,
      ),
   };
   const parityAry: {
      warning: types.wrapper.IWrapColorNote[];
      error: types.wrapper.IWrapColorNote[];
   } = {
      warning: [],
      error: [],
   };
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

function run(args: ToolArgs): IToolOutput[] {
   const result = check(args);
   result.warning = result.warning;
   result.error = result.error;

   const results: IToolOutput[] = [];
   if (result.warning.length) {
      results.push({
         type: 'time',
         label: 'Parity warning',
         value: result.warning,
         symbol: 'warning',
      });
   }
   if (result.error.length) {
      results.push({
         type: 'time',
         label: 'Parity error',
         value: result.error,
         symbol: 'error',
      });
   }
   return results;
}

export default tool;
