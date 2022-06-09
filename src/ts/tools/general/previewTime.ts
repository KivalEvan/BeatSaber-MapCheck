import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import UICheckbox from '../../ui/helpers/checkbox';

const name = 'Preview Time';
const description = 'Warn default editor preview time.';
const enabled = true;

const tool: Tool = {
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
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = "<b>Default preview time:</b> strongly recommended to set for audience's 1st impression";
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
