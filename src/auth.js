import { dbClient } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form');
    const toggleBtn = document.getElementById('auth-toggle-btn');
    const toggleText = document.getElementById('auth-toggle-text');
    const submitBtn = document.getElementById('auth-submit-btn');
    const nameField = document.getElementById('name-field');
    const errorDisplay = document.getElementById('auth-error');
    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');
    const nameInput = document.getElementById('auth-name');
    
    let isLogin = true;

    // Clear all form fields on page load
    function clearFields() {
        emailInput.value = '';
        passwordInput.value = '';
        nameInput.value = '';
        errorDisplay.classList.add('hidden');
    }
    clearFields();

    toggleBtn.addEventListener('click', () => {
        isLogin = !isLogin;
        clearFields();
        if(isLogin) {
            toggleText.textContent = "Don't have an account?";
            toggleBtn.textContent = 'Sign Up';
            submitBtn.textContent = 'Sign In';
            nameField.classList.add('hidden');
        } else {
            toggleText.textContent = "Already have an account?";
            toggleBtn.textContent = 'Sign In';
            submitBtn.textContent = 'Create Account';
            nameField.classList.remove('hidden');
        }
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const name = nameInput.value.trim();
        
        errorDisplay.classList.add('hidden');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="animate-pulse">Processing...</span>';
        
        try {
            if(isLogin) {
                const res = await dbClient.auth.signIn.email({ email, password });
                if(res.error) throw new Error(res.error.message || "Login failed");
                window.location.href = '/index.html';
            } else {
                const res = await dbClient.auth.signUp.email({ email, password, name });
                if(res.error) throw new Error(res.error.message || "Signup failed");
                
                // Initialize default profile for the new user
                const userId = res.data?.user?.id;
                if (userId) {
                    await dbClient.from('user_profiles').insert({
                        id: userId,
                        name: name || "User",
                        monthly_budget: 0,
                        location: "Mumbai University",
                        currency: "₹",
                        semester_start: "2026-01-15",
                        semester_end: "2026-05-15"
                    });
                }
                
                window.location.href = '/index.html';
            }
        } catch(err) {
            errorDisplay.textContent = err.message;
            errorDisplay.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = isLogin ? 'Sign In' : 'Create Account';
        }
    });
    
    // Check if logout button exists (for other pages)
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await dbClient.auth.signOut();
            window.location.href = '/auth.html';
        });
    }
});
