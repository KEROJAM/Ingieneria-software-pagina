const display = document.querySelector('#display');
const history = document.querySelector('#history');
const keys = document.querySelectorAll('.key');

let currentValue = '0';
let storedValue = null;
let pendingOperator = null;
let shouldResetDisplay = false;
let lastExpression = '';

function updateDisplay() {
  display.textContent = currentValue;
  history.textContent = lastExpression;
}

function inputNumber(number) {
  if (shouldResetDisplay) {
    currentValue = number === '.' ? '0.' : number;
    shouldResetDisplay = false;
  } else if (number === '.' && currentValue.includes('.')) {
    return;
  } else if (currentValue === '0' && number !== '.') {
    currentValue = number;
  } else if (currentValue.length < 14) {
    currentValue += number;
  }
  updateDisplay();
}

function chooseOperator(operator) {
  if (currentValue === 'Error') clearCalculator();
  if (pendingOperator && !shouldResetDisplay) {
    calculate();
  }
  storedValue = currentValue;
  pendingOperator = operator;
  shouldResetDisplay = true;
  lastExpression = `${storedValue} ${getOperatorSymbol(operator)}`;
  keys.forEach((key) => key.classList.toggle('is-selected', key.dataset.operator === operator));
  updateDisplay();
}

function getOperatorSymbol(operator) {
  return { '/': '÷', '*': '×', '-': '−', '+': '+' }[operator];
}

function calculate() {
  if (storedValue === null || !pendingOperator) return;

  const expression = `${storedValue} ${getOperatorSymbol(pendingOperator)} ${currentValue} =`;
  const first = Number(storedValue);
  const second = Number(currentValue);
  let result;

  if (pendingOperator === '+') result = first + second;
  if (pendingOperator === '-') result = first - second;
  if (pendingOperator === '*') result = first * second;
  if (pendingOperator === '/') result = second === 0 ? 'Error' : first / second;

  currentValue = result === 'Error' ? result : String(Number(result.toFixed(10)));
  storedValue = null;
  pendingOperator = null;
  shouldResetDisplay = true;
  lastExpression = expression;
  keys.forEach((key) => key.classList.remove('is-selected'));
  updateDisplay();
}

function clearCalculator() {
  currentValue = '0';
  storedValue = null;
  pendingOperator = null;
  shouldResetDisplay = false;
  lastExpression = '';
  keys.forEach((key) => key.classList.remove('is-selected'));
  updateDisplay();
}

function deleteLast() {
  if (shouldResetDisplay || currentValue === 'Error') {
    clearCalculator();
    return;
  }
  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
  lastExpression = '';
  updateDisplay();
}

function handleAction(action) {
  if (action === 'clear') clearCalculator();
  if (action === 'delete') deleteLast();
  if (action === 'equals') calculate();
}

keys.forEach((key) => {
  key.addEventListener('click', () => {
    if (key.dataset.number !== undefined) inputNumber(key.dataset.number);
    if (key.dataset.operator) chooseOperator(key.dataset.operator);
    if (key.dataset.action) handleAction(key.dataset.action);
  });
});

document.addEventListener('keydown', (event) => {
  const key = event.key;
  if (/^[0-9.]$/.test(key)) inputNumber(key);
  else if (['+', '-', '*', '/'].includes(key)) chooseOperator(key);
  else if (key === 'Enter' || key === '=') calculate();
  else if (key === 'Escape') clearCalculator();
  else if (key === 'Backspace') deleteLast();
});

updateDisplay();
