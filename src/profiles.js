const addProfileButton_el = document.getElementById('addProfileButton');
const toggleAddProfileButton_el = document.getElementById('toggleAddProfileButton');

const addProfileOverlay_el = document.getElementById('addProfileOverlay');
const addProfileContent_el = document.getElementById('addProfileContent');
const addProfileCloseButton_el = document.getElementById('addProfileCloseButton');
const addProfileInput_el = document.getElementById('addProfileInput');
const profilesContent_el = document.getElementById('profilesContent');

const selectedProfileDiv_el = document.getElementById('selectedProfileDiv');
const selectedProfileText_el = document.getElementById('selectedProfileText');
const toggleEditProfileButton_el = document.getElementById('toggleEditProfileButton');
const toggleDeleteProfileButton_el = document.getElementById('toggleDeleteProfileButton');

let profileSelected = false;

document.addEventListener('DOMContentLoaded', async () => {
    await getProfiles();
});

async function getProfiles(){
    try {
        const results = await api.databaseHandler({request: 'Get'});
        await populateProfiles(results);
    } catch (error){
        console.error(error);
    }
}

async function populateProfiles(content){
    profilesContent_el.innerHTML = '';
    content.forEach(element => {
        const button = document.createElement('button');
        button.textContent = element.title;
        button.className = 'profiles-button';
        profilesContent_el.append(button);

        button.addEventListener('click', () => {
            selectedProfileDiv_el.classList.add('active');
            selectedProfileText_el.textContent = element.title;
            toggleEditProfileButton_el.style.display = 'grid';
            toggleDeleteProfileButton_el.style.display = 'grid';
            profileSelected = true;
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
    addProfileOverlay_el.style.display = 'none';
    await getProfiles();
});