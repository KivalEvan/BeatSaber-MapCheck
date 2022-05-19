import { IBeatmapItem, Tool, ToolArgs } from '../../types/mapcheck';
import UICheckbox from '../../ui/checkbox';
import { round } from '../../utils';

const name = 'Varying Swing Speed';

const tool: Tool = {
    name,
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 20,
        output: 130,
    },
    input: {
        enabled: true,
        params: {},
        html: UICheckbox.create(name, name, true, function (this: HTMLInputElement) {
            tool.input.enabled = this.checked;
        }),
    },
    output: {
        html: null,
    },
    run,
};

function check(difficulty: IBeatmapItem) {
    const { swingAnalysis } = difficulty;
    return swingAnalysis.container
        .filter((n) => Math.abs(n.minSpeed - n.maxSpeed) > 0.002)
        .map((n) => n.time)
        .filter((x, i, ary) => {
            return !i || x !== ary[i - 1];
        });
}

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const result = check(map.difficulty);

    if (result.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Varying swing speed [${result.length}]:</b> ${result
            .map((n) => round(map.settings.bpm.adjustTime(n), 3))
            .join(', ')}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
