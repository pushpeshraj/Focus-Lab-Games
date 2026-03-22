const size = 9;
let solution = [], board = [], selectedCell = null;

function initGame() {
    document.getElementById('status').innerText = "";
    selectedCell = null;
    generateSolution();
    createPuzzle();
    render();
}

function generateSolution() {
    solution = Array.from({ length: 9 }, () => Array(9).fill(0));
    const isValid = (r, c, n) => {
        for (let i = 0; i < 9; i++) if (solution[r][i] === n || solution[i][c] === n) return false;
        const sR = Math.floor(r / 3) * 3, sC = Math.floor(c / 3) * 3;
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
            if (solution[sR + i][sC + j] === n) return false;
        }
        return true;
    };
    const solve = (r, c) => {
        if (r === 9) return true;
        const nR = (c === 8) ? r + 1 : r, nC = (c === 8) ? 0 : c + 1;
        const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
        for (let n of nums) {
            if (isValid(r, c, n)) {
                solution[r][c] = n;
                if (solve(nR, nC)) return true;
                solution[r][c] = 0;
            }
        }
        return false;
    };
    solve(0, 0);
}

function createPuzzle() {
    board = solution.map(r => [...r]);
    let removed = 0;
    while (removed < 45) {
        let r = Math.floor(Math.random() * 9), c = Math.floor(Math.random() * 9);
        if (board[r][c] !== 0) { board[r][c] = 0; removed++; }
    }
}

function render() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${r}-${c}`;
            
            if (board[r][c] !== 0) {
                cell.innerText = board[r][c];
                cell.classList.add('fixed');
            } else {
                cell.classList.add('user-val');
                cell.onclick = () => selectCell(r, c);
            }
            grid.appendChild(cell);
        }
    }
}

function selectCell(r, c) {
    document.querySelectorAll('.cell').forEach(el => el.classList.remove('selected'));
    const cell = document.getElementById(`cell-${r}-${c}`);
    cell.classList.add('selected');
    selectedCell = { r, c };
}

function inputNumber(num) {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    const cell = document.getElementById(`cell-${r}-${c}`);
    
    board[r][c] = num;
    cell.innerText = num === 0 ? "" : num;
    
    checkWin();
}

function checkWin() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] !== solution[r][c]) return;
        }
    }
    document.getElementById('status').innerText = "🎉 Sudoku Solved!";
}

window.onload = initGame;