import { toMMSS } from '../../utils';
import { BeatmapSettings, Tool } from '../template';
import flag from '../../flag';
import settings from '../../settings';

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
    run: run,
};

function run(mapSettings: BeatmapSettings): void {
    const { _audioDuration: audioDuration } = mapSettings;

    const htmlResult = document.createElement('div');
    if (audioDuration && audioDuration < 20) {
        htmlResult.innerHTML = `<b>Unrankable audio length:</b> too short (${toMMSS(
            audioDuration
        )}s)`;
        tool.output.html = htmlResult;
    } else if (!flag.map.load.audio) {
        htmlResult.innerHTML = `<b>No audio:</b> ${
            settings.load.audio
                ? 'could not be loaded or not found'
                : 'no audio mode is enabled'
        }`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
