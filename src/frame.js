const minimizeButton_el = document.getElementById('minimizeButton');
const exitButton_el = document.getElementById('exitButton');

minimizeButton_el.addEventListener('click', () => {
    api.frameHandler({request: 'minimize'});
});

exitButton_el.addEventListener('click', () => {
    api.frameHandler({request: 'exit'});
});