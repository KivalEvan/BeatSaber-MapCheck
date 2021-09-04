import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';
import * as swing from '../swing';
import { Parity } from '../parity';
import { create as selectCreate } from '../../ui/select';

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
    run: run,
};

function inputCheckHandler(this: HTMLInputElement) {
    tool.input.enabled = this.checked;
}

function inputSelectRotateHandler(this: HTMLInputElement) {}
function inputSelectParityHandler(this: HTMLInputElement) {}

function check(mapSettings: BeatmapSettings, mapSet: beatmap.map.BeatmapSetData) {
    const { _bpm: bpm } = mapSettings;
    const { _notes: notes } = mapSet._data;
    const { warningThres, errorThres, allowedRot } = <
        { warningThres: number; errorThres: number; allowedRot: number }
    >tool.input.params;

    const lastNote: { [key: number]: beatmap.note.Note } = {};
    const swingNoteArray: { [key: number]: beatmap.note.Note[] } = {
        0: [],
        1: [],
        3: [],
    };
    const bombContext: { [key: number]: beatmap.note.Note[] } = {
        0: [],
        1: [],
    };
    const lastBombContext: { [key: number]: beatmap.note.Note[] } = {
        0: [],
        1: [],
    };

    const swingParity: { [key: number]: Parity } = {
        0: new Parity(notes, 0, warningThres, errorThres, allowedRot),
        1: new Parity(notes, 1, warningThres, errorThres, allowedRot),
    };
    const parity: { warning: number[]; error: number[] } = {
        warning: [],
        error: [],
    };

    const arr: beatmap.note.Note[] = [];
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        if (beatmap.note.isNote(note) && lastNote[note._type]) {
            if (
                swing.next(note, lastNote[note._type], bpm, swingNoteArray[note._type])
            ) {
                // check previous swing parity
                const parityStatus = swingParity[note._type].check(
                    swingNoteArray[note._type],
                    lastBombContext[note._type]
                );
                switch (parityStatus) {
                    case 'warning': {
                        parity.warning.push(swingNoteArray[note._type][0]._time);
                        break;
                    }
                    case 'error': {
                        parity.error.push(swingNoteArray[note._type][0]._time);
                        break;
                    }
                }
                swingParity[note._type].next(
                    swingNoteArray[note._type],
                    lastBombContext[note._type]
                );
                lastBombContext[note._type] = bombContext[note._type];
                bombContext[note._type] = [];
                swingNoteArray[note._type] = [];
            }
        }
        if (note._type === 3) {
            bombContext[0].push(note);
            bombContext[1].push(note);
        }
        lastNote[note._type] = note;
        swingNoteArray[note._type].push(note);
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
                    parity.warning.push(swingNoteArray[i][0]._time);
                    break;
                }
                case 'error': {
                    parity.error.push(swingNoteArray[i][0]._time);
                    break;
                }
            }
        }
    }
    return parity;
}

function run(mapSettings: BeatmapSettings, mapSet?: beatmap.map.BeatmapSetData): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const result = check(mapSettings, mapSet);

    const htmlString: string[] = [];
    if (result.warning.length) {
        htmlString.push(
            `<b>Parity warning [${result.warning.length}]:</b> ${result.warning
                .filter(function (x, i, ary) {
                    return !i || x !== ary[i - 1];
                })
                .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
                .join(', ')}`
        );
    }
    if (result.error.length) {
        htmlString.push(
            `<b>Parity error [${result.error.length}]:</b> ${result.error
                .filter(function (x, i, ary) {
                    return !i || x !== ary[i - 1];
                })
                .map((n) => round(mapSettings._bpm.adjustTime(n), 3))
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
