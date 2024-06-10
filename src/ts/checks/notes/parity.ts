import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UISelect from '../../ui/helpers/select';
import Parity from '../../bsmap/extensions/parity/parity';
import swing from '../../bsmap/extensions/swing/swing';
import { INoteContainer, NoteContainerType } from '../../types/checks/container';
import { printResultTime } from '../helpers';
import UIInput from '../../ui/helpers/input';
import { NoteColor } from '../../bsmap/beatmap/shared/constants';
import { IWrapBombNote } from '../../bsmap/types/beatmap/wrapper/bombNote';
import { IWrapColorNote } from '../../bsmap/types/beatmap/wrapper/colorNote';

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

const tool: Tool<{ warningThres: number; errorThres: number; allowedRot: number }> = {
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
   output: {
      html: null,
   },
   run,
};

function inputSelectRotateHandler(this: HTMLInputElement) {}
function inputSelectParityHandler(this: HTMLInputElement) {}

function check(args: ToolArgs) {
   const { timeProcessor } = args.settings;
   const { noteContainer } = args.beatmap!;
   const { warningThres, errorThres, allowedRot } = <
      {
         warningThres: number;
         errorThres: number;
         allowedRot: number;
      }
   >tool.input.params;

   const lastNote: { [key: number]: IWrapColorNote } = {};
   const swingNoteArray: { [key: number]: IWrapColorNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };
   const bombContext: { [key: number]: IWrapBombNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };
   const lastBombContext: { [key: number]: IWrapBombNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };

   const swingParity: { [key: number]: Parity } = {
      [NoteColor.RED]: new Parity(
         args.beatmap!.data.colorNotes,
         args.beatmap!.data.bombNotes,
         0,
         warningThres,
         errorThres,
         allowedRot,
      ),
      [NoteColor.BLUE]: new Parity(
         args.beatmap!.data.colorNotes,
         args.beatmap!.data.bombNotes,
         1,
         warningThres,
         errorThres,
         allowedRot,
      ),
   };
   const parity: { warning: number[]; error: number[] } = {
      warning: [],
      error: [],
   };
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const note = noteContainer[i];
      if (note.type === NoteContainerType.COLOR && lastNote[note.data.color]) {
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
                  parity.warning.push(swingNoteArray[note.data.color][0].time);
                  break;
               }
               case 'error': {
                  parity.error.push(swingNoteArray[note.data.color][0].time);
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
      if (note.type === NoteContainerType.BOMB) {
         bombContext[NoteColor.RED].push(note.data);
         bombContext[NoteColor.BLUE].push(note.data);
      }
      if (note.type === NoteContainerType.COLOR) {
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
               parity.warning.push(swingNoteArray[i][0].time);
               break;
            }
            case 'error': {
               parity.error.push(swingNoteArray[i][0].time);
               break;
            }
         }
      }
   }
   return parity;
}

function run(args: ToolArgs) {
   if (!args.beatmap) {
      console.error('Something went wrong!');
      return;
   }
   const result = check(args);
   result.warning = result.warning
      .filter(function (x, i, ary) {
         return !i || x !== ary[i - 1];
      })
      .sort((a, b) => a - b);
   result.error = result.error
      .filter(function (x, i, ary) {
         return !i || x !== ary[i - 1];
      })
      .sort((a, b) => a - b);

   const htmlResult: HTMLElement[] = [];
   if (result.warning.length) {
      htmlResult.push(
         printResultTime('Parity warning', result.warning, args.settings.timeProcessor, 'warning'),
      );
   }
   if (result.error.length) {
      htmlResult.push(
         printResultTime('Parity error', result.error, args.settings.timeProcessor, 'error'),
      );
   }

   if (htmlResult.length) {
      const htmlContainer = document.createElement('div');
      htmlResult.forEach((h) => htmlContainer.append(h));
      tool.output.html = htmlContainer;
   } else {
      tool.output.html = null;
   }
}

export default tool;
