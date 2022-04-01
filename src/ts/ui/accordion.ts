import {
    UIBackgroundColorType,
    UIBackgroundColor,
} from '../types/mapcheck/ui/accordion';

const logPrefix = 'UI Accordion: ';
export default new (class UIAccordion {
    private prefix = 'accordion__';
    private htmlAccordion: NodeListOf<HTMLInputElement>;

    constructor() {
        this.htmlAccordion =
            document.querySelectorAll<HTMLInputElement>('.accordion__button');

        if (!this.htmlAccordion.length) {
            console.error(
                logPrefix + 'empty accordion list, intentional or typo error?'
            );
        }
    }

    create = (
        id: string,
        title: string,
        bg: UIBackgroundColorType,
        isFlex: boolean = false
    ): HTMLElement => {
        const accBase = document.createElement('div');
        accBase.className = 'accordion';

        const accButton = document.createElement('input');
        accButton.className = this.prefix + 'button';
        accButton.id = id;
        accButton.setAttribute('type', 'checkbox');

        const accLabel = document.createElement('label');
        accLabel.className = this.prefix + 'label unselectable';
        accLabel.htmlFor = id;
        accLabel.textContent = title;
        if (bg) {
            accLabel.classList.add(UIBackgroundColor[bg]);
        }

        const accCollapsible = document.createElement('div');
        accCollapsible.className = isFlex
            ? this.prefix + 'collapsible-flex'
            : this.prefix + 'collapsible';
        accCollapsible.id = id + '-content';

        accBase.appendChild(accButton);
        accBase.appendChild(accLabel);
        accBase.appendChild(accCollapsible);

        return accBase;
    };

    // FIXME: htmlAccordion should be redefined as create exist, but that doesn't matter because there's no use case for it as of yet
    show = (id: string, check: boolean): void => {
        this.htmlAccordion.forEach((elem) => {
            if (elem.id.endsWith(id)) {
                elem.checked = check;
            }
        });
    };
})();
