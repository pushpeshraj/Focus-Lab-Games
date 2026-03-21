let game = document.getElementById("game");
let car = document.getElementById("car");

let lane = 1;
let speed = 4; // improved starting speed
let score = 0;

let answers = [];
let correctAnswer;

let gameActive = true;

// ⏱ TIMER
let timeLeft = 120;

// ================= CAR =================

document.addEventListener("keydown",function(e){

if(!gameActive) return;

if(e.key === "ArrowLeft" && lane > 0){
lane--;
}

if(e.key === "ArrowRight" && lane < 2){
lane++;
}

updateCarPosition();

});

function updateCarPosition(){
car.style.left = (lane * 100 + 25) + "px";
}

// ================= ROAD =================

function moveRoad(){

let lines = document.querySelectorAll(".line");

lines.forEach((line)=>{

let top = parseInt(line.style.top);

top += speed * 2;

if(top > 500){
top = -80;
}

line.style.top = top + "px";

});

}

// ================= QUESTIONS =================

function generateQuestion(){

let type = Math.floor(Math.random()*4); // 0 to 3

let start = Math.floor(Math.random()*10)+1;
let step = Math.floor(Math.random()*5)+1;

let series = [];

// ➕ addition
if(type === 0){
series = [start, start+step, start+2*step];
correctAnswer = start + 3*step;
}

// ➖ subtraction
if(type === 1){
start = start + 20; // avoid negative
series = [start, start-step, start-2*step];
correctAnswer = start - 3*step;
}

// ✖ multiplication
if(type === 2){
step = Math.floor(Math.random()*3)+2; // 2–4
series = [start, start*step, start*step*step];
correctAnswer = start * step * step * step;
}

// ➗ division
if(type === 3){
step = Math.floor(Math.random()*3)+2;
let val = start * step * step * step;
series = [val, val/step, val/(step*step)];
correctAnswer = val / (step*step*step);
}

// show question
document.getElementById("question").innerText =
series.join(", ") + ", _";

// generate options
answers = [correctAnswer];

while(answers.length < 3){

let wrong = correctAnswer + Math.floor(Math.random()*10) - 5;

if(wrong > 0 && !answers.includes(wrong)){
answers.push(wrong);
}
}

// shuffle
answers.sort(()=>Math.random()-0.5);

createAnswerBoxes();
}

// ================= CREATE BOXES =================

function createAnswerBoxes(){

answers.forEach((ans, i)=>{

let div = document.createElement("div");
div.className="answer";
div.innerText = ans;

div.style.top = "0px";
div.style.left = (i * 100 + 20) + "px";

game.appendChild(div);

});
}

// ================= SPEED CONTROL =================

function increaseSpeed(){
if(speed < 6){
speed += 0.2;
}else{
speed += 0.1;
}
}

// ================= GAME LOOP =================

function gameLoop(){

if(!gameActive) return;

moveRoad();

let allAnswers = document.querySelectorAll(".answer");

allAnswers.forEach((box)=>{

let top = parseInt(box.style.top);
top += speed;
box.style.top = top + "px";

// ✅ COLLISION RANGE
if(top > 380 && top < 460){

let boxLane = Math.round((parseInt(box.style.left)-20)/100);

if(boxLane === lane){

let val = Number(box.innerText);

if(val === correctAnswer){

score++;
increaseSpeed();

document.getElementById("score").innerText = "Score: " + score;

// ✅ REMOVE ALL BOXES (fix lag)
let allBoxes = document.querySelectorAll(".answer");
allBoxes.forEach(b => b.remove());

// small delay for smooth feel
setTimeout(() => {
generateQuestion();
}, 100);

}else{

endGame("💥 Game Over!");

}

}
}

// remove off screen
if(top >= 500){
box.remove();
}

});

}

// ================= TIMER =================

function startTimer(){

let interval = setInterval(function(){

if(!gameActive){
clearInterval(interval);
return;
}

timeLeft--;
document.getElementById("timer").innerText = "Time: " + timeLeft;

if(timeLeft <= 0){
endGame("⏰ Time's Up!");
}

},1000);

}

// ================= END GAME =================

function endGame(message){

gameActive = false;

document.getElementById("result").innerText =
message + " Final Score: " + score;

}

// ================= START =================

generateQuestion();
startTimer();
setInterval(gameLoop, 50);