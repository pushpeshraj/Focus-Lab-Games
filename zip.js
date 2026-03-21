const size = 5;
let path = []; 
let anchors = {}; 
let solutionPath = [];

function initGame() {
    generateSolvablePath();
    render();
}

// 1. GENERATE A GUARANTEED SOLVABLE PATH
function generateSolvablePath() {
    const totalCells = size * size;
    let attempts = 0;
    
    while (attempts < 500) {
        let currentPath = [{r: 0, c: 0}];
        let visited = new Set(["0,0"]);
        
        for (let i = 0; i < totalCells - 1; i++) {
            let last = currentPath[currentPath.length - 1];
            let neighbors = [
                {r: last.r+1, c: last.c}, {r: last.r-1, c: last.c},
                {r: last.r, c: last.c+1}, {r: last.r, c: last.c-1}
            ].filter(n => 
                n.r >= 0 && n.r < size && n.c >= 0 && n.c < size && !visited.has(`${n.r},${n.c}`)
            );

            if (neighbors.length === 0) break; // Dead end, try again
            let next = neighbors[Math.floor(Math.random() * neighbors.length)];
            currentPath.push(next);
            visited.add(`${next.r},${next.c}`);
        }

        if (currentPath.length === totalCells) {
            solutionPath = currentPath;
            createAnchors(solutionPath);
            path = [{r: 0, c: 0}]; // Reset player to start
            return;
        }
        attempts++;
    }
}

// 2. PLACE ANCHOR NUMBERS (1, 12, 25, etc.)
function createAnchors(sol) {
    anchors = {};
    const points = [0, 6, 12, 18, 24]; // Indices for the numbers shown to player
    points.forEach(idx => {
        let p = sol[idx];
        anchors[`${p.r},${p.c}`] = idx + 1;
    });
}

function render() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const key = `${r},${c}`;
            
            // Highlight player path
            const pathIdx = path.findIndex(p => p.r === r && p.c === c);
            if (pathIdx !== -1) {
                cell.innerText = pathIdx + 1;
                cell.classList.add('filled');
                if (pathIdx === path.length - 1) cell.classList.add('active');
            }

            // Always show fixed anchors
            if (anchors[key]) {
                cell.innerText = anchors[key];
                cell.classList.add('fixed');
            }

            cell.onclick = () => handleMove(r, c);
            grid.appendChild(cell);
        }
    }
}

function handleMove(r, c) {
    const last = path[path.length - 1];
    const alreadyInPathIdx = path.findIndex(p => p.r === r && p.c === c);

    // Undo logic: Click any previous cell in your path to go back to that point
    if (alreadyInPathIdx !== -1 && alreadyInPathIdx < path.length - 1) {
        path = path.slice(0, alreadyInPathIdx + 1);
    } 
    // Move logic: Must be adjacent and not already used
    else if (Math.abs(last.r - r) + Math.abs(last.c - c) === 1 && alreadyInPathIdx === -1) {
        const step = path.length + 1;
        const key = `${r},${c}`;
        // If the cell is an anchor, it MUST match the current step number
        if (anchors[key] && anchors[key] !== step) {
            document.getElementById('status').innerText = `❌ Wrong path! That cell is #${anchors[key]}`;
            return;
        }
        path.push({r, c});
        document.getElementById('status').innerText = "";
    }
    
    render();
    if (path.length === size * size) {
        document.getElementById('status').innerText = "🎉 Zip Complete!";
    }

    
}

window.onload = initGame;