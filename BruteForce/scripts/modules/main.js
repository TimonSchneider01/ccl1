import { global } from "./global.js";
import { Skeleton } from "../gameObjects/skeleton.js";
import { Block } from "../gameObjects/block.js";
import { Bullet } from "../gameObjects/Projectile.js";
import { Enemy } from "../gameObjects/enemy.js";
import { MoveTrigger } from "../gameObjects/moveTrigger.js";
import { Heal } from "../gameObjects/healPickup.js";
import { Grenade } from "../gameObjects/grenade.js";
import { Grimoire } from "../gameObjects/grimoire.js";
import { clickCount } from "./inputLag.js";

// Event Listeners for starting the game
let firstLevel = document.getElementById("start")
firstLevel.addEventListener("click", setupLevel)
let menu = document.getElementById("menu")
let lose = document.getElementById("lose")
let win = document.getElementById("win")
let back = document.getElementById("reload")
let back2 = document.getElementById("reload2")
let background = document.getElementById("background")
let stats = document.getElementById("stats")
back.addEventListener("click", () => {location.reload()})
back2.addEventListener("click", () => {location.reload()})

let time = 0;


// Add a function that hides the menu 

function gameLoop(totalRunningTime) { 
    global.deltaTime = totalRunningTime - global.prevTotalRunningTime; // Time in milliseconds between frames
    global.deltaTime /= 1000; // Convert milliseconds to seconds for consistency in calculations
    global.prevTotalRunningTime = totalRunningTime; // Save the current state of "totalRunningTime", so at the next call of gameLoop (== next frame) to calculate deltaTime again for that next frame.
    global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height); // Completely clear the canvas for the next graphical output 
    
    for (var i = 0; i < global.allGameObjects.length; i++) { //loop in the (game)loop -> the gameloop is continous anyways.. and on every cylce we do now loop through all objects to execute several operations (functions) on each of them: update, draw, collision detection, ...
        if (global.allGameObjects[i].active == true) {
            global.allGameObjects[i].storePositionOfPreviousFrame();
            global.allGameObjects[i].update();
            global.allGameObjects[i].applyGravity();
            global.checkCollisionWithAnyOther(global.allGameObjects[i]);
            global.allGameObjects[i].draw();
            playerDeath();
        }
    }
    
    requestAnimationFrame(gameLoop); // This keeps the gameLoop running indefinitely
}

function playerDeath() {
    if (global.playerObject.health <= 0) {
        lose.style.display = "flex"
    } 
} 
function playerWin() {
    win.style.display = "flex"
    stats.innerHTML = `You have shot ${clickCount} bullets in ${time} Seconds!`
    clearInterval(Interval)
}

function timeCount() {
    time++
}

// Title Screen
function setupGame() {
    global.playerObject = new Skeleton(600, 400, 128, 128);
    // global.leftMoveTrigger = new MoveTrigger(100, 100, 20, 900, 100);
    // global.rightMoveTrigger = new MoveTrigger(500, 100, 20, 900, -100);
    new Block(0, 720, 2000, 20, false)
    new Block (390, 0, 50, 800, false)
    new Block (800, 620, 50, 800, false)
    new Block (800, 570, 100, 50, false)
    new Block (900, 0, 60, 600, false)
    new Grimoire(950, 590, 128, 128)
    new Heal(235, 590, 128 ,128)
    new Enemy(50, 590, 96, 96, false, 0, 0)
}

// First Level
function setupLevel() {
    let Interval = setInterval(timeCount, 1000)
    background.style.backgroundImage = "url('../images/test.png')";
    // background.style.display = "none"
    menu.style.display = "none"
    global.allGameObjects = []
    global.playerObject = new Skeleton(340, 400, 128, 128);
    global.leftMoveTrigger = new MoveTrigger(300, 0, 20, 900, 100);
    global.rightMoveTrigger = new MoveTrigger(500, 0, 20, 900, -100);
    let floor = new Block(0, 720, 10000, 100, false)
    let ceiling = new Block(0, 0, 10000, 48, false)
    // global.ctx.fillStyle = "black";
    // new Block(340, 400, 128, 128, false)
    

    // 1st walls
    new Block(720, 36, 36 , 412, false)
    new Block(915, 312, 72 , 2, false)
    new Block(720, 448, 710 , 36, false)
    new Block(1852, 348, 220 , 36, false)
    new Block(1070, 184, 746 , 36, false)
    new Block(1816, 184, 36 , 706, false)
    new Block(1556, 610, 120 , 120, false)

    // 2nd walls
    new Block(3206, 36, 36 , 185, false)
    new Block(3060, 222, 180, 36, false)
    new Block(3240, 222, 180, 36, true)
    new Block(3374, 258, 36 , 250, false)
    
    // 3rd walls
    new Block(4344, 305, 36 , 220, false)
    new Block(4344, 525, 36 , 220, true)
    new Block(4344, 305, 638 , 36, false)
    new Block(4982, 305, 36 , 220, false)
    new Block(4982, 525, 36 , 220, true)

    // barricades and Heals
    new Heal(1900, 590, 128 ,128)
    new Grimoire(5700, 590, 128, 128)

    // new Block(1180, 635, 36, 100, false)

    // Enemies
    new Enemy(1200, 400, 96, 96, true, 500, 100)
    new Enemy(740, 400, 96, 96, false, 500, 0)
    new Enemy(1600, 100, 96, 96, true, 700, 0)
    new Enemy(2000, 100, 96, 96, false, 500, 500)
    new Enemy(2600, 400, 96, 96, true, 500, 500)
    new Enemy(2650, 400, 96, 96, true, 500, 500)
    new Enemy(2650, 400, 96, 96, false, 500, 500)
    new Enemy(3025, 100, 96, 96, false, 500, 1000)
    new Enemy(3260, 100, 96, 96, false, 500, 1000)
    new Enemy(4355, 200, 96, 96, false, 500, 1000)
    new Enemy(4455, 200, 96, 96, true, 500, 1000)
    new Enemy(4955, 200, 96, 96, false, 500, 1000)
    new Enemy(4555, 500, 96, 96, true, 600, 10)
    new Enemy(4665, 500, 96, 96, true, 600, 10)
    new Enemy(4775, 500, 96, 96, true, 600, 10)
}

setupGame();
requestAnimationFrame(gameLoop);

export { setupLevel, playerWin }


