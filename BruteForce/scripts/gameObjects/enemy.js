import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../modules/global.js";
import { Bullet } from "./Projectile.js";

class Enemy extends BaseGameObject {
    name = "Enemy";
    active = true;
    // xVelocity = -60;
    shootAtX = global.playerObject.x
    shootAtY = global.playerObject.y
    xRelativ = global.playerObject.x - this.x;
    yRelativ = global.playerObject.y - this.y;
    normal = Math.sqrt(this.xRelativ * this.xRelativ + this.yRelativ * this.yRelativ)
    useGravityForces = true;
    timeTracker = 0;
    timeToShoot = 1;
    patrouilleTracker = 0;
    patrouilleTime = 20;
    detectionRadiusHor = 500;
    detectionRadiusVer = 500;
    move = false;
    aggresion = false;
    health = 90;
    maxHealth = 90;

    
    animationData = {
        "animationSprites": [],
        "timePerSprite": 0.08,
        "currentSpriteElapsedTime": 0,
        "firstSpriteIndex": 9,
        "lastSpriteIndex": 9,
        "currentSpriteIndex": 1,
    };


    patrouille = function () {
        if (this.move && this.aggresion == false) {
        if (this.patrouilleTracker < 3) {
                this.xVelocity = -60;
                this.directionToSprites()
        } else if (this.patrouilleTracker > 3) {
                this.xVelocity = 60;
                this.directionToSprites();
        }
        }
    }

drawHealthBar = function () {
    const maxBarWidth = this.width; // Health bar is as wide as the object
    const barHeight = 5; // Height of the health bar
    const healthProportion = Math.max(this.health / this.maxHealth, 0); // Prevent negative scaling
    const barWidth = maxBarWidth * healthProportion;

    global.ctx.save();

    global.ctx.fillStyle = "gray";
    global.ctx.fillRect(this.x, this.y - barHeight - 2, maxBarWidth, barHeight);

    global.ctx.fillStyle = "red";
    global.ctx.fillRect(this.x, this.y - barHeight - 2, barWidth, barHeight);
    global.ctx.restore();
};

directionToSprites = function() {
    if (this.xVelocity == -60) {
        this.animationData.currentSpriteIndex = 0;
        this.animationData.firstSpriteIndex = 0;
        this.animationData.lastSpriteIndex = 8;
    } else if (this.xVelocity == 60) {
        this.animationData.currentSpriteIndex = 9;
        this.animationData.firstSpriteIndex = 9;
        this.animationData.lastSpriteIndex = 17;
    } else if (this.xVelocity == 0 && global.playerObject.x >= this.getBoxBounds().right) {
        this.animationData.firstSpriteIndex = 17;
        this.animationData.lastSpriteIndex = 17;
        this.animationData.currentSpriteIndex = 17;
    } else {
        this.animationData.firstSpriteIndex = 0;
        this.animationData.lastSpriteIndex = 0;
        this.animationData.currentSpriteIndex = 0;
    }
}
    

    trackPlayer = function() {
        if (this.move == true) {
            if(global.playerObject.x <= this.getBoxBounds().left) {
                this.xVelocity = -60
                this.directionToSprites();
            } else if (global.playerObject.x >= this.getBoxBounds().right) {
                this.xVelocity = 60
                this.directionToSprites();
            } 
            } else if (this.move == false) {
                if (global.playerObject.x >= this.getBoxBounds().right) {
                    this.xVelocity = 0;
                    this.directionToSprites();
                } else {
                    this.xVelocity = 0;
                    this.directionToSprites();
                }
        }
    }

