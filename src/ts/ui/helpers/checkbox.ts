export default class UICheckbox {
    private static list: string[] = [];
    private constructor() {}

    static create = (name: string, title: string, bool: boolean, callback: EventListener): HTMLDivElement => {
        const internalName = name.trim().toLowerCase().replace(' ', '-');
        if (UICheckbox.list.includes(internalName)) {
            throw new Error(internalName + ' is already being used.');
        }
        UICheckbox.list.push(internalName);
        const htmlContainer = document.createElement('div');
        const htmlInputCheck = document.createElement('input');
        const htmlLabelCheck = document.createElement('label');

        htmlLabelCheck.textContent = ' ' + name;
        htmlLabelCheck.title = title;
        htmlLabelCheck.htmlFor = 'input__tools-' + internalName;
        htmlInputCheck.id = 'input__tools-' + internalName;
        htmlInputCheck.className = 'input-toggle';
        htmlInputCheck.type = 'checkbox';
        htmlInputCheck.checked = bool;
        htmlInputCheck.addEventListener('change', callback);

        htmlContainer.appendChild(htmlInputCheck);
        htmlContainer.appendChild(htmlLabelCheck);

        return htmlContainer;
    };
}
