import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';

const htmlContainer = document.createElement('div');
const htmlInputCheck = document.createElement('input');
const htmlLabelCheck = document.createElement('label');

htmlLabelCheck.textContent = ' Invalid object';
htmlLabelCheck.htmlFor = 'input__tools-invalid-object-check';
htmlInputCheck.id = 'input__tools-invalid-object-check';
htmlInputCheck.className = 'input-toggle';
htmlInputCheck.type = 'checkbox';
htmlInputCheck.checked = true;
htmlInputCheck.addEventListener('change', inputCheckHandler);

htmlContainer.appendChild(htmlInputCheck);
htmlContainer.appendChild(htmlLabelCheck);

const tool: Tool = {
    name: 'Invalid Object',
    description: 'Placeholder',
    type: 'other',
    order: {
        input: 20,
        output: 20,
    },
    input: {
        enabled: htmlInputCheck.checked,
        params: {},
        html: htmlContainer,
    },
    output: {
        html: null,
    },
    run,
};

function inputCheckHandler(this: HTMLInputElement) {
    tool.input.enabled = this.checked;
}

function check(map: ToolArgs) {
    const { colorNotes } = map.difficulty.data;
    return colorNotes.filter((n) => n.hasMappingExtensions()).map((n) => n.time);
}

function run(map: ToolArgs) {
    const { bpm } = map.settings;
    const { colorNotes, obstacles, basicBeatmapEvents } = map.difficulty.data;

    let noteResult: number[] = [];
    let obstacleResult: number[] = [];
    if (
        !map.difficulty.info._customData?._requirements?.includes('Mapping Extensions')
    ) {
        if (
            map.difficulty.info._customData?._requirements?.includes(
                'Noodle Extensions'
            )
        ) {
            // FIXME: add hasNoodleExtensions() later
            noteResult = colorNotes
                .filter((n) => n.hasMappingExtensions())
                .map((n) => n.time);
            // FIXME: add hasNoodleExtensions() later
            obstacleResult = obstacles
                .filter((o) => o.hasMappingExtensions())
                .map((o) => o.time);
        } else {
            noteResult = colorNotes.filter((n) => !n.isValid()).map((n) => n.time);
            obstacleResult = obstacles.filter((o) => !o.isValid()).map((o) => o.time);
        }
    }
    const eventResult = basicBeatmapEvents
        .filter((e) => !e.isValid())
        .map((e) => e.time);

    const htmlString: string[] = [];
    if (noteResult.length) {
        htmlString.push(
            `<b>Invalid note [${noteResult.length}]:</b> ${noteResult
                .map((n) => round(bpm.adjustTime(n), 3))
                .join(', ')}`
        );
    }
    if (obstacleResult.length) {
        htmlString.push(
            `<b>Invalid obstacle [${obstacleResult.length}]:</b> ${obstacleResult
                .map((n) => round(bpm.adjustTime(n), 3))
                .join(', ')}`
        );
    }
    if (eventResult.length) {
        htmlString.push(
            `<b>Invalid event [${eventResult.length}]:</b> ${eventResult
                .map((n) => round(bpm.adjustTime(n), 3))
                .join(', ')}`
        );
    }

    if (htmlString.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = htmlString.join('<br>');
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
