import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import UICheckbox from '../../ui/helpers/checkbox';
import { printResult } from '../helpers';

const name = 'Preview Time';
const description = 'Warn default editor preview time.';
const enabled = true;

const tool: Tool<{}> = {
    name,
    description,
    type: 'general',
    order: {
        input: ToolInputOrder.GENERAL_PREVIEW_TIME,
        output: ToolOutputOrder.GENERAL_PREVIEW_TIME,
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
    const { _previewStartTime: previewStartTime, _previewDuration: previewDuration } = map.info;

    if (previewStartTime === 12 && previewDuration === 10) {
        tool.output.html = printResult(
            'Default preview time',
            "strongly recommended to set for audience's 1st impression",
            'info',
        );
    } else {
        tool.output.html = null;
    }
}

export default tool;
