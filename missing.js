let timeLeft = 60;
let timerInterval;
let gameActive = false;

let correctAnswer;
let score = 0;

function startGame(){

document.getElementById("startBtn").style.display = "none";
document.getElementById("options").style.display = "grid";

gameActive = true;

generateQuestion();

timerInterval = setInterval(function(){

timeLeft--;

document.getElementById("timer").innerText = timeLeft;

if(timeLeft <= 0){

clearInterval(timerInterval);

gameActive = false;

document.getElementById("question").innerText = "Time's Up!";
document.getElementById("options").style.display = "none";

}

},1000);

}

function generateQuestion(){

let operations = ["+","-","*"];

let n1 = Math.floor(Math.random()*10)+1;
let n2 = Math.floor(Math.random()*10)+1;
let n3 = Math.floor(Math.random()*10)+1;

let op1 = operations[Math.floor(Math.random()*operations.length)];
let op2 = operations[Math.floor(Math.random()*operations.length)];

let expression = n1 + " " + op1 + " " + n2 + " " + op2 + " " + n3;

let numbers = expression.split(" ");

let numPositions = [];

for(let i=0;i<numbers.length;i++){
if(!isNaN(numbers[i])) numPositions.push(i);
}

let missingIndex = numPositions[Math.floor(Math.random()*numPositions.length)];

correctAnswer = Number(numbers[missingIndex]);

numbers[missingIndex] = "?";

let result = Math.round(eval(expression));

document.getElementById("question").innerText =
numbers.join(" ") + " = " + result;

generateOptions();
}

function generateOptions(){

let options = [correctAnswer];

while(options.length < 4){

let wrong = correctAnswer + Math.floor(Math.random()*10) - 5;

if(wrong !== correctAnswer && !options.includes(wrong)){
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

if(score > 0){
score--;
}

}

document.getElementById("score").innerText = score;

generateQuestion();

}