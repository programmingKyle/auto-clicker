const deleteProfileOverlay_el = document.getElementById('deleteProfileOverlay');
const deleteProfileContent_el = document.getElementById('deleteProfileContent');
const deleteSelectedProfileText_el = document.getElementById('deleteSelectedProfileText');
const deleteProfileButton_el = document.getElementById('deleteProfileButton');
const backDeleteButton_el = document.getElementById('backDeleteButton');
const toggleDeleteProfileButton_el = document.getElementById('toggleDeleteProfileButton');

toggleDeleteProfileButton_el.addEventListener('click', () => {
    deleteProfileOverlay_el.style.display = 'flex';
    deleteSelectedProfileText_el.textContent = selectedProfile.title;
});

backDeleteButton_el.addEventListener('click', () => {
    deleteProfileOverlay_el.style.display = 'none';
});

deleteProfileButton_el.addEventListener('click', async () => {
    const result = await api.databaseHandler({request: 'Delete', id: selectedProfile.id});
    console.log(result);
    if (result){
        deleteProfileOverlay_el.style.display = 'none';
        clearSelectedProfile();
        await getProfiles();
    } else {
        console.error('Error deleting profile');
    }
});