const size = 6; // Must be even
let board = [], constraints = [];

function initGame() {
    board = Array.from({ length: size }, () => Array(size).fill(0));
    constraints = [];
    generatePuzzle();
    render();
}

function generatePuzzle() {
    // 1. Create a simple valid pattern (checkerboard variant)
    // In a production app, use a solver/generator for unique puzzles
    const template = [
        [1,1,2,2,1,2], [2,2,1,1,2,1], [1,2,1,2,1,2],
        [2,1,2,1,2,1], [1,1,2,2,1,2], [2,2,1,1,2,1]
    ];
    
    // 2. Randomly pick 5-7 pairs to show constraints
    for(let i=0; i<size; i++) {
        for(let j=0; j<size; j++) {
            if (Math.random() > 0.8) {
                const isHoriz = Math.random() > 0.5;
                if (isHoriz && j < size - 1) {
                    constraints.push({r1: i, c1: j, r2: i, c2: j+1, type: template[i][j] === template[i][j+1] ? '=' : 'x'});
                } else if (!isHoriz && i < size - 1) {
                    constraints.push({r1: i, c1: j, r2: i+1, c2: j, type: template[i][j] === template[i+1][j] ? '=' : 'x'});
                }
            }
        }
    }
}

function render() {
    const grid = document.getElementById('grid');
    const container = document.getElementById('game-container');
    grid.innerHTML = '';
    // Clear old markers
    document.querySelectorAll('.rel-h, .rel-v').forEach(el => el.remove());

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.onclick = () => toggle(r, c);
            cell.innerText = board[r][c] === 1 ? '☀️' : (board[r][c] === 2 ? '🌙' : '');
            grid.appendChild(cell);
        }
    }

    constraints.forEach(con => {
        const marker = document.createElement('div');
        marker.innerText = con.type;
        if (con.r1 === con.r2) { // Horizontal
            marker.className = 'rel-h';
            marker.style.top = `${con.r1 * 60 + 20}px`;
            marker.style.left = `${con.c2 * 60}px`;
        } else { // Vertical
            marker.className = 'rel-v';
            marker.style.top = `${con.r2 * 60}px`;
            marker.style.left = `${con.c1 * 60 + 20}px`;
        }
        container.appendChild(marker);
    });
}

function toggle(r, c) {
    board[r][c] = (board[r][c] + 1) % 3;
    render();
    checkWin();
}

function checkWin() {
    const status = document.getElementById('status');
    let empty = false;
    
    for(let r=0; r<size; r++) {
        let rowSum = {1:0, 2:0};
        for(let c=0; c<size; c++) {
            if (board[r][c] === 0) empty = true;
            rowSum[board[r][c]]++;
            
            // Rule: No 3-in-a-row
            if (c < size-2 && board[r][c] !== 0 && board[r][c] === board[r][c+1] && board[r][c] === board[r][c+2]) {
                return status.innerText = "❌ Three in a row!";
            }
        }
        if (!empty && rowSum[1] !== size/2) return status.innerText = "❌ Rows unbalanced";
    }
    
    // Check constraints
    for (let con of constraints) {
        const v1 = board[con.r1][con.c1];
        const v2 = board[con.r2][con.c2];
        if (v1 !== 0 && v2 !== 0) {
            if (con.type === '=' && v1 !== v2) return status.innerText = "❌ Constraint failed (=)";
            if (con.type === 'x' && v1 === v2) return status.innerText = "❌ Constraint failed (x)";
        }
    }

    status.innerText = empty ? "" : "🎉 Tango! You solved it!";
}

window.onload = initGame;