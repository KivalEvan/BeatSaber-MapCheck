const htmlResetButton = document.querySelectorAll<HTMLInputElement>('.input__reset-button');
htmlResetButton.forEach((elem) => elem.addEventListener('click', resetUI));

export function resetUI(): void {}

export default {
    resetUI,
};
