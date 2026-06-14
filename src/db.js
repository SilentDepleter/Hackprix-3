import { createClient } from '@neondatabase/neon-js';

const neonAuthUrl = 'https://ep-autumn-band-aksolbl7.neonauth.c-3.us-west-2.aws.neon.tech/neondb/auth';
const neonDataApiUrl = 'https://ep-autumn-band-aksolbl7.apirest.c-3.us-west-2.aws.neon.tech/neondb/rest/v1';

export const dbClient = createClient({
  auth: {
    url: neonAuthUrl,
  },
  dataApi: {
    url: neonDataApiUrl,
  },
});

export async function requireAuth() {
    try {
        const result = await dbClient.auth.getSession();
        if(!result.data?.session) {
            window.location.href = '/auth.html';
            return null;
        }
        return { ...result.data.session, user: result.data.user };
    } catch(err) {
        window.location.href = '/auth.html';
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await dbClient.auth.signOut();
            window.location.href = '/auth.html';
        });
    }
});
