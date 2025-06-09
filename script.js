const boardElement = document.getElementById('sudoku-board');
const messageElement = document.getElementById('message');
let solution = [];
let puzzle = [];
let timer = 0;
let intervalId = null;


function generateEmptyGrid() {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

function isSafe(grid, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num) return false;
  }

  const startRow = row - (row % 3), startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
}

function solveSudoku(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function removeNumbers(grid, clues = 30) {
  const newGrid = JSON.parse(JSON.stringify(grid));
  let attempts = 81 - clues;

  while (attempts > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (newGrid[row][col] !== 0) {
      newGrid[row][col] = 0;
      attempts--;
    }
  }
  return newGrid;
}

function renderBoard(grid) {
  boardElement.innerHTML = '';
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement('input');
      cell.maxLength = 1;
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (grid[row][col] !== 0) {
        cell.value = grid[row][col];
        cell.disabled = true;
        cell.classList.add('prefilled');
      } else {
        cell.classList.add('editable');
      }

      boardElement.appendChild(cell);
    }
  }
}

function generateSudoku() {
  messageElement.textContent = '';
   clearInterval(intervalId); // Ensure old timer is cleared
  const newBoard = generateEmptyGrid();
  solveSudoku(newBoard);
  solution = JSON.parse(JSON.stringify(newBoard));
  puzzle = removeNumbers(newBoard, 35);
  renderBoard(puzzle);
  startTimer();
//   updateBestTime();
}

function startTimer() {
  clearInterval(intervalId); // Stop any existing timer
  timer = 0; // Reset time
  document.getElementById('timer').textContent = timer;
  intervalId = setInterval(() => {
    timer++;
    document.getElementById('timer').textContent = timer;
  }, 1000);
}

function saveBestTime() {
  if (timer > 0) {
    const best = localStorage.getItem('sudoku_best_time');
    if (!best || timer < parseInt(best)) {
      localStorage.setItem('sudoku_best_time', timer);
      document.getElementById('best-time').textContent = timer;
    }
  }
}


// function updateBestTime() {
//   const best = localStorage.getItem('sudoku_best_time');
//   if (best) {
//     document.getElementById('best-time').textContent = best;
//   }
// }

window.onload = () => {
//   updateBestTime();  // Load best time from storage // not working as of now
  generateSudoku();  // Start new game
};


function checkSolution() {
  const inputs = document.querySelectorAll('.cell');
  let correct = true;

  inputs.forEach((input) => {
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);

    if (!input.disabled) {
      const val = parseInt(input.value);
      if (val !== solution[row][col]) {
        input.style.color = 'red';
        correct = false;
      } else {
        input.style.color = 'black';
      }
    }
  });

  if (correct) {
    messageElement.textContent = '🎉 Congratulations! You solved it!';
    messageElement.style.color = 'green';
    stopTimer();
//   saveBestTime();
  if (soundEnabled) winSound.play();
  messageElement.textContent = '🎉 Congratulations! You solved it!';
  messageElement.style.color = 'green';
  } else {
    messageElement.textContent = '❌ Some entries are incorrect!';
    messageElement.style.color = 'red';
    if (soundEnabled) winSound.play();
  }
}

function resetBoard() {
  const inputs = document.querySelectorAll('.editable');
  inputs.forEach(input => {
    input.value = '';
    input.style.color = 'black';
  });
  messageElement.textContent = '';
}

// Automatically load a puzzle when the page starts
window.onload = generateSudoku;

function startTimer() {
  clearInterval(intervalId);
  timer = 0;
  document.getElementById('timer').textContent = timer;
  intervalId = setInterval(() => {
    timer++;
    document.getElementById('timer').textContent = timer;
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalId);
}

function updateBestTime() {
  const best = localStorage.getItem('sudoku_best_time');
  if (best) document.getElementById('best-time').textContent = best;
}

function saveBestTime() {
  const best = localStorage.getItem('sudoku_best_time');
  if (!best || timer < parseInt(best)) {
    localStorage.setItem('sudoku_best_time', timer);
    updateBestTime();
  }
}

function giveHint() {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cellSelector = `.cell[data-row='${row}'][data-col='${col}']`;
      const input = document.querySelector(cellSelector);
      if (soundEnabled) clickSound.play();

      if (!input.disabled && input.value === '') {
        input.value = solution[row][col];
        input.style.color = 'green';
        return;
      }
    }
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

let soundEnabled = true;
const winSound = new Audio('mixkit-arcade-bonus-alert-767.wav');
const clickSound = new Audio('mixkit-metal-button-radio-ping-2544.wav');
function toggleSound() {
  soundEnabled = !soundEnabled;
  alert(`Sound ${soundEnabled ? 'Enabled 🔊' : 'Disabled 🔇'}`);
}
