import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../modules/global.js";
import { shoot } from "../modules/inputLag.js";
import { cursorposition } from "../modules/inputLag.js";

class Bullet extends BaseGameObject {
    name = "Projectile";
    xRelativ = cursorposition.x - global.playerObject.x;
    yRelativ = cursorposition.y - global.playerObject.y;
    xVelocity = 0;
    yVelocity = 0;
    normal = Math.sqrt(this.xRelativ * this.xRelativ + this.yRelativ * this.yRelativ)
    useGravityForces = true;

    physicsData = {
        "fallVelocity": 4,
        "terminalVelocity": 180,
        "jumpForce": 0,
        "jumpForceDecay": 0,
    }

    normalVector = function() {
        this.xVelocity = this.xRelativ / this.normal * 1300;
        // console.log(this.xRelativ)
        // Correction for player Aim
        if (this.xRelativ <= 50) {
            this.yRelativ = this.yRelativ - 50
        } else if (this.xRelativ <= 200) {
            this.yRelativ = this.yRelativ - 50
        } else if (this.xRelativ <= 400) {
            this.yRelativ = this.yRelativ - 70
        } else if (this.xRelativ <= 500) {
            this.yRelativ = this.yRelativ - 100
        } else if (this.xRelativ <= 600) {
            this.yRelativ = this.yRelativ - 130
        } else if (this.xRelativ <= 700) {
            this.yRelativ = this.yRelativ - 160
        } else if (this.xRelativ >= 701) {
            this.yRelativ = this.yRelativ - 190
        }  
         this.yVelocity = this.yRelativ / this.normal * 1300;
    }




    update = function() {
        this.x += this.xVelocity * global.deltaTime;
        this.y += this.yVelocity * global.deltaTime;
    }



    hit = function() {
        if (this.isBreakable == true) {
            this.health -= 20;
            console.log(this.health)
        }
    }

    reactToCollision = function(collidingObject) {
        switch (collidingObject.name) {
            case "Enemy":
                // this.name = 'x'
                // console.log(this.name)
                // if (!this.hasCollided) {
                        // this.hasCollided = true;
                        // this.name = "x";
                    // this.name = "landed"
                    // this.active = false;
                // console.log(this.health)
                // this.xVelocity = 0;
                // this.yVelocity = 0;
                // this.x = this.previousX;
                // this.y = this.previousY;
            // }
                break;
            case "Skeleton":
                // console.log("collided with a candy")
                break;
            case "Block":
                if (this.getBoxBounds().top < collidingObject.getBoxBounds().bottom) {
                    this.yVelocity = 0;
                    this.y = this.previousY
                    // this.yRelativ = 0;
                    // console.log("X")
                } else if (this.getBoxBounds().bottom < collidingObject.getBoxBounds().top)
                    this.Y = this.previousY
                    // console.log("on top")
                break;
            case "landed":
                // console.log("Yes")
                // if (this.getBoxBounds().bottom > collidingObject.getBoxBounds().top) {
                    // this.y = this.previousY
                // this.physicsData.jumpForce = 0;
                // this.xVelocity = 0;
                // this.yVelocity = 0;
                // }
                // break;
        }
    }


    applyGravity = function () {
        if (this.useGravityForces == false)
            return;
       
        this.physicsData.fallVelocity += global.gravityForce * global.deltaTime * global.pixelToMeter;

        // Apply jump force if active
        if (this.physicsData.jumpForce > 0) {
            this.physicsData.fallVelocity -= this.physicsData.jumpForce * global.pixelToMeter;
            this.physicsData.jumpForce -= this.physicsData.jumpForceDecay * global.deltaTime;
            if (this.physicsData.jumpForce < 0) {
                this.physicsData.jumpForce = 0; 
            }
        }

        if (this.physicsData.fallVelocity > this.physicsData.terminalVelocity * global.pixelToMeter) {
            this.physicsData.fallVelocity = this.physicsData.terminalVelocity  * global.pixelToMeter;
        }

        this.y += this.physicsData.fallVelocity * global.deltaTime;

        for (let i = 0; i < global.allGameObjects.length; i++) {
            let otherObject = global.allGameObjects[i];
            if (otherObject.active == true && otherObject.blockGravityForces == true) {
                let collisionHappened = global.detectBoxCollision(this, otherObject);
                if (collisionHappened) {
                    if (this.y >= otherObject.getBoxBounds().top) {
                        if (otherObject.isBreakable === true) {otherObject.health -= 20}    // for blocks - if they are breakable the lose health                    
                        this.x = this.previousX
                        this.xVelocity *= -0.05;
                        this.hit()
                        // console.log("hit a wall")
                        } else if (this.physicsData.jumpForce == 0) {
                            this.y = otherObject.getBoxBounds().top - this.height - (this.getBoxBounds().bottom - (this.y + this.height)) - 0.5;
                            this.xVelocity = 0;
                            this.yVelocity = 0;
                            this.name = 'landed';
                            // console.log("The Bullet has landed")
                        } 
                        else {
                            console.log('y')
                            this.y = otherObject.getBoxBounds().bottom + this.height - (this.getBoxBounds().top - this.y) + 0.1;
                        }
                        this.physicsData.jumpForce = 0;
                        this.physicsData.fallVelocity = 0;
                }
            }   
        }    
    };

    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.loadImages(["./images/bullet.png"]);
        // this.loadImagesFromSpritesheet("./images/BODY_skeleton.png", 9, 4);
        global.bulletArray.push(this)
        this.normalVector()
    }
}

export {Bullet}