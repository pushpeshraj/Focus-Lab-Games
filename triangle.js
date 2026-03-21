let pieces = document.querySelectorAll(".piece");

let selected = null;
let startX = 0;
let startY = 0;

// 🎯 correct positions + rotation
const targets = {
p1: {x:100, y:20, rotation:0},
p2: {x:50, y:120, rotation:180},
p3: {x:150, y:120, rotation:180},
p4: {x:100, y:120, rotation:0}
};

// ================= DRAG =================

pieces.forEach(piece => {

piece.dataset.rotation = 0;

// drag start
piece.addEventListener("mousedown", function(e){
selected = piece;

// FIXED (no jump)
startX = e.clientX - piece.offsetLeft;
startY = e.clientY - piece.offsetTop;
});

// rotate on double click
piece.addEventListener("dblclick", function(){
let r = parseInt(piece.dataset.rotation);
r = (r + 90) % 360;

piece.dataset.rotation = r;
piece.style.transform = "rotate(" + r + "deg)";
});

});

// move
document.addEventListener("mousemove", function(e){

if(selected){
selected.style.left = (e.clientX - startX) + "px";
selected.style.top = (e.clientY - startY) + "px";
}

});

// drop
document.addEventListener("mouseup", function(){

if(selected){
snap(selected);
selected = null;
checkWin();
}

});

// ================= SNAP =================

function snap(piece){

let id = piece.id;
let rect = piece.getBoundingClientRect();
let target = targets[id];

let dx = rect.left - (target.x + 150);
let dy = rect.top - (target.y + 200);

let currentRotation = parseInt(piece.dataset.rotation);

if(Math.abs(dx) < 40 && Math.abs(dy) < 40 && currentRotation === target.rotation){

piece.style.left = target.x + "px";
piece.style.top = target.y + "px";

piece.dataset.locked = "true";

}
}

// ================= WIN =================

function checkWin(){

let win = true;

pieces.forEach(p=>{
if(p.dataset.locked !== "true"){
win = false;
}
});

if(win){
document.getElementById("result").innerText = "🎉 Triangle Completed!";
}

}