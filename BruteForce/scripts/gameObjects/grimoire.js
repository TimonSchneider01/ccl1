import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../modules/global.js";
import { playerWin } from "../modules/main.js";

class Grimoire extends BaseGameObject {
    name = "Grim";
    xVelocity = 0;
    yVelocity = 0;
    useGravityForces = false;
    blockGravityForces = true;
    health = 100;
    pickUp = true;


    physicsData = {
        "fallVelocity": 0,
        "terminalVelocity": 53,
        "jumpForce": 0,
        "jumpForceDecay": 0,
    }

    animationData = {
        "animationSprites": [],
        "timePerSprite": 0.08,
        "currentSpriteElapsedTime": 0,
        "firstSpriteIndex": 0,
        "lastSpriteIndex": 8,
        "currentSpriteIndex": 0,
    };


    reactToCollision = function(collidingObject) {
        switch (collidingObject.name) {
            case "Skeleton":
                // this.active = false
                playerWin();
                // console.log("X")
                break;
            case "Projectile":  
            }
        }

    applyGravity = function () {}

        // turn draw function off in order to use this.loadImages()!!
        draw = function () {
            let spriteToDraw = this.getNextSprite();
            global.ctx.drawImage(spriteToDraw, this.x, this.y, this.width, this.height);
        }

        getNextSprite = function () {
            // console.log("this function works")
            this.animationData.currentSpriteElapsedTime += global.deltaTime;
    
            if (this.animationData.currentSpriteElapsedTime >= this.animationData.timePerSprite) {
                this.animationData.currentSpriteIndex += 1;
                this.animationData.currentSpriteElapsedTime = 0;
                if (this.animationData.currentSpriteIndex > this.animationData.lastSpriteIndex) {
                    this.animationData.currentSpriteIndex = this.animationData.firstSpriteIndex
                }
            }
            return this.animationData.animationSprites[this.animationData.currentSpriteIndex];
        };

    loadImages = function () {
        /* first: load images from path */
        let image1 = new Image();
        let image2 = new Image();
        let image3 = new Image();
        let image4 = new Image();
        let image5 = new Image();
        let image6 = new Image();
        let image7 = new Image();
        let image8 = new Image();
        let image9 = new Image();
        let image10 = new Image();
        image1.src = "./images/Grimoire/grimoire1.png";
        image2.src = "./images/Grimoire/grimoire2.png";
        image3.src = "./images/Grimoire/grimoire3.png";
        image4.src = "./images/Grimoire/grimoire4.png";
        image5.src = "./images/Grimoire/grimoire5.png";
        image6.src = "./images/Grimoire/grimoire6.png";
        image7.src = "./images/Grimoire/grimoire7.png";
        image8.src = "./images/Grimoire/grimoire8.png";
        image9.src = "./images/Grimoire/grimoire9.png";
        /* after images have been loaded, they are added to animationData.animationSprites */
        this.animationData.animationSprites.push(image1, image2, image3, image4, image5, image6, image7, image8, image9);
        // console.log(this.animationData.animationSprites)
    }

    getBoxBounds = function () {
        let bounds = {
            left: this.x +30,
            right: this.x + this.width -30,
            top: this.y,
            bottom: this.y + this.height
        }
        return bounds;
    };



    // update = function () { 

    // };

    

    constructor(x, y, width, height) {
        super(x, y, width, height);   
        // this.image = new Image();
        // this.image.src = "./images/Healer/Healer1.png";
        this.loadImages();
    }
}

export {Grimoire}