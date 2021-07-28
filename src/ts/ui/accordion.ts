import { DifficultyName } from '../beatmap/difficulty';

const logPrefix = 'UI Accordion: ';
const prefix = 'accordion__';

export type BackgroundColorType = DifficultyName | 'none';
enum BackgroundColor {
    'none' = '',
    'ExpertPlus' = 'accordion__label--bg-expertplus',
    'Expert' = 'accordion__label--bg-expert',
    'Hard' = 'accordion__label--bg-hard',
    'Normal' = 'accordion__label--bg-normal',
    'Easy' = 'accordion__label--bg-easy',
}

const htmlAccordion = document.querySelectorAll<HTMLInputElement>('.accordion__button');

if (!htmlAccordion.length) {
    console.error(logPrefix + 'empty accordion list, intentional or typo error?');
}

export const create = (
    id: string,
    title: string,
    bg: BackgroundColorType,
    isFlex: boolean = false
): HTMLElement => {
    const accBase = document.createElement('div');
    accBase.className = 'accordion';

    const accButton = document.createElement('input');
    accButton.className = prefix + 'button';
    accButton.id = id;
    accButton.setAttribute('type', 'checkbox');

    const accLabel = document.createElement('label');
    accLabel.className = prefix + 'label unselectable';
    accLabel.htmlFor = id;
    accLabel.textContent = title;
    if (bg) {
        accLabel.classList.add(BackgroundColor[bg]);
    }

    const accCollapsible = document.createElement('div');
    accCollapsible.className = isFlex ? prefix + 'collapsible-flex' : prefix + 'collapsible';
    accCollapsible.id = id + '-content';

    accBase.appendChild(accButton);
    accBase.appendChild(accLabel);
    accBase.appendChild(accCollapsible);

    return accBase;
};

// FIXME: htmlAccordion should be redefined as create exist, but that doesn't matter because there's no use case for it as of yet
export const show = (id: string, check: boolean): void => {
    htmlAccordion.forEach((elem) => {
        if (elem.id.endsWith(id)) {
            elem.checked = check;
        }
    });
};
