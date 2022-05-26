const logPrefix = 'UI Input: ';

export default {
    enable: (bool: boolean) => {
        const htmlInputToggle = document.querySelectorAll<HTMLInputElement>('.input-toggle');
        if (!htmlInputToggle.length) {
            console.error(logPrefix + 'empty list, intentional or typo error?');
            return;
        }
        htmlInputToggle.forEach((input) => {
            input.disabled = !bool;
        });
    },
};
