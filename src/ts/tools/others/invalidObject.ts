import { Tool, ToolArgs } from '../../types/mapcheck';
import UICheckbox from '../../ui/checkbox';
import { round } from '../../utils';

const name = ' Invalid Object';

const tool: Tool = {
    name,
    description: 'Placeholder',
    type: 'other',
    order: {
        input: 20,
        output: 20,
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

function inputCheckHandler(this: HTMLInputElement) {
    tool.input.enabled = this.checked;
}

function check(map: ToolArgs) {
    const { colorNotes } = map.difficulty.data;
    return colorNotes.filter((n) => n.hasMappingExtensions()).map((n) => n.time);
}

function run(map: ToolArgs) {
    const { bpm } = map.settings;
    const {
        colorNotes,
        bombNotes,
        obstacles,
        basicBeatmapEvents,
        sliders,
        burstSliders,
    } = map.difficulty.data;

    let noteResult: number[] = [];
    let obstacleResult: number[] = [];
    let bombResult: number[] = [];
    let sliderResult: number[] = [];
    let burstSliderResult: number[] = [];
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
            // FIXME: add hasNoodleExtensions() later
            bombResult = bombNotes
                .filter((n) => n.hasMappingExtensions())
                .map((n) => n.time);
            // FIXME: add hasNoodleExtensions() later
            sliderResult = sliders
                .filter((o) => o.hasMappingExtensions())
                .map((o) => o.time);
            // FIXME: add hasNoodleExtensions() later
            burstSliderResult = burstSliders
                .filter((o) => o.hasMappingExtensions())
                .map((o) => o.time);
        } else {
            noteResult = colorNotes.filter((n) => !n.isValid()).map((n) => n.time);
            bombResult = bombNotes.filter((b) => !b.isValid()).map((b) => b.time);
            obstacleResult = obstacles.filter((o) => !o.isValid()).map((o) => o.time);
            sliderResult = sliders.filter((s) => !s.isValid()).map((s) => s.time);
            burstSliderResult = burstSliders
                .filter((bs) => !bs.isValid())
                .map((bs) => bs.time);
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
