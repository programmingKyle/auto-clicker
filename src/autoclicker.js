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

const delayCheckbox_el = document.getElementById('delayCheckbox');
const delayAmount_el = document.getElementById('delayAmount');
const alwaysOnTopCheckbox_el = document.getElementById('alwaysOnTopCheckbox');

let running = false;

document.addEventListener('DOMContentLoaded', async () => {
    const optionsResult = await api.optionsHandler({request: 'get'});
    populateOptions(optionsResult);
})

function populateOptions(options){
    mouseButtonInput_el.value = options.mouseButtonInput;
    delayCheckbox_el.checked = options.delayCheckbox;
    delayAmount_el.value = options.delayAmount;
    typeInput_el.value = options.typeInput;
    repeatSetTimesInput_el.checked = options.repeatSetTimesInput;
    repeatTimes_el.value = options.repeatTimes;
    alwaysOnTopCheckbox_el.checked = options.alwaysOnTopCheckbox;
    loopInput_el.checked = options.loopInput;

    hoursInput_el.value = options.hoursInput;
    minutesInput_el.value = options.minutesInput;
    secondsInput_el.value = options.secondsInput;
    millisecondsInput_el.value = options.millisecondsInput;
}

const inputIds = [
    mouseButtonInput_el, delayCheckbox_el, delayAmount_el,
    typeInput_el, repeatSetTimesInput_el, repeatTimes_el,
    alwaysOnTopCheckbox_el, loopInput_el, hoursInput_el,
    minutesInput_el, secondsInput_el, millisecondsInput_el,
];
  
inputIds.forEach((element) => {
    if (element) {
        element.addEventListener('change', () => {
        handleInputChange(element);
        });
    }
});

function handleInputChange(inputElement) {
    console.log(inputElement.checked);
    const inputId = inputElement.id;
    const inputValue = (inputElement.type === 'checkbox' || 
    inputElement.type === 'radio') ? inputElement.checked : inputElement.value;
    api.optionsHandler({ request: 'save', inputId, inputValue });
}

  


function toggleButtons(){
    if (startButton_el.style.display !== 'none'){
        startButton_el.style.display = 'none';
        stopButton_el.style.display = 'grid';
    } else {
        startButton_el.style.display = 'grid';
        stopButton_el.style.display = 'none';
    }
}

function calcIntervalTime(){
    const hours = hoursInput_el.value === '0' ? 0 : hoursInput_el.value * 3600000;
    const minutes = minutesInput_el.value === '0' ? 0 : minutesInput_el.value * 60000;
    const seconds = secondsInput_el.value === '0' ? 0 : secondsInput_el.value * 1000;
    const milliseconds = millisecondsInput_el.value === '' ? 0 : parseInt(millisecondsInput_el.value); // not sure why i have to parseInt here but not the other ones
    const totalMilliseconds = hours + minutes + seconds + milliseconds;
    return totalMilliseconds;
}

startButton_el.addEventListener('click', async () => {
    setTimeout(() => {
        startAutoClicker();        
    }, delayCheckbox_el.checked ? delayAmount_el.value : 1000);
});

async function startAutoClicker(){
    if (!running){
        const interval = calcIntervalTime();
        toggleButtons();
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
    toggleButtons();
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
    toggleButtons();
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
        setTimeout(() => {
            startAutoClicker();            
        }, delayCheckbox_el.checked ? delayAmount_el.value : 0);
    } else {
        toggleButtons();
        api.stopAutoclick();
        running = false;
    }
});

alwaysOnTopCheckbox_el.addEventListener('click', () => {
    if (alwaysOnTopCheckbox_el.checked){
        api.alwaysOnTopHandler({request: true});
    } else {
        api.alwaysOnTopHandler({request: false});
    }
});
