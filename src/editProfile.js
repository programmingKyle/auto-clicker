const toggleEditProfileButton_el = document.getElementById('toggleEditProfileButton');
const editProfileOverlay_el = document.getElementById('editProfileOverlay');
const editProfileContent_el = document.getElementById('editProfileContent');
const editProfileInput_el = document.getElementById('editProfileInput');
const editProfileButton_el = document.getElementById('editProfileButton');
const backEditProfileButton_el = document.getElementById('backEditProfileButton');

toggleEditProfileButton_el.addEventListener('click', () => {
    editProfileOverlay_el.style.display = 'flex';
    editProfileInput_el.value = selectedProfile.title;
});

backEditProfileButton_el.addEventListener('click', () => {
    editProfileOverlay_el.style.display = 'none';
});

editProfileButton_el.addEventListener('click', () => {
    console.log('Confirm Edit');
});