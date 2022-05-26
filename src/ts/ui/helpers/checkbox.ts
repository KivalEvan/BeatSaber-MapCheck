export default class UICheckbox {
    private static list: string[] = [];
    private constructor() {}

    static create = (name: string, title: string, bool: boolean, callback: EventListener): HTMLDivElement => {
        name = name.trim().toLowerCase().replace(' ', '-');
        if (UICheckbox.list.includes(name)) {
            throw new Error(name + ' is already being used.');
        }
        UICheckbox.list.push(name);
        const htmlContainer = document.createElement('div');
        const htmlInputCheck = document.createElement('input');
        const htmlLabelCheck = document.createElement('label');

        htmlLabelCheck.textContent = ' ' + title;
        htmlLabelCheck.htmlFor = 'input__tools-' + name;
        htmlInputCheck.id = 'input__tools-' + name;
        htmlInputCheck.className = 'input-toggle';
        htmlInputCheck.type = 'checkbox';
        htmlInputCheck.checked = bool;
        htmlInputCheck.addEventListener('change', callback);

        htmlContainer.appendChild(htmlInputCheck);
        htmlContainer.appendChild(htmlLabelCheck);

        return htmlContainer;
    };
}
