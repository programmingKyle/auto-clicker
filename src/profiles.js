const addProfileButton_el = document.getElementById('addProfileButton');
const toggleAddProfileButton_el = document.getElementById('toggleAddProfileButton');

const addProfileOverlay_el = document.getElementById('addProfileOverlay');
const addProfileContent_el = document.getElementById('addProfileContent');
const addProfileCloseButton_el = document.getElementById('addProfileCloseButton');
const addProfileInput_el = document.getElementById('addProfileInput');

const profilesContent_el = document.getElementById('profilesContent');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const results = await api.databaseHandler({request: 'Get'});
        await populateProfiles(results);
    } catch (error){
        console.error(error);
    }
});

async function populateProfiles(content){
    content.forEach(element => {
        const button = document.createElement('button');
        button.textContent = element.title;
        button.className = 'profiles-button';
        profilesContent_el.append(button);

        button.addEventListener('click', () => {
            populateOptions(element);
        })
    });
}

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