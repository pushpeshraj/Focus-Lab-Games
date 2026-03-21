const size = 6;
let grid = document.getElementById("grid");

let board = [];
let regions = [];

// ⏱ TIMER
let time = 0;
let timerInterval;
let gameFinished = false;

const colors = ["#ff9999","#99ccff","#99ff99","#ffcc99","#cc99ff","#ffff99"];

// ================= STEP 1: GENERATE VALID QUEENS =================

function generateSolution(){

let solution = [];

function isSafe(row, col){
for(let i=0;i<solution.length;i++){
let c = solution[i];

if(c === col) return false;
if(Math.abs(i-row) === Math.abs(c-col)) return false;
if(Math.abs(i-row)<=1 && Math.abs(c-col)<=1) return false;
}
return true;
}

function backtrack(row){

if(row === size) return true;

let cols = shuffle([...Array(size).keys()]);

for(let col of cols){

if(isSafe(row, col)){
solution[row] = col;

if(backtrack(row+1)) return true;
}
}

return false;
}

backtrack(0);
return solution;
}

// ================= STEP 2: BUILD REGIONS =================

function generateRegions(solution){

regions = Array(size).fill().map(()=>Array(size).fill(-1));

let regionId = 0;

// assign queen cells first
for(let r=0;r<size;r++){
let c = solution[r];
regions[r][c] = regionId++;
}

// expand each region (controlled growth)
let changed = true;

while(changed){
changed = false;

for(let i=0;i<size;i++){
for(let j=0;j<size;j++){

if(regions[i][j] === -1){

let neighbors = [];

[[1,0],[-1,0],[0,1],[0,-1]].forEach(d=>{
let ni=i+d[0], nj=j+d[1];
if(ni>=0 && nj>=0 && ni<size && nj<size){
if(regions[ni][nj] !== -1){
neighbors.push(regions[ni][nj]);
}
}
});

if(neighbors.length){
let pick = neighbors[Math.floor(Math.random()*neighbors.length)];
regions[i][j] = pick;
changed = true;
}

}

}
}

}
}

// ================= SHUFFLE =================

function shuffle(arr){
for(let i=arr.length-1;i>0;i--){
let j=Math.floor(Math.random()*(i+1));
[arr[i],arr[j]]=[arr[j],arr[i]];
}
return arr;
}

// ================= CREATE GRID =================

function createGrid(){

grid.innerHTML = "";
board = Array(size).fill().map(()=>Array(size).fill(0));

for(let i=0;i<size;i++){
for(let j=0;j<size;j++){

let cell = document.createElement("div");
cell.className = "cell";

let reg = regions[i][j];
cell.style.background = colors[reg % colors.length];

cell.addEventListener("click", function(){
toggleQueen(i,j,cell);
});

grid.appendChild(cell);
}
}
}

// ================= TOGGLE =================

function toggleQueen(r,c,cell){

if(gameFinished) return;

if(board[r][c] === 1){
board[r][c] = 0;
cell.innerText = "";
}else{
board[r][c] = 1;
cell.innerText = "👑";
}

checkRules();
}

// ================= CHECK RULES =================

function checkRules(){

let valid = true;

// row
for(let i=0;i<size;i++){
let count = board[i].reduce((a,b)=>a+b,0);
if(count > 1) valid = false;
}

// column
for(let j=0;j<size;j++){
let count = 0;
for(let i=0;i<size;i++){
count += board[i][j];
}
if(count > 1) valid = false;
}

// region
let regionCount = {};
for(let i=0;i<size;i++){
for(let j=0;j<size;j++){
if(board[i][j] === 1){
let reg = regions[i][j];
regionCount[reg] = (regionCount[reg]||0)+1;
if(regionCount[reg] > 1) valid = false;
}
}
}

// no touching
for(let i=0;i<size;i++){
for(let j=0;j<size;j++){
if(board[i][j] === 1){
for(let dx=-1;dx<=1;dx++){
for(let dy=-1;dy<=1;dy++){
if(dx===0 && dy===0) continue;
let ni=i+dx, nj=j+dy;
if(ni>=0 && nj>=0 && ni<size && nj<size){
if(board[ni][nj] === 1){
valid = false;
}
}
}
}
}
}
}

// win
let totalQueens = board.flat().reduce((a,b)=>a+b,0);

if(valid && totalQueens === size){
gameFinished = true;
clearInterval(timerInterval);

document.getElementById("result").innerText =
"🎉 Solved in " + time + " seconds!";
}
else if(!valid){
document.getElementById("result").innerText = "❌ Invalid move!";
}
else{
document.getElementById("result").innerText = "";
}

}

// ================= TIMER =================

function startTimer(){
timerInterval = setInterval(()=>{
if(gameFinished) return;
time++;
document.getElementById("timer").innerText = "Time: " + time + "s";
},1000);
}

// ================= START =================

let solution = generateSolution();
generateRegions(solution);
createGrid();
startTimer();