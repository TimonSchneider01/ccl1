import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../modules/global.js";

class Skeleton extends BaseGameObject {
    name = "Skeleton";
    xVelocity = 0;
    yVelocity = 0;
    useGravityForces = true;
    maxHealth = 200;
    health = 200;
    dodge = 0;




    getBoxBounds = function () {
        let bounds = {
            left: this.x + 20,
            right: this.x + this.width - 20,
            top: this.y + this.dodge,
            bottom: this.y + this.height
        }
        return bounds;
    };

    drawHealthBar = function () {
        const maxBarWidth = this.maxHealth * 6; 
        const barHeight = 130; 
        const healthProportion = Math.max(this.health / this.maxHealth, 0);
        const barWidth = maxBarWidth * healthProportion;
    
        global.userInterface.save();
    
        global.userInterface.fillStyle = "gray";
        global.userInterface.fillRect(0, 0, maxBarWidth, barHeight);
    
        global.userInterface.fillStyle = "red";
        global.userInterface.fillRect(0, 0, barWidth, barHeight);
        global.userInterface.restore();
    };


    
    reactToCollision = function(collidingObject) {
        switch (collidingObject.name) {
            case "EnemyBullet":
                collidingObject.active = false;
                this.health -= 40;
            if (this.health <= 0) {
                this.health = 0;
                this.xVelocity = 0;
                this.yVelocity = 0;
                this.switchCurrentSprites(28, 28)
                this.x = this.previousX;
                this.y = this.previousY;
            }
                break;
            case "Block":
                if(this.getBoxBounds().top <= collidingObject.getBoxBounds().bottom) {
                    this.y = this.previousY
                }
                break;
        }
    }


    applyGravity = function () {
        if (!this.useGravityForces)
            return;
       
        this.physicsData.fallVelocity += global.gravityForce * global.deltaTime * global.pixelToMeter;

        if (this.physicsData.jumpForce > 0) {
            if (this.physicsData.isGrounded == true) {
                this.physicsData.fallVelocity = 0;
            }
            this.physicsData.isGrounded = false;            
            this.physicsData.fallVelocity -= this.physicsData.jumpForce * global.pixelToMeter;
            this.physicsData.jumpForce -= this.physicsData.jumpForceDecay * global.deltaTime;
            if (this.physicsData.fallVelocity > 0 || this.physicsData.jumpForce == 0) {
                this.physicsData.jumpForce = 0;
            }
        }

        if (this.physicsData.fallVelocity > this.physicsData.terminalVelocity * global.pixelToMeter) {
            this.physicsData.fallVelocity = this.physicsData.terminalVelocity  * global.pixelToMeter;
        }

        this.y += (this.physicsData.fallVelocity * global.deltaTime + this.physicsData.prevFallingVelocity) / 2;
        this.physicsData.prevFallingVelocity = this.physicsData.fallVelocity  * global.deltaTime;

        for (let i = 0; i < global.allGameObjects.length; i++) {
            let otherObject = global.allGameObjects[i];
            if (otherObject.active == true && otherObject.blockGravityForces == true) {
                let collisionHappened = global.detectBoxCollision(this, otherObject);
                if (collisionHappened && otherObject.pickUp == false) {
                    if (this.y >= otherObject.getBoxBounds().top) {
                        this.x = this.previousX
                    } else if (this.getBoxBounds().top > otherObject.getBoxBounds().bottom) {
                        // this.y = this.previousY;
                        } else if (this.physicsData.fallVelocity > 0) {
                            this.physicsData.isGrounded = true;
                            this.y = otherObject.getBoxBounds().top - this.height - (this.getBoxBounds().bottom - (this.y + this.height)) - 0.1;
                        }
                        else if (this.physicsData.fallVelocity < 0) {
                            this.xVelocity = 0;
                        }
                        else if (this.physicsData.jumpForce == 0) {
                            this.y = otherObject.getBoxBounds().top - this.height - (this.getBoxBounds().bottom - (this.y + this.height)) - 0.1;
                        }
                        else {
                            this.y = otherObject.getBoxBounds().bottom + this.height - (this.getBoxBounds().top - this.y) + 0.1;
                        }
                        this.physicsData.jumpForce = 0;
                        this.physicsData.fallVelocity = 0;
                }
            }   
        }    
    };


    update = function() {
        this.x += this.xVelocity * global.deltaTime;
        this.y += this.yVelocity * global.deltaTime;
    }

    constructor(x, y, width, height) {
        super(x, y, width, height);
        // this.loadImages(["./images/apple.png"]);
        this.loadImagesFromSpritesheet("./images/AstartesSprite2.png", 8, 4);
    }
}

export {Skeleton}