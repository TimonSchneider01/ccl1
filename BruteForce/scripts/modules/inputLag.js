import { Bullet } from "../gameObjects/Projectile.js";
import { Grenade } from "../gameObjects/grenade.js";
import { global } from "./global.js";
import { setupLevel } from "./main.js";

const playerVelocity = 220;
let grenadeCap = 0;
let clickCount = 0;


const activeKeys = {
    x: [],
    y: [],
};
const direction = { x: 0,};

window.addEventListener("keydown", (e) => handleKeyDown(e));
window.addEventListener("keyup", (e) => handleKeyUp(e));
window.addEventListener("pointerdown", shoot);
window.addEventListener("pointermove", track);
window.addEventListener("keypress", grenade);




let cursorposition = { x: 0, y: 0 };
let bulletArray = [];

function handleKeyDown(event) {
    const key = event.key.toLowerCase();
    switch (key) {
        case "d":
            // if (global.playerObject.xVelocity == 0)
                // global.playerObject.animationData.firstSpriteIndex = 4
                // global.playerObject.animationData.lastSpriteIndex = 11
            // global.playerObject.animationData.currentSpriteIndex = 4;
            addKey("x", 1);
            break;
        case "a":
            if (global.playerObject.xVelocity == 0)
                // global.playerObject.animationData.currentSpriteIndex = 3;
            addKey("x", -1);
            break;
        case " ":
            if (global.playerObject.health > 0) {
            global.playerObject.setJumpForce(0.5);}
            event.preventDefault(); 
            break;
        case "s":
            addKey("y", -1)

            global.playerObject.dodge = 30;

            break;

    }
    updateDirection();
}

function handleKeyUp(event) {
    const key = event.key.toLowerCase();

    switch (key) {
        case "d":
            removeKey("x", 1);
            break;
        case "a":
            removeKey("x", -1);
            break;
        case "s":
            global.playerObject.dodge = 0;
            removeKey("y", -1); 
    }

    updateDirection();
}

function addKey(axis, value) {
    if (!activeKeys[axis].includes(value)) {
        activeKeys[axis].push(value);
    }
}

function removeKey(axis, value) {
    activeKeys[axis] = activeKeys[axis].filter((key) => key !== value);
}

function updateDirection() {
    if (global.playerObject.health > 0) {
    direction.x = activeKeys.x[activeKeys.x.length - 1] || 0;
    direction.y = activeKeys.y[activeKeys.y.length - 1] || 0;

    global.playerObject.xVelocity = direction.x * playerVelocity;
    if (direction.x == 0) {
        global.playerObject.animationData.timePerSprite = 0.15;
        global.playerObject.animationData.firstSpriteIndex = 0;
        global.playerObject.animationData.lastSpriteIndex = 3;
    }
     if (direction.x == 1) {
        global.playerObject.animationData.timePerSprite = 0.08;
        global.playerObject.animationData.firstSpriteIndex = 4;
        global.playerObject.animationData.lastSpriteIndex = 15;
    } else if (direction.x == -1) {
        if (global.playerObject.animationData.currentSpriteIndex <= 16) {
            global.playerObject.animationData.currentSpriteIndex = 16
        }
        global.playerObject.animationData.timePerSprite = 0.08;
        global.playerObject.animationData.firstSpriteIndex = 16;
        global.playerObject.animationData.lastSpriteIndex = 27;
    } else if (direction.y == -1 && direction.x == 0) {
        if (global.playerObject.animationData.currentSpriteIndex <= 28) {
            global.playerObject.animationData.currentSpriteIndex = 29
        } 
        global.playerObject.animationData.firstSpriteIndex = 29;
        global.playerObject.animationData.lastSpriteIndex = 29;

    }

    const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
    if (magnitude > 0) {
        direction.x /= magnitude;
        direction.y /= magnitude;
    }
}
}

function shoot(event) {
    if (global.playerObject.health > 0) {
        clickCount++;
    const rect = global.canvas.getBoundingClientRect();
    cursorposition.x = event.clientX - rect.left;
    cursorposition.y = event.clientY - rect.top;
    const xRelativ = cursorposition.x - global.playerObject.x;
    const yRelativ = cursorposition.y - global.playerObject.y;
    const normal = Math.sqrt(xRelativ ** 2 + yRelativ ** 2);
    const xDirection = xRelativ / normal;
    const yDirection = (yRelativ) / normal;

    if (global.bulletArray.length > 1) {
        global.bulletArray.shift();
    }
    if (direction.y == 0) {
    const bullet = new Bullet(
        global.playerObject.x + global.playerObject.width - 20,
        global.playerObject.y + 40,
        10, 10
    );
    global.bulletArray.push(bullet);
    } else if (direction.y == -1) {
        const bullet = new Bullet(
            global.playerObject.x + global.playerObject.width - 20,
            global.playerObject.y + 80,
            10, 10
        );
    }
    // bullet.xVelocity = this.xRelativ / this.normal * 1300;
    // bullet.yVelocity = this.yRelativ / this.normal * 1300;

    // console.log(bullet.yVelocity)
}
}

function track(event) {
        const rect = global.canvas.getBoundingClientRect();
        cursorposition.x = event.clientX - rect.left;
        cursorposition.y = event.clientY - rect.top;
        const xRelativ = cursorposition.x - global.playerObject.x;
        const yRelativ = cursorposition.y - global.playerObject.y;
        const normal = Math.sqrt(xRelativ ** 2 + yRelativ ** 2);
        const xDirection = xRelativ / normal;
        const yDirection = (yRelativ) / normal;
    } 

    function grenade(event) {
        switch(event.key) {
            case "g": 
            if (grenadeCap <= 2) {
                grenadeCap++;
            const bullet = new Grenade(
                global.playerObject.x + global.playerObject.width - 20,
                global.playerObject.y + 40,
                20, 20
            );
        }
        }
    }




export { shoot };
export {cursorposition, clickCount}
