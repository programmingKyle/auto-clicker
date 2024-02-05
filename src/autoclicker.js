const startButton_el = document.getElementById('startButton');
const stopButton_el = document.getElementById('stopButton');

startButton_el.addEventListener('click', () => {
    api.startAutoclick();
});

stopButton_el.addEventListener('click', () => {
    api.stopAutoclick();
});