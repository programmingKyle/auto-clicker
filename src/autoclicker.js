const startButton_el = document.getElementById('startButton');
const stopButton_el = document.getElementById('stopButton');

const mouseButtonInput_el = document.getElementById('mouseButtonInput');
const typeInput_el = document.getElementById('typeInput');
const repeatSetTimesInput_el = document.getElementById('repeatSetTimesInput');
const repeatTimes_el = document.getElementById('repeatTimes');
const loopInput_el = document.getElementById('loopInput');

const hoursInput_el = document.getElementById('hoursInput');
const minutesInput_el = document.getElementById('minutesInput');
const secondsInput_el = document.getElementById('secondsInput');
const millisecondsInput_el = document.getElementById('millisecondsInput');

let running = false;

function calcIntervalTime(){
    const hours = hoursInput_el.value === '0' ? 0 : hoursInput_el.value * 3600000;
    const minutes = minutesInput_el.value === '0' ? 0 : minutesInput_el.value * 60000;
    const seconds = secondsInput_el.value === '0' ? 0 : secondsInput_el.value * 1000;
    const milliseconds = millisecondsInput_el.value === '' ? 0 : parseInt(millisecondsInput_el.value); // not sure why i have to parseInt here but not the other ones
    const totalMilliseconds = hours + minutes + seconds + milliseconds;
    return totalMilliseconds;
}

startButton_el.addEventListener('click', async () => {
    await startAutoClicker();
});

async function startAutoClicker(){
    if (!running){
        const interval = calcIntervalTime();
        await api.startAutoclick({
            input: mouseButtonInput_el.value,
            type: typeInput_el.value,
            repeat: loopInput_el.checked ? 'loop' : repeatTimes_el.value,
            interval,
        });
        running = true;    
    }
}

stopButton_el.addEventListener('click', () => {
    api.stopAutoclick();
    running = false;
});

repeatSetTimesInput_el.addEventListener('click', () => {
    if (loopInput_el.checked === true){
        loopInput_el.checked = false;
    }
});

loopInput_el.addEventListener('click', () => {
    if (repeatSetTimesInput_el.checked = true){
        repeatSetTimesInput_el.checked = false;
    }
});

api.onAutoclickStopped((data) => {
    if (data.success){
        running = false;
    } else {
        console.error('Failed');
        api.stopAutoclick();
        running = false;    
    }
});

api.backgroundHotkeys(async (data) => {
    if (data.start){
        await startAutoClicker();
    } else {
        api.stopAutoclick();
        running = false;
    }
});
