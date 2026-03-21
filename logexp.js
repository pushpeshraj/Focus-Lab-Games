let correctAnswer;
let score = 0;

let timeLeft = 60;
let timerInterval;
let gameActive = false;

function startGame(){

document.getElementById("startBtn").style.display="none";
document.getElementById("options").style.display="grid";

gameActive = true;

generateQuestion();

timerInterval = setInterval(function(){

timeLeft--;

document.getElementById("timer").innerText = timeLeft;

if(timeLeft<=0){

clearInterval(timerInterval);

gameActive=false;

document.getElementById("question").innerText="Time's Up!";
document.getElementById("options").style.display="none";

}

},1000);

}

function generateQuestion(){

let type = Math.random();

if(type < 0.5){

let base = [2,3,10][Math.floor(Math.random()*3)];
let power = Math.floor(Math.random()*4)+1;

correctAnswer = Math.pow(base,power);

document.getElementById("question").innerText =
base + "^" + power + " = ?";

}else{

let base = [2,3,10][Math.floor(Math.random()*3)];
let power = Math.floor(Math.random()*4)+1;

let number = Math.pow(base,power);

correctAnswer = power;

document.getElementById("question").innerText =
"log_" + base + "(" + number + ") = ?";

}

generateOptions();

}

function generateOptions(){

let options = [correctAnswer];

while(options.length < 4){

let wrong = correctAnswer + Math.floor(Math.random()*6) - 3;

if(wrong !== correctAnswer && wrong>=0 && !options.includes(wrong)){
options.push(wrong);
}

}

options.sort(()=>Math.random()-0.5);

let buttons = document.querySelectorAll("#options button");

for(let i=0;i<buttons.length;i++){
buttons[i].innerText = options[i];
}

}

function selectAnswer(button){

if(!gameActive) return;

let user = Number(button.innerText);

if(user === correctAnswer){

score++;

}else{

if(score>0) score--;

}

document.getElementById("score").innerText = score;

generateQuestion();

}