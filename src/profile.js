import { getUser, updateUser } from './storage.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = await getUser();
    
    // Elements
    const nameInput = document.getElementById('profile-name-input');
    const locationInput = document.getElementById('profile-location-input');
    const displayName = document.getElementById('display-name');
    const displayLocation = document.getElementById('display-location');
    const saveBtn = document.getElementById('save-profile-btn');
    
    // Initialize UI
    function renderUser() {
        displayName.textContent = user.name;
        displayLocation.textContent = user.location;
        nameInput.value = user.name;
        locationInput.value = user.location;
    }
    
    renderUser();
    
    // Save logic
    saveBtn.addEventListener('click', async () => {
        const newName = nameInput.value.trim();
        const newLocation = locationInput.value.trim();
        
        if (!newName) {
            nameInput.classList.add('border-error', 'animate-pulse');
            setTimeout(() => nameInput.classList.remove('border-error', 'animate-pulse'), 1000);
            return;
        }
        
        const newData = { name: newName, location: newLocation };
        await updateUser(newData);
        
        // Update local object & re-render
        user.name = newName;
        user.location = newLocation;
        renderUser();
        
        // Success feedback
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = `<span>Saved!</span><span class="material-symbols-outlined text-lg">done_all</span>`;
        saveBtn.classList.remove('bg-primary');
        saveBtn.classList.add('bg-green-400');
        
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.classList.remove('bg-green-400');
            saveBtn.classList.add('bg-primary');
        }, 2000);
    });
});
