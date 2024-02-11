const toggleEditProfileButton_el = document.getElementById('toggleEditProfileButton');
const editProfileOverlay_el = document.getElementById('editProfileOverlay');
const editProfileContent_el = document.getElementById('editProfileContent');
const editProfileInput_el = document.getElementById('editProfileInput');
const editProfileButton_el = document.getElementById('editProfileButton');
const backEditProfileButton_el = document.getElementById('backEditProfileButton');
const toggleEditBackButton_el = document.getElementById('toggleEditBackButton');
const editProfileTitleInput_el = document.getElementById('editProfileTitleInput');

let editMode;
let editTitle;
let currentOptions = [];

toggleEditProfileButton_el.addEventListener('click', () => {
    toggleEditMode();
    //editProfileOverlay_el.style.display = 'flex';
    //editProfileInput_el.value = selectedProfile.title;
});

function getCurrentOptions(){
    inputIds.forEach(element => {
        const value = (element.type === 'checkbox' || element.type ==='radio') ?
        element.checked : element.value;
        currentOptions.push({ id: element.id, value: value, type: element.type });
    });
}

selectedProfileText_el.addEventListener('click', () => {
    if (editMode){
        toggleEditTitle();
    }
});

function toggleEditTitle(){
    if (!editTitle){
        editTitle = true;
        selectedProfileText_el.style.display = 'none';
        editProfileTitleInput_el.style.display = 'grid';
        editProfileTitleInput_el.value = selectedProfile.title;
    } else {
        editTitle = false;
        selectedProfileText_el.style.display = 'grid';
        editProfileTitleInput_el.style.display = 'none';
    }
}

function toggleEditMode(){
    if (!editMode){
        getCurrentOptions();
        toggleEditProfileButton_el.classList.remove('fa-edit');
        toggleEditProfileButton_el.classList.add('fa-save');
        selectedProfileDiv_el.classList.add('edit');
        toggleEditBackButton_el.style.display = 'grid';
        editMode = true;
    } else {
        toggleEditProfileButton_el.classList.remove('fa-save');
        toggleEditProfileButton_el.classList.add('fa-edit');
        selectedProfileDiv_el.classList.remove('edit');
        toggleEditBackButton_el.style.display = 'none';
        editMode = false;
    }
}

toggleEditBackButton_el.addEventListener('click', () => {
    currentOptions.forEach(element => {
        const elementVar = element.id;
        const targetElement = document.getElementById(elementVar);

        if (element.type === 'checkbox' || element.type === 'radio') {
            targetElement.checked = element.value;
        } else {
            targetElement.value = element.value;
        }
    });
    toggleEditTitle();
    toggleEditMode();
    currentOptions = [];
});

backEditProfileButton_el.addEventListener('click', () => {
    editProfileOverlay_el.style.display = 'none';
});

editProfileButton_el.addEventListener('click', async () => {
    const result = await api.databaseHandler({request: 'Edit', id: selectedProfile.id, title: editProfileInput_el.value});
    if (result){
        await getProfiles();
        selectedProfileText_el.textContent = editProfileInput_el.value;
        editProfileOverlay_el.style.display = 'none';
        selectedProfile.title = editProfileInput_el.value;
    } else {
        console.error('Error editing profile');
    }
});
