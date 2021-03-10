export const addExpense = (expense, data) => {
  return [...data, expense];
};

export const removeExpense = (id, data) => {
  return data.filter(expense => expense.id !== id);
}

export const findExpense = (id, data) => {
  return data.find(expense => expense.id === id);
};
