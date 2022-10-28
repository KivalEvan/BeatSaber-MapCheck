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
    // kinda slow but i need slider first
    const noteContainer = [...map.difficulty!.noteContainer]
        .sort((a, b) => (a.type !== 'slider' ? 1 : b.type !== 'slider' ? -1 : 0))
        .sort((a, b) => a.data.time - b.data.time);

    const arr: NoteContainer[] = [];
    for (let i = 0, potential = true, len = noteContainer.length; i < len; i++) {
        const arc = noteContainer[i];
        if (arc.type === 'slider') {
            potential = true;
            for (let j = i, sike = false; j < len; j++) {
                const other = noteContainer[j];
                if (other.type === 'note') {
                    if (
                        arc.data.posX === other.data.posX &&
                        arc.data.posY === other.data.posY &&
                        other.data.time <= arc.data.time + 0.001 &&
                        arc.data.color === other.data.color &&
                        (other.data.direction !== NoteDirection.ANY
                            ? arc.data.direction === other.data.direction
                            : true)
                    ) {
                        for (let k = j; k < len; k++) {
                            const tailNote = noteContainer[j];
                            if (tailNote.type === 'bomb') {
                                if (
                                    arc.data.posX === tailNote.data.posX &&
                                    arc.data.posY === tailNote.data.posY &&
                                    tailNote.data.time <= arc.data.time + 0.001
                                ) {
                                    sike = true;
                                    break;
                                }
                            }
                            if (tailNote.type !== 'note' || tailNote.data.time < arc.data.tailTime) {
                                continue;
                            }
                            if (
                                arc.data.posX === other.data.posX &&
                                arc.data.posY === other.data.posY &&
                                other.data.time <= arc.data.time + 0.001 &&
                                (arc.data.color !== other.data.color ||
                                    (other.data.direction !== NoteDirection.ANY
                                        ? arc.data.direction !== other.data.direction
                                        : true))
                            ) {
                                sike = true;
                                break;
                            }
                            if (other.data.time > arc.data.tailTime + 0.001) {
                                break;
                            }
                        }
                        potential = sike || false;
                        break;
                    }
                }
                if (other.type === 'bomb') {
                    if (
                        arc.data.posX === other.data.posX &&
                        arc.data.posY === other.data.posY &&
                        other.data.time <= arc.data.time + 0.001
                    ) {
                        break;
                    }
                }
                if (other.data.time > arc.data.time + 0.001) {
                    break;
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
        tool.output.html = printResultTime('Improper arc', result, map.settings.bpm);
    } else {
        tool.output.html = null;
    }
}

export default tool;
