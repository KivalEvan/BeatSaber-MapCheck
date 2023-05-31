import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { NoteContainer } from '../../types/beatmap/wrapper/container';
import UICheckbox from '../../ui/helpers/checkbox';
import { printResultTime } from '../helpers';
import { NoteDirection } from '../../beatmap/shared/constants';

const name = 'Improper Arc';
const description = 'Check for correct use of arc.';
const enabled = true;

const tool: Tool = {
    name,
    description,
    type: 'note',
    order: {
        input: ToolInputOrder.NOTES_IMPROPER_ARC,
        output: ToolOutputOrder.NOTES_IMPROPER_ARC,
    },
    input: {
        enabled,
        params: {},
        html: UICheckbox.create(name, description, enabled, function (this: HTMLInputElement) {
            tool.input.enabled = this.checked;
        }),
    },
    output: {
        html: null,
    },
    run,
};

function check(map: ToolArgs) {
    // kinda slow but i need arc first
    const noteContainer = [...map.difficulty!.noteContainer]
        .sort((a, b) => (a.type !== 'arc' ? 1 : b.type !== 'arc' ? -1 : 0))
        .sort((a, b) => a.data.time - b.data.time);

    const arr: NoteContainer[] = [];
    for (let i = 0, potential = true, len = noteContainer.length; i < len; i++) {
        const arc = noteContainer[i];
        const lastTime = noteContainer.at(-1)!.data.time;
        if (arc.type === 'arc') {
            potential = true;
            for (let j = i, sike = false; j < len; j++) {
                const head = noteContainer[j];
                if (head.type === 'note') {
                    if (
                        arc.data.posX === head.data.posX &&
                        arc.data.posY === head.data.posY &&
                        head.data.time <= arc.data.time + 0.001 &&
                        arc.data.color === head.data.color &&
                        (head.data.direction !== NoteDirection.ANY
                            ? arc.data.direction === head.data.direction
                            : true)
                    ) {
                        for (let k = j; k < len; k++) {
                            const tail = noteContainer[j];
                            if (tail.type === 'bomb') {
                                if (
                                    arc.data.posX === tail.data.posX &&
                                    arc.data.posY === tail.data.posY &&
                                    tail.data.time <= arc.data.time + 0.001
                                ) {
                                    sike = true;
                                    break;
                                }
                            }
                            if (tail.type !== 'note' || tail.data.time < arc.data.tailTime) {
                                continue;
                            }
                            if (
                                arc.data.posX === head.data.posX &&
                                arc.data.posY === head.data.posY &&
                                head.data.time <= arc.data.time + 0.001 &&
                                (arc.data.color !== head.data.color ||
                                    (head.data.direction !== NoteDirection.ANY
                                        ? arc.data.direction !== head.data.direction
                                        : true))
                            ) {
                                sike = true;
                                break;
                            }
                            if (head.data.time > arc.data.tailTime + 0.001) {
                                break;
                            }
                        }
                        potential = sike || false;
                        break;
                    }
                }
                if (head.type === 'bomb') {
                    if (
                        arc.data.posX === head.data.posX &&
                        arc.data.posY === head.data.posY &&
                        head.data.time <= arc.data.time + 0.001
                    ) {
                        break;
                    }
                }
                if (head.data.time > arc.data.time + 0.001) {
                    potential = false;
                    break;
                }
                if (
                    (head.type === 'arc' || head.type === 'chain') &&
                    head.data.time + 0.001 > lastTime
                ) {
                    potential = false;
                }
            }
            if (potential) {
                arr.push(arc);
            }
        }
    }
    return arr
        .map((n) => n.data.time)
        .filter(function (x, i, ary) {
            return !i || x !== ary[i - 1];
        });
}

function run(map: ToolArgs) {
    const result = check(map);

    if (result.length) {
        tool.output.html = printResultTime('Improper arc', result, map.settings.bpm, 'error');
    } else {
        tool.output.html = null;
    }
}

export default tool;
