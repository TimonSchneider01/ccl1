import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../modules/global.js";

class Block extends BaseGameObject {
    name = "Block";
    xVelocity = 0;
    yVelocity = 0;
    useGravityForces = false;
    blockGravityForces = true;
    isBreakable = false;
    health = 100;

    physicsData = {
        "fallVelocity": 0,
        "terminalVelocity": 53,
        "jumpForce": 0,
        "jumpForceDecay": 0,
    }

    reactToCollision = function(collidingObject) {
        switch (collidingObject.name) {
            case "Projectile":
            if (this.health <= 0) {
            }
            break;
            case "fireball":
                break;
            }
        }


    // turn draw function off in order to use this.loadImages()!!
    draw = function() {
        if(this.isBreakable) {
            global.ctx.fillRect(this.x, this.y, this.width, this.height);
            global.ctx.fillStyle = "rgba(80, 210, 210, 0.339)"  
        } else {
        // global.ctx.fillRect(this.x, this.y, this.width, this.height);
        // global.ctx.fillStyle = "white"  
    }
}

    update = function () { 
        if (this.health < 0) {
            this.active = false
        }
    };

    

    constructor(x, y, width, height, isBreakable) {
        super(x, y, width, height);
        this.isBreakable = isBreakable

        // if (isBreakable) {
            // this.image = new Image();
            // this.image.src = "./images/apple.png";
        // }
        // global.ctx.fillStyle = "white";  
        // global.ctx.fillRect(this.x, this.y, this.width, this.height);
      }
}

export {Block}