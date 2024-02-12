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

toggleEditProfileButton_el.addEventListener('click', async () => {
    if (!editMode){
        await toggleEditMode();
    } else {
        if (editProfileTitleInput_el.value.toString().length === 0){
            editProfileTitleInput_el.classList.add('error');
        } else {
            saveEditProfile();
        }
    }
});

async function saveEditProfile(){
    const titleEdit = editProfileTitleInput_el.value === '' ? selectedProfile.title : editProfileTitleInput_el.value;
    getCurrentOptions();
    await api.updateProfile({id: selectedProfile.id, title: titleEdit, options: currentOptions});
    selectedProfileText_el.textContent = titleEdit
    await toggleEditMode();
    toggleEditTitle();
    getProfiles();
}

function getCurrentOptions(){
    currentOptions = [];
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

async function toggleEditMode(){
    getCurrentOptions();
    if (!editMode){
        toggleEditProfileButton_el.classList.remove('fa-edit');
        toggleEditProfileButton_el.classList.add('fa-save');
        selectedProfileDiv_el.classList.add('edit');
        toggleEditBackButton_el.style.display = 'grid';
        editMode = true;
    } else {
        getCurrentOptions();
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

editProfileTitleInput_el.addEventListener('click', () => {
    removeError(editProfileInput_el);
})
