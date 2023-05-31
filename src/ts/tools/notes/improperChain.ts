import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { NoteContainer } from '../../types/beatmap/wrapper/container';
import UICheckbox from '../../ui/helpers/checkbox';
import { printResultTime } from '../helpers';
import { NoteDirection } from '../../beatmap/shared/constants';

const name = 'Improper Chain';
const description = 'Check for correct use of chain.';
const enabled = true;

const tool: Tool = {
    name,
    description,
    type: 'note',
    order: {
        input: ToolInputOrder.NOTES_IMPROPER_CHAIN,
        output: ToolOutputOrder.NOTES_IMPROPER_CHAIN,
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
        .sort((a, b) => (a.type !== 'chain' ? 1 : b.type !== 'chain' ? -1 : 0))
        .sort((a, b) => a.data.time - b.data.time);

    const arr: NoteContainer[] = [];
    for (let i = 0, potential = true, len = noteContainer.length; i < len; i++) {
        const chain = noteContainer[i];
        if (chain.type === 'chain') {
            potential = true;
            for (let j = i; j < len; j++) {
                const other = noteContainer[j];
                if (other.type === 'note') {
                    if (
                        chain.data.posX === other.data.posX &&
                        chain.data.posY === other.data.posY &&
                        other.data.time <= chain.data.time + 0.001 &&
                        chain.data.color === other.data.color &&
                        (other.data.direction !== NoteDirection.ANY
                            ? chain.data.direction === other.data.direction
                            : true)
                    ) {
                        potential = false;
                        break;
                    }
                }
                if (other.type === 'bomb') {
                    if (
                        chain.data.posX === other.data.posX &&
                        chain.data.posY === other.data.posY &&
                        other.data.time <= chain.data.time + 0.001
                    ) {
                        break;
                    }
                }
                if (other.data.time > chain.data.time + 0.001) {
                    break;
                }
            }
            if (potential) {
                arr.push(chain);
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
        tool.output.html = printResultTime('Improper chain', result, map.settings.bpm, 'error');
    } else {
        tool.output.html = null;
    }
}

export default tool;
