import './styles.scss';
import { drawPieChart } from './pie';
import { addExpense, removeExpense, findExpense } from './utils';

let data = [
  {
    id: Math.random().toString(),
    title: 'Entertainment',
    category: 'Gaming',
    amount: 24.67
  },
  {
    id: Math.random().toString(),
    title: 'Expensive Dinner',
    category: 'Food',
    amount: 121.75
  },
  {
    id: Math.random().toString(),
    title: 'Thai Street Food',
    category: 'Food',
    amount: 3.21
  },
  {
    id: Math.random().toString(),
    title: 'Holiday Bookings',
    category: 'Travel',
    amount: 67.12
  },
  {
    id: Math.random().toString(),
    title: 'Fuel',
    category: 'Transport',
    amount: 35.2
  },
  {
    id: Math.random().toString(),
    title: 'Monthly Bus Fare',
    category: 'Transport',
    amount: 63.11
  },
  {
    id: Math.random().toString(),
    title: 'Headphones',
    category: 'Gaming',
    amount: 40.95
  }
];

window.data = data;
window.draw = drawPieChart;

drawPieChart(data);

// HTML selectors
const form = document.querySelector('.form');
const title = document.querySelector('.form__input--text');
const amount = document.querySelector('.form__input--amount');
const category = document.querySelector('.form__input--category');
const submitBtn = document.querySelector('.form__btn');
const canvas = document.querySelector('.canvas');

// Event listeners
form.addEventListener('submit', e => {
  e.preventDefault();

  if (!title.value || !amount.value) {
    return console.log('Please enter a title and amount for this expense');
  }

  const expense = {
    id: Math.random().toString(),
    title: title.value,
    category: category.value,
    amount: parseInt(amount.value)
  };

  data = addExpense(expense, data);
  drawPieChart(data);
});

canvas.addEventListener('click', e => {
  if (e.target.id) {
    // removeExpense(e.target.id);
    data = data.filter(expense => expense.id !== e.target.id);
    drawPieChart(data);
  }
});

export const removeExp = (id) => {
  data = data.filter(expense => {
    if (expense.id === id) {
      console.log(expense);
    }

    return expense.id !== id;
  });
  drawPieChart(data);
}
