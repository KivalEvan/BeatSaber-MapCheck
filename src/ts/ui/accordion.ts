const logPrefix = 'UI Accordion: ';

const htmlAccordion = document.querySelectorAll<HTMLInputElement>('.accordion__button');

if (!htmlAccordion.length) {
    console.error(logPrefix + 'empty accordion list, intentional or typo error?');
}

export const create = (id: string, title: string, isFlex: boolean = false): HTMLElement => {
    const accBase = document.createElement('div');
    accBase.className = 'accordion';

    const accButton = document.createElement('input');
    accButton.className = 'accordion__button';
    accButton.id = id;
    accButton.setAttribute('type', 'checkbox');

    const accLabel = document.createElement('label');
    accLabel.className = 'accordion__label unselectable';
    accLabel.htmlFor = id;
    accLabel.textContent = title;

    const accCollapsible = document.createElement('div');
    accCollapsible.className = isFlex ? 'accordion__collapsible-flex' : 'accordion__collapsible';
    accCollapsible.id = id + '-content';

    accBase.appendChild(accButton);
    accBase.appendChild(accLabel);
    accBase.appendChild(accCollapsible);

    return accBase;
};

// htmlAccordion should be redefined as create exist, but that doesn't matter because there's no use case for it as of yet
export const show = (id: string, check: boolean): void => {
    htmlAccordion.forEach((elem) => {
        if (elem.id.endsWith(id)) {
            elem.checked = check;
        }
    });
};
