const addProfileButton_el = document.getElementById('addProfileButton');
const toggleAddProfileButton_el = document.getElementById('toggleAddProfileButton');

const addProfileOverlay_el = document.getElementById('addProfileOverlay');
const addProfileContent_el = document.getElementById('addProfileContent');
const addProfileCloseButton_el = document.getElementById('addProfileCloseButton');
const addProfileInput_el = document.getElementById('addProfileInput');

toggleAddProfileButton_el.addEventListener('click', async () => {
    addProfileOverlay_el.style.display = 'flex';
    addProfileInput_el.value = '';
});

addProfileCloseButton_el.addEventListener('click', () => {
    addProfileOverlay_el.style.display = 'none';
});

addProfileButton_el.addEventListener('click', async () => {
    let optionValues = [];
    inputIds.forEach(element => {
        const input = element.id;
        const value = (element.type === 'checkbox' || element.type === 'radio') ? element.checked : element.value;
        optionValues.push({input, value});
    });
    await api.databaseHandler({request: 'Add', title: addProfileInput_el.value, optionValues});
});