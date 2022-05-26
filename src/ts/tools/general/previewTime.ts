import { Tool, ToolArgs } from '../../types/mapcheck';

const tool: Tool = {
    name: 'Preview Time',
    description: 'Placeholder',
    type: 'general',
    order: {
        input: 0,
        output: 0,
    },
    input: {
        enabled: true,
        params: {},
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
