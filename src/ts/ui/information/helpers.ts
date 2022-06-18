export function hideTableRow<T extends HTMLElement>(elem: T): void {
    const tableElem = elem.querySelector('.info__table-element');
    if (tableElem) {
        tableElem.innerHTML = '';
    }
    elem.classList.add('hidden');
}

export function displayTableRow<T extends HTMLElement>(elem: T, content: string | string[] | HTMLElement[]): void {
    const tableElem = elem.querySelector('.info__table-element');
    if (tableElem) {
        while (tableElem.firstChild) {
            tableElem.removeChild(tableElem.firstChild);
        }
        if (typeof content === 'string') {
            tableElem.textContent = content;
        } else {
            content.forEach((c: string | HTMLElement) => {
                if (typeof c === 'string') {
                    const temp = document.createElement('span');
                    temp.textContent = c;
                    tableElem.appendChild(temp);
                    tableElem.appendChild(document.createElement('br'));
                } else {
                    tableElem.appendChild(c);
                    tableElem.appendChild(document.createElement('br'));
                }
            });
            if (tableElem.lastChild) {
                tableElem.removeChild(tableElem.lastChild);
            }
        }
    }
    elem.classList.remove('hidden');
}
