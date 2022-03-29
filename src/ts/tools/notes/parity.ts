import { Tool, ToolArgs } from '../../types/mapcheck';
import { create as selectCreate } from '../../ui/select';
import { round } from '../../utils';
import * as beatmap from '../../beatmap';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');
const htmlSelectRotation = selectCreate(
    'input__tools-parity-rotation',
    'Wrist rotation type: ',
    'div',
    '',
    { text: 'Normal', value: '90' },
    { text: 'Extended', value: '135' },
    { text: 'Squid', value: '180' }
);
const htmlSelectParityLeft = selectCreate(
    'input__tools-parity-left',
    'Left hand parity: ',
    'div',
    '',
    { text: 'Auto', value: 'auto' },
    { text: 'Forehand', value: 'forehand' },
    { text: 'Backhand', value: 'backhand' }
);
const htmlSelectParityRight = selectCreate(
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
    const { bpm } = map.settings;
    const { colorNotes } = map.difficulty.data;
    const { warningThres, errorThres, allowedRot } = <
        { warningThres: number; errorThres: number; allowedRot: number }
    >tool.input.params;

    const lastNote: { [key: number]: beatmap.v3.ColorNote } = {};
    const swingNoteArray: { [key: number]: beatmap.v3.ColorNote[] } = {
        0: [],
        1: [],
        3: [],
    };
    const bombContext: { [key: number]: beatmap.v3.ColorNote[] } = {
        0: [],
        1: [],
    };
    const lastBombContext: { [key: number]: beatmap.v3.ColorNote[] } = {
        0: [],
        1: [],
    };

    const swingParity: { [key: number]: parity.Parity } = {
        0: new parity.Parity(colorNotes, 0, warningThres, errorThres, allowedRot),
        1: new parity.Parity(colorNotes, 1, warningThres, errorThres, allowedRot),
    };
    const parity: { warning: number[]; error: number[] } = {
        warning: [],
        error: [],
    };

    const arr: beatmap.v3.ColorNote[] = [];
    for (let i = 0, len = colorNotes.length; i < len; i++) {
        const note = colorNotes[i];
        if (note.isNote(note) && lastNote[note.color]) {
            if (
                swing.next(note, lastNote[note.color], bpm, swingNoteArray[note.color])
            ) {
                // check previous swing parity
                const parityStatus = swingParity[note.color].check(
                    swingNoteArray[note.color],
                    lastBombContext[note.color]
                );
                switch (parityStatus) {
                    case 'warning': {
                        parity.warning.push(swingNoteArray[note.color][0].time);
                        break;
                    }
                    case 'error': {
                        parity.error.push(swingNoteArray[note.color][0].time);
                        break;
                    }
                }
                swingParity[note.color].next(
                    swingNoteArray[note.color],
                    lastBombContext[note.color]
                );
                lastBombContext[note.color] = bombContext[note.color];
                bombContext[note.color] = [];
                swingNoteArray[note.color] = [];
            }
        }
        if (note.color === 3) {
            bombContext[0].push(note);
            bombContext[1].push(note);
        }
        lastNote[note.color] = note;
        swingNoteArray[note.color].push(note);
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

function run(map: ToolArgs) {
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
