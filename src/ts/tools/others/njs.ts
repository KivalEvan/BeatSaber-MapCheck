import { NoteJumpSpeed } from '../../beatmap/mod';
import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import UICheckbox from '../../ui/helpers/checkbox';
import { round } from '../../utils';
import { printResult } from '../helpers';

const name = 'NJS Check';
const description = 'Check note jump speed for suitable value.';
const enabled = true;

const tool: Tool<{}> = {
    name,
    description,
    type: 'other',
    order: {
        input: ToolInputOrder.OTHERS_NJS,
        output: ToolOutputOrder.OTHERS_NJS,
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

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const { njs, bpm } = map.settings;

    const htmlResult: HTMLElement[] = [];
    if (map.difficulty.info._noteJumpMovementSpeed === 0) {
        htmlResult.push(printResult('Unset NJS', 'fallback NJS is used', 'error'));
    }
    if (njs.value > 23) {
        htmlResult.push(
            printResult(`NJS is too high (${round(njs.value, 2)})`, 'use lower whenever necessary', 'warning'),
        );
    }
    if (njs.value < 3) {
        htmlResult.push(
            printResult(`NJS is too low (${round(njs.value, 2)})`, 'timing is less significant below this', 'warning'),
        );
    }
    if (njs.jd > 36) {
        htmlResult.push(printResult('Very high jump distance', `${round(njs.jd, 2)}`, 'warning'));
    }
    if (njs.jd < 18) {
        htmlResult.push(printResult('Very low jump distance', `${round(njs.jd, 2)}`, 'warning'));
    }
    if (njs.jd > njs.calcJDOptimalHigh()) {
        htmlResult.push(
            printResult(
                `High jump distance warning (>${round(njs.calcJDOptimalHigh(), 2)})`,
                'NJS & offset may be uncomfortable to play',
                'warning',
            ),
        );
    }
    if (bpm.toRealTime(njs.hjd) < 0.42) {
        htmlResult.push(
            printResult(
                `Very quick reaction time (${round(bpm.toRealTime(njs.hjd) * 1000)}ms)`,
                'may lead to suboptimal gameplay',
                'warning',
            ),
        );
    }
    if (njs.calcHJDRaw() + njs.offset < NoteJumpSpeed.HJD_MIN) {
        htmlResult.push(
            printResult('Unnecessary negative offset', `will not drop below ${NoteJumpSpeed.HJD_MIN}`, 'warning'),
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
