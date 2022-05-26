import { Tool, ToolArgs } from '../../types/mapcheck';
import { toMMSS } from '../../utils';
import settings from '../../settings';
import flag from '../../flag';

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
    const { audioDuration } = map.settings;

    const htmlResult = document.createElement('div');
    if (audioDuration && audioDuration < 20) {
        htmlResult.innerHTML = `<b>Unrankable audio length:</b> too short (${toMMSS(audioDuration)}s)`;
        tool.output.html = htmlResult;
    } else if (!flag.loading.audio) {
        htmlResult.innerHTML = `<b>No audio:</b> ${
            settings.load.audio ? 'could not be loaded or not found' : 'no audio mode is enabled'
        }`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
