import { Tool, ToolArgs } from '../../types/mapcheck';

const tool: Tool = {
    name: 'Difficulty Label',
    description: 'Placeholder',
    type: 'other',
    order: {
        input: 30,
        output: 30,
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
    const result = map.difficulty.info._customData?._difficultyLabel;

    if (result && result.length > 30) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Difficulty label is too long (${result.length} characters):</b> exceeded 30 max characters by ranking criteria`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