    aimBot = function() {
        this.x += this.xVelocity * global.deltaTime;
        this.y += this.yVelocity * global.deltaTime;
        this.xRelativ = global.playerObject.x - this.x;
        this.yRelativ = global.playerObject.y - this.y - 60;
        if(Math.abs(this.x - global.playerObject.x) < 240) {
            // console.log("Really close")
            this.yRelativ = global.playerObject.y - this.y -40;
        } else if (Math.abs(this.x - global.playerObject.x) < 355) {
            this.yRelativ = global.playerObject.y - this.y -80;
            // console.log("close")
        } else if (Math.abs(this.x - global.playerObject.x) < 440) {
            // console.log("far")
            this.yRelativ = global.playerObject.y - this.y -100 ;
        } else if(Math.abs(this.x - global.playerObject.x) < 520) {
            // console.log("realy far")
            this.yRelativ = global.playerObject.y - this.y -140 ;
        } else if (Math.abs(this.x - global.playerObject.x) > 520) {
            // console.log("realy really far")
            this.yRelativ = global.playerObject.y - this.y -180 ;
        }

        this.normal = Math.sqrt(this.xRelativ * this.xRelativ + this.yRelativ * this.yRelativ)
        this.bulletVelocityX = this.xRelativ / this.normal * 1000;
        this.bulletVelocityY = this.yRelativ / this.normal * 1000;
    }
    

    update = function() {
        this.aimBot();
        this.timeTracker += global.deltaTime;
        this.patrouilleTracker += global.deltaTime;
        if(this.timeTracker > this.timeToShoot) {
            this.timeTracker = 0;
            this.attack();
            this.patrouille()
        }
        if(this.patrouilleTracker > 6) {
            this.patrouilleTracker = 0
        
        }
    }


    detectPlayer = function () {
        let bounds = {
            left: this.x - this.detectionRadiusHor,
            right: this.x + this.width + this.detectionRadiusHor,
            top: this.y,
            bottom: this.y + this.height + this.detectionRadiusVer
        }
        return bounds;
    };

    attack = function () {
        if (global.playerObject.getBoxBounds().right >= this.detectPlayer().left 
        && global.playerObject.getBoxBounds().top <= this.detectPlayer().bottom
        && global.playerObject.getBoxBounds().left <= this.detectPlayer().right) {
            // this.setJumpForce(.25)
            this.shootPlayer();
            this.trackPlayer();
            this.aggresion = true;
            this.detectionRadiusVer = 2000;
            this.detectionRadiusHor = 2000;
        }
    }

    shootPlayer = function() {
        const x = new Bullet(this.x + this.width / 2, this.y + this.height / 2, 10, 10)
        x.name = 'EnemyBullet'
        x.xVelocity = this.bulletVelocityX;
        x.yVelocity = this.bulletVelocityY;
            }
    


    getBoxBounds = function () {
        let bounds = {
            left: this.x + 20,
            right: this.x + this.width - 20,
            top: this.y,
            bottom: this.y + this.height
        }
        return bounds;
    };

    


    reactToCollision = function(collidingObject) {
        switch (collidingObject.name) {
            case "Projectile":
                    this.detectionRadius = 1000;
                    collidingObject.active = false;
                this.health -= 20;
            console.log(this.health)
            if (this.health <= 0) {
                this.health = 0;
                this.xVelocity = 0;
                this.animationData.animationSprites = [];
                this.switchCurrentSprites(0, 0)
                this.loadImages(["./images/dead.png"])
                this.reactToCollision = function() {}
                this.attack = function() {}
                this.move = false;
                this.name = "dead"
            }
                break;
            case "fireball":
                case "Projectile":
                    this.detectionRadius = 1000;
                    // collidingObject.active = false;
                this.health -= 200;
            console.log(this.health)
            if (this.health <= 0) {
                this.health = 0;
                this.xVelocity = 0;
                this.animationData.animationSprites = [];
                this.switchCurrentSprites(0, 0)
                this.loadImages(["./images/dead.png"])
                this.reactToCollision = function() {}
                this.attack = function() {}
                this.move = false;
                this.name = "dead"
            }
                
                break;
        }
    }
    
    
    constructor(x, y, width, height, move, detectionRadiusHor, detectionRadiusVer) {
        super(x, y, width, height);
        this.move = move;
        this.detectionRadiusHor = detectionRadiusHor;
        this.detectionRadiusVer = detectionRadiusVer
        this.loadImagesFromSpritesheet("./images/EnemySprites.png", 9, 2);
    }
}

export {Enemy}