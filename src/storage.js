import { dbClient, requireAuth } from './db.js';

export async function getExpenses() {
    const session = await requireAuth();
    if (!session) return [];
    const { data, error } = await dbClient.from('expenses')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });
    
    if (error) {
        console.error("Error fetching expenses:", error);
        return [];
    }
    return data || [];
}

export async function getUser() {
    const session = await requireAuth();
    if (!session) return { name: "User", monthlyBudget: 0, location: "Mumbai University" };
    const { data, error } = await dbClient.from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
    if (error || !data) {
        // Auto-seed missing user profile
        const { error: insertError } = await dbClient.from('user_profiles').insert({
            id: session.user.id,
            name: session.user.name || "User",
            monthly_budget: 0,
            location: "Mumbai University",
            currency: "₹",
        });
        if (insertError) console.error("Error seeding user profile:", insertError);
        return { name: session.user.name || "User", monthlyBudget: 0, location: "Mumbai University" };
    }
    return {
        name: data.name,
        monthlyBudget: parseFloat(data.monthly_budget) || 0,
        location: data.location || "Mumbai University"
    };
}

export async function getSettings() {
    const session = await requireAuth();
    if (!session) return { currency: "₹", semesterStart: "2026-01-15", semesterEnd: "2026-05-15" };
    const { data, error } = await dbClient.from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
    if (error || !data) {
        // Auto-seed missing user profile
        const { error: insertError } = await dbClient.from('user_profiles').insert({
            id: session.user.id,
            name: session.user.name || "User",
            monthly_budget: 0,
            location: "Mumbai University",
            currency: "₹",
        });
        if (insertError) console.error("Error seeding settings:", insertError);
        return { currency: "₹", semesterStart: "2026-01-15", semesterEnd: "2026-05-15" };
    }
    return {
        currency: data.currency || "₹",
        semesterStart: data.semester_start || "2026-01-15",
        semesterEnd: data.semester_end || "2026-05-15"
    };
}

export async function updateUser(newData) {
    const session = await requireAuth();
    if (!session) return;
    const updatePayload = {};
    if (newData.name !== undefined) updatePayload.name = newData.name;
    if (newData.monthlyBudget !== undefined) updatePayload.monthly_budget = parseFloat(newData.monthlyBudget) || 0;
    if (newData.location !== undefined) updatePayload.location = newData.location;
    
    if (Object.keys(updatePayload).length > 0) {
        const { error } = await dbClient.from('user_profiles').update(updatePayload).eq('id', session.user.id);
        if (error) console.error("Error updating user:", error);
    }
}

export async function updateSettings(newSettings) {
    const session = await requireAuth();
    if (!session) return;
    const updatePayload = {};
    if (newSettings.currency !== undefined) updatePayload.currency = newSettings.currency;
    if (newSettings.semesterStart !== undefined) updatePayload.semester_start = newSettings.semesterStart;
    if (newSettings.semesterEnd !== undefined) updatePayload.semester_end = newSettings.semesterEnd;
    
    if (Object.keys(updatePayload).length > 0) {
        const { error } = await dbClient.from('user_profiles').update(updatePayload).eq('id', session.user.id);
        if (error) console.error("Error updating settings:", error);
    }
}
