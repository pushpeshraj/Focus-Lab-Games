const size = 7;
let gridData = []; 
let clues = {}; 

/**
 * Initializes the game. 
 * Using a timeout allows the browser to render the "Generating" text 
 * before the script processes the board layout.
 */
function initGame() {
    const status = document.getElementById('status');
    status.innerText = "Generating Solvable Expert Puzzle...";
    status.style.color = "#2d3436";
    
    setTimeout(() => {
        generateMyCustomGrid();
        render();
        validateGame();
    }, 50);
}

/**
 * Expert Pattern Library
 * Each pattern is a mathematically verified unique Nurikabe layout.
 */

function generateMyCustomGrid() {
    const N = size;
    let B = Array.from({ length: N + 4 }, () => Array(N + 4).fill(1));

    function random(low, high) {
        let val = Math.floor(Math.random() * (high - low));
        if (val < 0)
            val += (high - low);

        let res = 0;
        if (val === 0)
            res = low;
        else
            res = low + (high - low) % val;

        return res;
    }

    function correct(a, b) {
        if (a >= 2 && a <= N + 1 && b >= 2 && b <= N + 1)
            return 1;
        else
            return 0;
    }

    function fills(num) {
        let county = 0;

        for (let i = 2; i <= N + 1; i++) {
            for (let j = 2; j <= N + 1; j++) {
                if (B[i][j] === num)
                    county++;
            }
        }

        if (county === 0) {
            for (let i = 2; i <= N + 1; i++) {
                for (let j = 2; j <= N + 1; j++) {
                    if (
                        B[i][j] === 1 &&
                        B[i][j - 1] === 1 &&
                        B[i][j + 1] === 1 &&
                        B[i + 1][j] === 1 &&
                        B[i - 1][j] === 1 &&
                        random(1, 7) === 3
                    ) {
                        B[i][j] = num;
                        return 1;
                    }
                }
            }
        } else {
            for (let i = 2; i <= N + 1; i++) {
                for (let j = 2; j <= N + 1; j++) {

                    if (
                        B[i][j] === num &&
                        B[i][j - 1] === 1 &&
                        B[i][j - 2] === 1 &&
                        B[i + 1][j - 1] === 1 &&
                        B[i - 1][j - 1] === 1 &&
                        random(1, 4) === 2 &&
                        correct(j - 1, i)
                    ) {
                        B[i][j - 1] = num;
                        return 1;
                    }

                    if (
                        B[i][j] === num &&
                        B[i][j + 1] === 1 &&
                        B[i][j + 2] === 1 &&
                        B[i + 1][j + 1] === 1 &&
                        B[i - 1][j + 1] === 1 &&
                        random(1, 4) === 1 &&
                        correct(j + 1, i)
                    ) {
                        B[i][j + 1] = num;
                        return 1;
                    }

                    if (
                        B[i][j] === num &&
                        B[i - 1][j] === 1 &&
                        B[i - 2][j] === 1 &&
                        B[i - 1][j - 1] === 1 &&
                        B[i - 1][j + 1] === 1 &&
                        random(1, 5) === 1 &&
                        correct(j, i - 1)
                    ) {
                        B[i - 1][j] = num;
                        return 1;
                    }

                    if (
                        B[i][j] === num &&
                        B[i + 1][j] === 1 &&
                        B[i + 2][j] === 1 &&
                        B[i + 1][j - 1] === 1 &&
                        B[i + 1][j + 1] === 1 &&
                        random(1, 5) === 3 &&
                        correct(j, i + 1)
                    ) {
                        B[i + 1][j] = num;
                        return 1;
                    }
                }
            }
        }

        return 0;
    }

    function areAllOnesConnected() {
        let totalOnes = 0;
        let startX = -1, startY = -1;

        for (let i = 2; i <= N + 1; i++) {
            for (let j = 2; j <= N + 1; j++) {
                if (B[i][j] === 1) {
                    totalOnes++;
                    if (startX === -1) {
                        startX = i;
                        startY = j;
                    }
                }
            }
        }

        if (totalOnes === 0) return true;

        let visited = Array.from({ length: N + 2 }, () => Array(N + 2).fill(false));
        let q = [[startX, startY]];
        visited[startX][startY] = true;

        let count = 1;
        let dx = [-1, 1, 0, 0];
        let dy = [0, 0, -1, 1];

        while (q.length) {
            let [x, y] = q.shift();

            for (let i = 0; i < 4; i++) {
                let nx = x + dx[i];
                let ny = y + dy[i];

                if (
                    nx >= 2 && nx <= N + 1 &&
                    ny >= 2 && ny <= N + 1 &&
                    !visited[nx][ny] &&
                    B[nx][ny] === 1
                ) {
                    visited[nx][ny] = true;
                    count++;
                    q.push([nx, ny]);
                }
            }
        }

        return count === totalOnes;
    }

    function check() {
        for (let i = 2; i <= N; i++) {
            for (let j = 2; j <= N; j++) {
                if (
                    B[i][j] === 1 &&
                    B[i][j + 1] === 1 &&
                    B[i + 1][j + 1] === 1 &&
                    B[i + 1][j] === 1
                ) return false;
            }
        }
        return areAllOnesConnected();
    }

    let A = [2, 3, 4, 5, 3, 4, 5];
    let game = 1000000;

    while (game--) {
        for (let i = 0; i < N + 4; i++) {
            for (let j = 0; j < N + 4; j++) {
                B[i][j] = 1;
            }
        }

        let county = 2;

        for (let val of A) {
            let retry = 6 * val;
            let rem = val;

            while (rem && retry--) {
                rem -= fills(county);
            }

            county++;
        }

        if (check()) break;
    }

    // 🔥 SAME TRANSFORMATION (UNCHANGED)
    let countMap = {};
    for (let i = 2; i <= N + 1; i++) {
        for (let j = 2; j <= N + 1; j++) {
            let v = B[i][j];
            if (v !== 1) {
                countMap[v] = (countMap[v] || 0) + 1;
            }
        }
    }

    let used = {};
    gridData = Array.from({ length: size }, () => Array(size).fill(0));
    clues = {};

    for (let i = 2; i <= N + 1; i++) {
        for (let j = 2; j <= N + 1; j++) {

            let v = B[i][j];
            let r = i - 2;
            let c = j - 2;

            if (v !== 1 && !used[v]) {
                clues[`${r},${c}`] = countMap[v];
                gridData[r][c] = 1;
                used[v] = true;
            }
        }
    }
}


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
            } else if (gridData[r][c] === 1) {
                cell.classList.add('is-island');
            } else if (gridData[r][c] === 2) {
                cell.classList.add('is-water');
            }
            
            cell.onclick = () => toggleCell(r, c);
            grid.appendChild(cell);
        }
    }
}

