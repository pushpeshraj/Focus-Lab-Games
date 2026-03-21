const size = 8; // Increased grid size
const colors = [
    "#fab1a0", "#ffeaa7", "#81ecec", "#74b9ff", 
    "#a29bfe", "#dfe6e9", "#55efc4", "#fdcb6e"
];

let board, regions, solution, time = 0, timerInterval, gameFinished = false;

function generateSolution() {
    let sol = new Array(size);
    const isSafe = (r, c) => {
        for (let i = 0; i < r; i++) {
            // LinkedIn Rules: No same column, and no touching cells (adjacent diagonals)
            if (sol[i] === c || (Math.abs(i - r) <= 1 && Math.abs(sol[i] - c) <= 1)) return false;
        }
        return true;
    };
    const backtrack = (r) => {
        if (r === size) return true;
        let cols = [...Array(size).keys()].sort(() => Math.random() - 0.5);
        for (let c of cols) {
            if (isSafe(r, c)) { 
                sol[r] = c; 
                if (backtrack(r + 1)) return true; 
            }
        }
        return false;
    };
    backtrack(0);
    return sol;
}

function generateRegions(sol) {
    regions = Array.from({ length: size }, () => Array(size).fill(-1));
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let minDist = Infinity, best = 0;
            for (let r = 0; r < size; r++) {
                // Manhattan distance to create organic region shapes
                let dist = Math.abs(i - r) + Math.abs(j - sol[r]);
                if (dist < minDist) { minDist = dist; best = r; }
            }
            regions[i][j] = best;
        }
    }
}

function createGrid() {
    const gridEl = document.getElementById("grid");
    gridEl.innerHTML = "";
    gridEl.style.gridTemplateColumns = `repeat(${size}, 60px)`;
    board = Array.from({ length: size }, () => Array(size).fill(0));

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.style.backgroundColor = colors[regions[i][j]];
            
            cell.onmousedown = (e) => {
                if (gameFinished) return;
                // Left click toggles Queen/Empty, Right click (or long press) could toggle X
                // For simplicity, we cycle: Empty (0) -> Queen (1) -> X (2)
                board[i][j] = (board[i][j] + 1) % 3;
                updateCellDisplay(cell, board[i][j]);
                check();
            };
            gridEl.appendChild(cell);
        }
    }
}

function updateCellDisplay(cell, state) {
    if (state === 1) {
        cell.innerText = "👑";
        cell.style.color = "#2d3436";
    } else if (state === 2) {
        cell.innerText = "✕";
        cell.style.color = "rgba(0,0,0,0.3)";
    } else {
        cell.innerText = "";
    }
}

function check() {
    let queens = [];
    for(let r=0; r<size; r++) 
        for(let c=0; c<size; c++) 
            if(board[r][c] === 1) queens.push({r, c, reg: regions[r][c]});

    let violations = new Set();
    
    // Validate rules
    for(let i=0; i<queens.length; i++) {
        for(let j=i+1; j<queens.length; j++) {
            let q1 = queens[i], q2 = queens[j];
            if(q1.r === q2.r || q1.c === q2.c || q1.reg === q2.reg || 
               (Math.abs(q1.r - q2.r) <= 1 && Math.abs(q1.c - q2.c) <= 1)) {
                violations.add("rule-break");
            }
        }
    }

    const res = document.getElementById("result");
    if (violations.size > 0) {
        res.innerText = "❌ Rule Violated";
    } else {
        res.innerText = "";
        if (queens.length === size) {
            gameFinished = true;
            clearInterval(timerInterval);
            res.style.color = "#27ae60";
            res.innerText = `🎉 Solved in ${time}s!`;
        }
    }
}

function startGame() {
    clearInterval(timerInterval);
    time = 0; gameFinished = false;
    document.getElementById("timer").innerText = "Time: 0s";
    document.getElementById("result").innerText = "";
    solution = generateSolution();
    generateRegions(solution);
    createGrid();
    timerInterval = setInterval(() => {
        time++;
        document.getElementById("timer").innerText = `Time: ${time}s`;
    }, 1000);
}

window.onload = startGame;