import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import UICheckbox from '../../ui/helpers/checkbox';
import { printResult } from '../helpers';

const name = 'Difficulty Label Check';
const description = 'For ranking purpose, check difficulty label to fit rankability criteria.';
const enabled = true;

const tool: Tool<{}> = {
    name,
    description,
    type: 'other',
    order: {
        input: ToolInputOrder.OTHERS_DIFFICULTY_LABEL,
        output: ToolOutputOrder.OTHERS_DIFFICULTY_LABEL,
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
    const result = map.difficulty.info._customData?._difficultyLabel;

    if (result && result.length > 30) {
        tool.output.html = printResult(
            `Difficulty label is too long (${result.length} characters)`,
            'exceeded 30 max characters by ranking criteria',
            'rank',
        );
    } else {
        tool.output.html = null;
    }
}

export default tool;
