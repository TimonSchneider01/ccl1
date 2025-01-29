import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../modules/global.js";
import { shoot } from "../modules/inputLag.js";
import { cursorposition } from "../modules/inputLag.js";
import { Bullet } from "./Projectile.js";

class Grenade extends BaseGameObject {
    name = "Grenade";
    xRelativ = cursorposition.x - global.playerObject.x;
    yRelativ = cursorposition.y - global.playerObject.y;
    xVelocity = 0;
    yVelocity = 0;
    normal = Math.sqrt(this.xRelativ * this.xRelativ + this.yRelativ * this.yRelativ)
    useGravityForces = true;
    timeToExplode = 3;
    counter = 0;
    exploded = false;

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


    getBoxBounds = function () {
        let bounds = {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height 
        }
        return bounds;
    };


    detonation = function() {
        if (this.counter >= this.timeToExplode) {
            this.animationData.firstSpriteIndex = 1;
            this.animationData.lastSpriteIndex = 11;
            if (this.animationData.currentSpriteIndex == this.animationData.firstSpriteIndex) {
                this.width = 256;
                this.height = 256;
                this.name = "fireball"
                if ( this.exploded == false) {
                this.y -= 128;
                this.x -= 128;
                }
                this.exploded = true;
            }
            if (this.animationData.currentSpriteIndex >= this.animationData.lastSpriteIndex) {
                this.active = false;
            }
        }
    }

    


    update = function() {
        this.x += this.xVelocity * global.deltaTime;
        this.y += this.yVelocity * global.deltaTime;
        
        
        this.counter += global.deltaTime;
        // console.log(this.counter)
        this.detonation();
    }



    hit = function() {
        // if (this.isBreakable == true) {
            // this.health -= 20;
            // console.log(this.health)
        // }
    }

    reactToCollision = function(collidingObject) {
        switch (collidingObject.name) {
            case "Block": 
            this.xVelocity *= -.2;
            this.yVelocity = 0;
            // this.physicsData.jumpForce = 0;
            this.physicsData.fallVelocity = 0;
            this.physicsData.terminalVelocity = 0;
            break;
            case "Enemy": 
            this.xVelocity = collidingObject.xVelocity;
            this.yVelocity = collidingObject.yVelocity;
            this.physicsData.terminalVelocity = 0;

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
    //             if (collisionHappened) {
    //                 if (this.y >= otherObject.getBoxBounds().top && this.name == "Grenade") {
    //                     if (otherObject.isBreakable === true) {otherObject.health -= 20}    // for blocks - if they are breakable the lose health                    
    //                     this.x = this.previousX
    //                     this.xVelocity *= -0.05;
    //                     this.hit()
    //                     console.log("hit a wall")
    //                     } else if (this.physicsData.jumpForce == 0) {
    //                         this.y = otherObject.getBoxBounds().top - this.height - (this.getBoxBounds().bottom - (this.y + this.height)) - 0.5;
    //                         this.xVelocity = 0;
    //                         this.yVelocity = 0;
    //                         this.name = 'landed';
    //                         // console.log("The Bullet has landed")
    //                     } 
    //                     else {
    //                         console.log('y')
    //                         this.y = otherObject.getBoxBounds().bottom + this.height - (this.getBoxBounds().top - this.y) + 0.1;
    //                     }
    //                     this.physicsData.jumpForce = 0;
    //                     this.physicsData.fallVelocity = 0;
    //             }
            }   
        }    
    };

    constructor(x, y, width, height) {
        super(x, y, width, height);
        // this.loadImages(["./images/apple.png"]);
        this.loadImagesFromSpritesheet("./images/grenade.png", 6, 2);
        global.bulletArray.push(this)
        this.normalVector()
    }
}

export {Grenade} 