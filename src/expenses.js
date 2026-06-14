import { dbClient, requireAuth } from './db.js';

export async function addExpense(amount, category, description, date, receipt = null) {
  const session = await requireAuth();
  if (!session) return null;

  const expense = {
    id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    user_id: session.user.id,
    amount: parseFloat(amount),
    category,
    description: description || "Expense",
    date: date || new Date().toISOString(),
    receipt,
    wallet: "main",
  };
  
  const { error } = await dbClient.from('expenses').insert(expense);
  if (error) {
      console.error("Error adding expense:", error);
  }
  return expense;
}

export async function deleteExpense(expenseId) {
  const session = await requireAuth();
  if (!session) return false;
  const { error } = await dbClient.from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', session.user.id);
  
  if (error) {
      console.error("Error deleting expense:", error);
      return false;
  }
  return true;
}

export async function getRecentExpenses(count = null) {
  const session = await requireAuth();
  if (!session) return [];
  let query = dbClient.from('expenses')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false });
  if (count) {
      query = query.limit(count);
  }
  const { data, error } = await query;
  if(error) {
      console.error("Error fetching recent expenses:", error);
      return [];
  }
  return data || [];
}
