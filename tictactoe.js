let board = ["","","","","","","","",""];

const winPatterns = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
];

let gameOver = false;

function move(cell,index){

if(board[index]!=="" || gameOver) return;

cell.innerText="X";
board[index]="X";

if(checkWinner("X")){
document.getElementById("result").innerText="You Won!";
gameOver=true;
return;
}

computerMove();

}

function computerMove(){

let empty=[];

for(let i=0;i<board.length;i++){
if(board[i]=="") empty.push(i);
}

if(empty.length==0){
document.getElementById("result").innerText="Draw!";
gameOver=true;
return;
}

let random = empty[Math.floor(Math.random()*empty.length)];

board[random]="O";

document.getElementsByTagName("button")[random].innerText="O";

if(checkWinner("O")){
document.getElementById("result").innerText="Computer Won!";
gameOver=true;
}

}

function checkWinner(player){

for(let pattern of winPatterns){

let [a,b,c]=pattern;

if(board[a]==player && board[b]==player && board[c]==player){
return true;
}

}

return false;

}

function resetGame(){

board=["","","","","","","","",""];

let buttons=document.getElementsByTagName("button");

for(let i=0;i<9;i++){
buttons[i].innerText="";
}

document.getElementById("result").innerText="";
gameOver=false;

}