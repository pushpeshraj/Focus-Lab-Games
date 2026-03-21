let correctAnswer;
let score = 0;

let timeLeft = 60;
let timerInterval;
let gameActive = false;

function startGame(){

document.getElementById("startBtn").style.display="none";
document.getElementById("options").style.display="grid";

gameActive=true;

generateQuestion();

timerInterval=setInterval(function(){

timeLeft--;
document.getElementById("timer").innerText=timeLeft;

if(timeLeft<=0){

clearInterval(timerInterval);

gameActive=false;

document.getElementById("question").innerText="Time's Up!";
document.getElementById("options").style.display="none";

}

},1000);

}

function generateQuestion(){

let type=Math.floor(Math.random()*4);

if(type===0) generateExpression();
if(type===1) generateMissingNumber();
if(type===2) generateExponent();
if(type===3) generateComparison();

}

function generateExpression(){

let a=Math.floor(Math.random()*10)+1;
let b=Math.floor(Math.random()*10)+1;
let c=Math.floor(Math.random()*10)+1;
let d=Math.floor(Math.random()*10)+1;

correctAnswer=a+b*c-d;

document.getElementById("question").innerText=
a+" + "+b+" * "+c+" - "+d+" = ?";

generateOptions();

}

function generateMissingNumber(){

let a=Math.floor(Math.random()*20)+1;
let b=Math.floor(Math.random()*10)+1;
let c=Math.floor(Math.random()*5)+1;

let result=a+b*c;

correctAnswer=a;

document.getElementById("question").innerText=
"? + "+b+" * "+c+" = "+result;

generateOptions();

}

function generateExponent(){

let a=Math.floor(Math.random()*4)+2;
let b=Math.floor(Math.random()*3)+2;
let c=Math.floor(Math.random()*10)+1;

correctAnswer=Math.pow(a,b)+c;

document.getElementById("question").innerText=
a+"^"+b+" + "+c+" = ?";

generateOptions();

}

function generateComparison(){

let a1=Math.floor(Math.random()*10)+1;
let b1=Math.floor(Math.random()*10)+1;
let c1=Math.floor(Math.random()*10)+1;
let d1=Math.floor(Math.random()*10)+1;

let a2=Math.floor(Math.random()*10)+1;
let b2=Math.floor(Math.random()*10)+1;
let c2=Math.floor(Math.random()*10)+1;
let d2=Math.floor(Math.random()*10)+1;

let exp1=a1+b1*c1-d1;
let exp2=a2+b2*c2-d2;

correctAnswer=Math.max(exp1,exp2);

document.getElementById("question").innerText=
"Which is bigger?\n"+
a1+" + "+b1+" * "+c1+" - "+d1+
"  OR  "+
a2+" + "+b2+" * "+c2+" - "+d2;

generateOptions();

}

function generateOptions(){

let options=[correctAnswer];

while(options.length<4){

let wrong=correctAnswer+Math.floor(Math.random()*20)-10;

if(wrong>=0 && !options.includes(wrong)){
options.push(wrong);
}

}

options.sort(()=>Math.random()-0.5);

let buttons=document.querySelectorAll("#options button");

for(let i=0;i<4;i++){
buttons[i].innerText=options[i];
}

}

function selectAnswer(button){

if(!gameActive) return;

let user=Number(button.innerText);

if(user===correctAnswer){
score++;
}else{
if(score>0) score--;
}

document.getElementById("score").innerText=score;

generateQuestion();

}