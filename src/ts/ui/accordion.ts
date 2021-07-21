import uiSettings from './settings';
import settings from '../settings';

const logPrefix = 'UI Accordion: ';

const htmlAccordion = document.querySelectorAll<HTMLInputElement>('.accordion__button');

if (!htmlAccordion.length) {
    console.error(logPrefix + 'empty accordion list, intentional or typo error?');
}

// export const create = (): HTMLElement => {}

// htmlAccordion should be redefined as create exist, but that doesn't matter because there's no use case for it as of yet
export const show = (id: string, check: boolean): void => {
    htmlAccordion.forEach((elem) => {
        if (elem.id.endsWith(id)) {
            elem.checked = check;
        }
    });
};
