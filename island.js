const size = 7;
let gridData = []; 
let clues = {}; 

function initGame() {
    const status = document.getElementById('status');
    status.innerText = "Generating Expert Puzzle...";
    status.style.color = "#2d3436";
    generateExpertBoard();
    render();
}

// --- GENERATION (High Density) ---
function generateExpertBoard() {
    gridData = Array.from({ length: size }, () => Array(size).fill(0));
    clues = {};
    let tempSolved = Array.from({ length: size }, () => Array(size).fill(2));
    let visited = new Set();
    const targetIslands = 8; 

    for (let i = 0; i < targetIslands; i++) {
        let r, c, attempts = 0;
        do {
            r = Math.floor(Math.random() * size);
            c = Math.floor(Math.random() * size);
            attempts++;
        } while ((visited.has(`${r},${c}`) || isAdjacentToIsland(r, c, tempSolved)) && attempts < 100);

        if (attempts >= 100) continue;

        const islandSize = Math.floor(Math.random() * 4) + 1; 
        const islandCells = growIsland(r, c, islandSize, tempSolved);
        
        const first = islandCells[0];
        clues[`${first.r},${first.c}`] = islandCells.length;
        
        islandCells.forEach(cell => {
            tempSolved[cell.r][cell.c] = 1;
            visited.add(`${cell.r},${cell.c}`);
        });
    }
}

function growIsland(r, c, targetSize, board) {
    let cells = [{r, c}];
    for (let i = 1; i < targetSize; i++) {
        let current = cells[Math.floor(Math.random() * cells.length)];
        const neighbors = [{r:current.r+1,c:current.c},{r:current.r-1,c:current.c},{r:current.r,c:current.c+1},{r:current.r,c:current.c-1}]
            .filter(n => n.r>=0 && n.r<size && n.c>=0 && n.c<size && 
                    !cells.some(cell=>cell.r===n.r && cell.c===n.c) && 
                    !isAdjacentToIsland(n.r, n.c, board, cells));
        if (neighbors.length === 0) break;
        cells.push(neighbors[Math.floor(Math.random() * neighbors.length)]);
    }
    return cells;
}

function isAdjacentToIsland(r, c, board, currentIsland = []) {
    return [{r:r+1,c},{r:r-1,c},{r,c:c+1},{r,c:c-1}].some(n => {
        if (n.r < 0 || n.r >= size || n.c < 0 || n.c >= size) return false;
        return board[n.r][n.c] === 1 && !currentIsland.some(ci => ci.r === n.r && ci.c === n.c);
    });
}

// --- INTERACTION ---
function render() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const key = `${r},${c}`;
            if (clues[key]) {
                cell.innerText = clues[key];
                cell.classList.add('is-island');
                gridData[r][c] = 1; 
            } else if (gridData[r][c] === 1) cell.classList.add('is-island');
            else if (gridData[r][c] === 2) cell.classList.add('is-water');
            cell.onclick = () => toggleCell(r, c);
            grid.appendChild(cell);
        }
    }
}

function toggleCell(r, c) {
    if (clues[`${r},${c}`]) return; 
    gridData[r][c] = (gridData[r][c] + 1) % 3;
    render();
    validateGame();
}

// --- STRICT WIN VALIDATION ---
function validateGame() {
    const status = document.getElementById('status');
    const hasBlankCells = gridData.flat().some(cell => cell === 0);
    const pool = hasPools();
    const islandsValid = checkIslands();
    const waterConnected = isWaterConnected();

    if (hasBlankCells) {
        status.innerText = "Status: All cells must be filled (Island or Water).";
        status.style.color = "#636e72";
    } else if (pool) {
        status.innerText = "Status: 2x2 Water Pool detected!";
        status.style.color = "#e17055";
    } else if (islandsValid && waterConnected) {
        status.innerText = "🎉 VICTORY! Puzzle solved correctly.";
        status.style.color = "#27ae60";
    } else {
        status.innerText = "Status: Invalid layout. Check island sizes or sea continuity.";
        status.style.color = "#e17055";
    }
}

function hasPools() {
    for (let r = 0; r < size - 1; r++) {
        for (let c = 0; c < size - 1; c++) {
            if (gridData[r][c] === 2 && gridData[r+1][c] === 2 && 
                gridData[r][c+1] === 2 && gridData[r+1][c+1] === 2) return true;
        }
    }
    return false;
}



function isWaterConnected() {
    const water = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) if (gridData[r][c] === 2) water.push({r, c});
    }
    if (water.length === 0) return false;
    const visited = new Set();
    const queue = [water[0]];
    while (queue.length > 0) {
        const {r, c} = queue.shift();
        const key = `${r},${c}`;
        if (visited.has(key)) continue;
        visited.add(key);
        [{r:r+1,c},{r:r-1,c},{r,c:c+1},{r,c:c-1}].forEach(n => {
            if (n.r>=0 && n.r<size && n.c>=0 && n.c<size && gridData[n.r][n.c] === 2) queue.push(n);
        });
    }
    return visited.size === water.length;
}

function checkIslands() {
    const visited = new Set();
    for (const key in clues) {
        const [r, c] = key.split(',').map(Number);
        const islandCells = [];
        const stack = [{r, c}];
        while (stack.length > 0) {
            const curr = stack.pop();
            const currKey = `${curr.r},${curr.c}`;
            if (visited.has(currKey)) continue;
            visited.add(currKey);
            islandCells.push(curr);
            [{r:curr.r+1,c:curr.c},{r:curr.r-1,c:curr.c},{r:curr.r,c:curr.c+1},{r:curr.r,c:curr.c-1}].forEach(n => {
                if (n.r>=0 && n.r<size && n.c>=0 && n.c<size && gridData[n.r][n.c] === 1 && !visited.has(`${n.r},${n.c}`)) stack.push(n);
            });
        }
        if (islandCells.length !== clues[key]) return false;
    }
    // Check for islands without clues (rogue islands)
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (gridData[r][c] === 1 && !visited.has(`${r},${c}`)) return false;
        }
    }
    return true;
}

window.onload = initGame;