const htmlInputToggle = document.querySelectorAll<HTMLInputElement>('.input-toggle');

export const disableInput = (bool: boolean) => {
    htmlInputToggle.forEach((input) => {
        input.disabled = bool;
    });
};