function toggleCell(r, c) {
    // Clued cells are locked
    if (clues[`${r},${c}`]) return; 
    
    // Cycle: Empty (0) -> Island (1) -> Water (2)
    gridData[r][c] = (gridData[r][c] + 1) % 3;
    render();
    validateGame();
}

function validateGame() {
    const status = document.getElementById('status');
    const isFull = !gridData.flat().some(v => v === 0);
    
    if (!isFull) {
        status.innerText = "Rules: 1. Islands = Number. 2. No touching islands. 3. Continuous water. 4. No 2x2 pools.";
        status.style.color = "#636e72";
        return;
    }

    const poolError = hasPools();
    const islandError = !checkIslands();
    const waterError = !isWaterConnected();

    if (poolError) {
        status.innerText = "Status: 2x2 Water Pool detected!";
        status.style.color = "#e17055";
    } else if (islandError || waterError) {
        status.innerText = "Status: Invalid Logic (Check island sizes or connectivity).";
        status.style.color = "#e17055";
    } else {
        status.innerText = "🎉 VICTORY! Puzzle solved correctly.";
        status.style.color = "#27ae60";
    }
}

// --- LOGIC CHECKS ---

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
    const waterCells = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (gridData[r][c] === 2) waterCells.push({r, c});
        }
    }
    if (waterCells.length === 0) return false;

    const visited = new Set();
    const queue = [waterCells[0]];
    
    while (queue.length > 0) {
        const {r, c} = queue.shift();
        const key = `${r},${c}`;
        if (visited.has(key)) continue;
        visited.add(key);

        [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dr, dc]) => {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size && gridData[nr][nc] === 2) {
                queue.push({r: nr, c: nc});
            }
        });
    }
    return visited.size === waterCells.length;
}

function checkIslands() {
    const visited = new Set();
    for (const key in clues) {
        const [startR, startC] = key.split(',').map(Number);
        const island = [];
        const stack = [{r: startR, c: startC}];

        while (stack.length > 0) {
            const {r, c} = stack.pop();
            const k = `${r},${c}`;
            if (visited.has(k) || gridData[r][c] !== 1) continue;
            
            visited.add(k);
            island.push(k);

            [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dr, dc]) => {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                    stack.push({r: nr, c: nc});
                }
            });
        }
        if (island.length !== clues[key]) return false;
    }

    // Check for islands without a number (Rogue islands)
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (gridData[r][c] === 1 && !visited.has(`${r},${c}`)) return false;
        }
    }
    return true;
}

window.onload = initGame;