import { Tool, ToolArgs } from '../../types/mapcheck';
import UISelect from '../../ui/select';
import { round } from '../../utils';
import Parity from '../../analyzers/parity/parity';
import swing from '../../analyzers/swing/swing';
import { NoteContainer } from '../../types/beatmap/v3/container';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');
const htmlSelectRotation = UISelect.create(
    'input__tools-parity-rotation',
    'Wrist rotation type: ',
    'div',
    '',
    { text: 'Normal', value: '90' },
    { text: 'Extended', value: '135' },
    { text: 'Squid', value: '180' }
);
const htmlSelectParityLeft = UISelect.create(
    'input__tools-parity-left',
    'Left hand parity: ',
    'div',
    '',
    { text: 'Auto', value: 'auto' },
    { text: 'Forehand', value: 'forehand' },
    { text: 'Backhand', value: 'backhand' }
);
const htmlSelectParityRight = UISelect.create(
    'input__tools-parity-right',
    'Right hand parity: ',
    'div',
    '',
    { text: 'Auto', value: 'auto' },
    { text: 'Forehand', value: 'forehand' },
    { text: 'Backhand', value: 'backhand' }
);

htmlLabelCheck.textContent = ' Parity (EXPERIMENTAL)';
htmlLabelCheck.htmlFor = 'input__tools-parity-check';
htmlInputCheck.id = 'input__tools-parity-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = false;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);
htmlContainer.appendChild(document.createElement('br'));

const tool: Tool = {
    name: 'Parity check',
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 15,
        output: 135,
    },
    input: {
        enabled: htmlInputCheck.checked,
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

function inputCheckHandler(this: HTMLInputElement) {
    tool.input.enabled = this.checked;
}

function inputSelectRotateHandler(this: HTMLInputElement) {}
function inputSelectParityHandler(this: HTMLInputElement) {}

function check(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const { bpm } = map.settings;
    const { noteContainer } = map.difficulty!;
    const { warningThres, errorThres, allowedRot } = <
        { warningThres: number; errorThres: number; allowedRot: number }
    >tool.input.params;

    const lastNote: { [key: number]: NoteContainer } = {};
    const swingNoteArray: { [key: number]: NoteContainer[] } = {
        0: [],
        1: [],
        3: [],
    };
    const bombContext: { [key: number]: NoteContainer[] } = {
        0: [],
        1: [],
    };
    const lastBombContext: { [key: number]: NoteContainer[] } = {
        0: [],
        1: [],
    };

    const swingParity: { [key: number]: Parity } = {
        0: new Parity(noteContainer, 0, warningThres, errorThres, allowedRot),
        1: new Parity(noteContainer, 1, warningThres, errorThres, allowedRot),
    };
    const parity: { warning: number[]; error: number[] } = {
        warning: [],
        error: [],
    };

    const arr: NoteContainer[] = [];
    for (let i = 0, len = noteContainer.length; i < len; i++) {
        const note = noteContainer[i];
        if (note.type === 'note' && lastNote[note.data.color]) {
            if (
                swing.next(
                    note,
                    lastNote[note.data.color],
                    bpm,
                    swingNoteArray[note.data.color]
                )
            ) {
                // check previous swing parity
                const parityStatus = swingParity[note.data.color].check(
                    swingNoteArray[note.data.color],
                    lastBombContext[note.data.color]
                );
                switch (parityStatus) {
                    case 'warning': {
                        parity.warning.push(
                            swingNoteArray[note.data.color][0].data.time
                        );
                        break;
                    }
                    case 'error': {
                        parity.error.push(swingNoteArray[note.data.color][0].data.time);
                        break;
                    }
                }
                swingParity[note.data.color].next(
                    swingNoteArray[note.data.color],
                    lastBombContext[note.data.color]
                );
                lastBombContext[note.data.color] = bombContext[note.data.color];
                bombContext[note.data.color] = [];
                swingNoteArray[note.data.color] = [];
            }
        }
        if (note.type === 'bomb') {
            bombContext[0].push(note);
            bombContext[1].push(note);
        }
        if (note.type === 'note') {
            lastNote[note.data.color] = note;
            swingNoteArray[note.data.color].push(note);
        }
    }
    // final
    for (let i = 0; i < 2; i++) {
        if (lastNote[i]) {
            const parityStatus = swingParity[i].check(
                swingNoteArray[i],
                bombContext[i]
            );
            switch (parityStatus) {
                case 'warning': {
                    parity.warning.push(swingNoteArray[i][0].data.time);
                    break;
                }
                case 'error': {
                    parity.error.push(swingNoteArray[i][0].data.time);
                    break;
                }
            }
        }
    }
    return parity;
}

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const result = check(map);

    const htmlString: string[] = [];
    if (result.warning.length) {
        htmlString.push(
            `<b>Parity warning [${result.warning.length}]:</b> ${result.warning
                .filter(function (x, i, ary) {
                    return !i || x !== ary[i - 1];
                })
                .sort((a, b) => a - b)
                .map((n) => round(map.settings.bpm.adjustTime(n), 3))
                .join(', ')}`
        );
    }
    if (result.error.length) {
        htmlString.push(
            `<b>Parity error [${result.error.length}]:</b> ${result.error
                .filter(function (x, i, ary) {
                    return !i || x !== ary[i - 1];
                })
                .sort((a, b) => a - b)
                .map((n) => round(map.settings.bpm.adjustTime(n), 3))
                .join(', ')}`
        );
    }

    if (htmlString.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = htmlString.join('<br>');
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
