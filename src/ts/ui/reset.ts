const htmlResetButton = document.querySelectorAll<HTMLInputElement>('.input__reset-button');
htmlResetButton.forEach((elem) => elem.addEventListener('click', ui));

export function ui(): void {}
