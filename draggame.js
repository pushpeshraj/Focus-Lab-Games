let popSound = new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3");
let draggedBall = null;

// ✅ TIMER VARIABLES
let timeLeft = 60;
let timerInterval;
let gameActive = true;

// ================= CREATE BALLS =================

function createBalls(){

let numbers=[];

// generate 10 numbers
for(let i=0;i<10;i++){
numbers.push(Math.floor(Math.random()*20)+1);
}

// ensure total sum is even
let total = numbers.reduce((a,b)=>a+b,0);

if(total % 2 !== 0){
numbers[0]++; 
}

// get boxes
let box1 = document.getElementById("box1");
let box2 = document.getElementById("box2");

// clear boxes (important)
box1.innerHTML="";
box2.innerHTML="";

// split into two boxes
for(let i=0;i<5;i++){
createBall(numbers[i], box1);
}

for(let i=5;i<10;i++){
createBall(numbers[i], box2);
}

updateSums();

}

// ================= CREATE SINGLE BALL =================

function createBall(value, box, isRedAllowed = true){

let ball = document.createElement("div");

ball.className="ball";
ball.innerText=value;
ball.draggable=true;

// only original balls can be red
if(isRedAllowed && value > 2 && Math.random() < 0.3){
ball.classList.add("red");
}

ball.addEventListener("dragstart",function(){
if(!gameActive) return;
draggedBall=this;
});


// ================= SPLIT LOGIC =================

ball.addEventListener("click",function(){

if(!gameActive) return;

// ✅ only red balls can split + animate
if(!ball.classList.contains("red")) return;

let val = Number(ball.innerText);

if(val <= 2) return;

// 🔊 sound
popSound.currentTime = 0;
popSound.play();

// 💥 animation ONLY for red ball
ball.classList.add("burst");

// delay split
setTimeout(function(){

let part1 = Math.floor(val/2);
let part2 = val - part1;

let currentBox = ball.parentElement;

// create ONLY green balls
createBall(part1, currentBox, false);
createBall(part2, currentBox, false);

ball.remove();

updateSums();

}, 300);

});

box.appendChild(ball);

}

// ================= UPDATE SUMS =================

function updateSums(){

let sum1=0;
let sum2=0;

let box1=document.getElementById("box1").children;
let box2=document.getElementById("box2").children;

for(let ball of box1){
sum1+=Number(ball.innerText);
}

for(let ball of box2){
sum2+=Number(ball.innerText);
}

document.getElementById("sum1").innerText=sum1;
document.getElementById("sum2").innerText=sum2;

// ✅ WIN CONDITION
if(sum1===sum2 && gameActive){

document.getElementById("result").innerText="🎉 You Win!";

clearInterval(timerInterval);
gameActive=false;

}else if(gameActive){

document.getElementById("result").innerText="";

}

}

// ================= DRAG & DROP =================

let boxes=document.querySelectorAll(".box");

boxes.forEach(box=>{

box.addEventListener("dragover",function(e){
e.preventDefault();
});

box.addEventListener("drop",function(){

if(!gameActive) return;

if(draggedBall){
this.appendChild(draggedBall);
draggedBall=null;
updateSums();
}

});

});

// ================= TIMER =================

function startTimer(){

timerInterval = setInterval(function(){

timeLeft--;
document.getElementById("timer").innerText=timeLeft;

if(timeLeft <= 0){

clearInterval(timerInterval);

gameActive=false;

document.getElementById("result").innerText="⏰ Time's Up!";

}

},1000);

}

// ================= START GAME =================

createBalls();
startTimer();

