'use strict';

// Variables
let firstVal = '';
let secondVal = '';
let answer = '';
let operator = '';
let currentNum = '';
let placeholder = ''; // Used as an alternative to currentNum if you enter a number while the equalsCheck is TRUE
let equalsCheck = false;
let dot = false;
const numbers = document.querySelectorAll('.numbers');
const operators = document.querySelectorAll('.operators');
const clear = document.querySelector('.clear');
const backspaceBtn = document.querySelector('.backspace');
const pos_neg = document.querySelector('.pos__neg');
const dotBtn = document.querySelector('.dot');
const doc = document;
const op_container = document.querySelector('.operation__container');
const result_container = document.querySelector('.result__container');

// Functions
const add = function (first, second) {
  return (answer = first + second);
};
const subtract = function (first, second) {
  return (answer = first - second);
};
const divide = function (first, second) {
  return (answer = first / second);
};
const multiply = function (first, second) {
  return (answer = first * second);
};

const operate = function (op) {
  switch (op) {
    case '+':
      return add(Number(firstVal), Number(secondVal));
    case '-':
      return subtract(Number(firstVal), Number(secondVal));

    case '÷':
      return divide(Number(firstVal), Number(secondVal));

    case '*':
      return multiply(Number(firstVal), Number(secondVal));
  }
};

const clearData = function () {
  result_container.innerText = '';
  op_container.innerText = '0';
  firstVal = '';
  secondVal = '';
  answer = '';
  operator = '';
  currentNum = '';
  equalsCheck = false;
  dot = false;
};

const input = function (e, mode) {
  if (currentNum.length < 16) {
    if (equalsCheck && dot) {
      firstVal += mode === 'click' ? e.target.innerText : e.code.slice(-1);
      op_container.innerText = firstVal;
    } else {
      if (equalsCheck) {
        placeholder += mode === 'click' ? e.target.innerText : e.code.slice(-1);
        op_container.innerText = placeholder;
        firstVal = placeholder;
      } else {
        if (
          mode === 'click'
            ? e.target.innerText === '0' && op_container.innerText === '0'
            : e.code.slice(-1) === '0' && op_container.innerText === '0'
        ) {
          return;
        } else {
          currentNum +=
            mode === 'click' ? e.target.innerText : e.code.slice(-1);
          op_container.innerText = currentNum;
        }
      }
    }
  }
};

const backspace = function () {
  if (op_container.innerText != '') {
    op_container.innerText = op_container.innerText.slice(0, -1);
    currentNum = op_container.innerText;
    currentNum === '' ? (op_container.innerText = '0') : currentNum;
  }
};

const settings = function () {
  // Changes the font size to small
  result_container.innerText.length >= 30
    ? result_container.classList.add('font-small')
    : result_container.classList.remove('font-small');

  // Converts the answer to exponential form
  if (String(answer).length >= 18) {
    op_container.innerText = answer.toExponential(10);
  }
};

const display = function (e) {
  if (e != '=') {
    result_container.innerText = `${firstVal}${operator}${secondVal}`;
    op_container.innerText =
      secondVal === 0 ? `Cannot divide by zero` : `${firstVal}`;
  } else if (e === '=') {
    result_container.innerText = `${firstVal}${operator}${secondVal}=`;
    op_container.innerText = secondVal === 0 && `Cannot divide by zero`;
  }
};

// Event Handlers
numbers.forEach((num) =>
  num.addEventListener('click', function (e) {
    input(e, 'click');
  })
);

operators.forEach((op) =>
  op.addEventListener('click', function (e) {
    if ((!firstVal || firstVal === 0) && e.target.innerText != '=') {
      firstVal = Number(currentNum);
      currentNum = '';
      operator = e.target.innerText;
      display(e.target.innerText);
    }

    if (e.target.innerText != '=') {
      dot = false;
      placeholder = '';
      if (firstVal && currentNum === '') {
        // If secondVal has no value and you clicked the operators, the current operator will be updated
        operator = e.target.innerText;
        display(e.target.innerText);
      } else if (firstVal && currentNum != '') {
        // Resets the secondVal if you click the operators after using the equal button
        if (op_container.innerText === 'Cannot divide by zero') {
          return;
        } else if (
          equalsCheck &&
          op_container.innerText != 'Cannot divide by zero'
        ) {
          secondVal = '';
          currentNum = '';
          operator = e.target.innerText;
          equalsCheck = false;
          display(e.target.innerText);
        } else {
          secondVal = Number(currentNum);
          // Check if the divisor is zero
          if (secondVal === 0) {
            display(e.target.innerText);
          } else {
            operate(operator);
            operator = e.target.innerText;
            firstVal = answer;
            currentNum = '';
            secondVal = '';
            display(e.target.innerText);
          }
        }
      }
    } else if ((e.target.innerText = '=')) {
      dot = false;
      placeholder = '';
      equalsCheck = true;
      // Reset all data if you press "equals" after dividing a number by zero
      if (op_container.innerText === 'Cannot divide by zero') {
        clearData();
      } else {
        if (firstVal && operator && currentNum != '') {
          secondVal = Number(currentNum);
          if (secondVal === 0) {
            display(e.target.innerText);
          } else {
            display(e.target.innerText);
            operate(operator);
            firstVal = answer;
            op_container.innerText = answer;
          }
        } // These functions will occur if you want to operate 2 numbers by clickling "equals"
        else if (firstVal <= 0 && operator && currentNum != '') {
          secondVal = Number(currentNum);
          operate(operator);
          display(e.target.innerText);
          firstVal = answer;
          op_container.innerText = answer;
        } else if (firstVal && operator && currentNum === '') {
          currentNum = firstVal;
          secondVal = currentNum;
          operate(operator);
          display(e.target.innerText);
          firstVal = answer;
          op_container.innerText = answer;
        }
      }
    }
    settings();
  })
);

// Converts the currentNum to positive/negative number
pos_neg.addEventListener('click', function () {
  if (equalsCheck) {
    firstVal *= -1;
    op_container.innerText = firstVal;
  } else {
    if (currentNum === 0) {
      return;
    } else if (currentNum > 0 || currentNum < 0) {
      currentNum *= -1;
      op_container.innerText = currentNum;
    }
  }
});

// Clear all values in all of the variables
clear.addEventListener('click', function () {
  clearData();
});

// Remove a number/character in the operation__container
backspaceBtn.addEventListener('click', function () {
  backspace();
});

// Check if dot exists
dotBtn.addEventListener('click', function () {
  if (!dot) {
    if (equalsCheck) {
      firstVal = '0.';
      op_container.innerText = firstVal;
      dot = true;
    } else {
      currentNum === '' ? (currentNum += '0.') : (currentNum += '.');
      op_container.innerText = currentNum;
      dot = true;
    }
  }
});

// Support for keypress
doc.addEventListener('keydown', function (e) {
  // Keyboard support for entering numbers
  if (e.code.slice(0, -1) === 'Digit') {
    input(e, 'keydown');
  }
  // Keyboard support for backspace
  if (e.key === 'Backspace') {
    backspace();
  }
});
