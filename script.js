let correctAnswer;
let score = 0;

function generateQuestion(){

    let operations = ["+", "-", "*", "/"];

    let n1 = Math.floor(Math.random()*10)+1;
    let n2 = Math.floor(Math.random()*10)+1;
    let n3 = Math.floor(Math.random()*10)+1;
    let n4 = Math.floor(Math.random()*10)+1;

    let op1 = operations[Math.floor(Math.random()*operations.length)];
    let op2 = operations[Math.floor(Math.random()*operations.length)];
    let op3 = operations[Math.floor(Math.random()*operations.length)];

    let expression = n1 + " " + op1 + " " + n2 + " " + op2 + " " + n3;

    if(Math.random() > 0.5){
        expression = expression + " " + op3 + " " + n4;
    }

    correctAnswer = Math.floor(eval(expression));

    document.getElementById("question").innerText = expression;
}

function checkAnswer(){

    let userAnswer = document.getElementById("answer").value;

    if(userAnswer == correctAnswer){

        score++;
        document.getElementById("score").innerText = score;

    }

    generateQuestion();

    document.getElementById("answer").value = "";
}