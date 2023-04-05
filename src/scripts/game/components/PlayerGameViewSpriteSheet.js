import BaseComponent from '../core/gameObject/BaseComponent';
import Pool from '../core/utils/Pool';
import Shaders from '../shader/Shaders';
import SpriteSheetAnimation from './utils/SpriteSheetAnimation';
import SpriteSheetBehaviour from './particleSystem/particleBehaviour/SpriteSheetBehaviour';
import Utils from '../core/utils/Utils';
import signals from 'signals';

export default class PlayerGameViewSpriteSheet extends BaseComponent {
    static AnimationType = {
        Idle: 'idle',
        Running: 'running'
    }
    static Colors = {
        WhiteSkin: 0xFBEDD6,
        Jeans: 0x4260A5
    }
    constructor() {
        super();
    }
    enable() {
        super.enable()
        this.frame = 0;
        this.maxFrame = 8;
        this.currentFrame = 0;
        this.time = 0.08;
        this.currentTime = 0;
        this.offsetSin = 0;
        this.sinSpeed = 3
        this.direction = 1
        this.baseScale = 0.5
    }
    destroy() {
        super.destroy();

        while (this.view.children.length) {
            this.view.removeChildAt(0)
        }
    }
    format(num) {
        if (num < 10) {
            return '0' + num
        }
    }
    setData(data) {
        this.view = this.gameObject.gameView.view;
        this.view.texture = PIXI.Texture.EMPTY;
        this.spriteLayersData = {};

        this.baseData = {
            chest: Math.ceil(Math.random() * 21),
            head: Math.ceil(Math.random() * 4),
            topHead: Math.ceil(Math.random() * 17),
            face: Math.ceil(Math.random() * 19),
            leg: 1,//Math.ceil(Math.random() * 19)
            sleeves: 1,//Math.ceil(Math.random() * 19)
            arms: 1,//Math.ceil(Math.random() * 19)
            shoe: 0,//Math.ceil(Math.random() * 19)
            frontFace: 0,//Math.ceil(Math.random() * 19)
            backHead: 0,//Math.ceil(Math.random() * 19)
            topClothColor: 0xFFFFFF,
            botomColor: 0xFFFFFF,
            shoeColor: 0x007272,
        }
        this.bodyData = [
            { area: "backArm", src: "back-arm" + this.baseData.arms + "00", color: PlayerGameViewSpriteSheet.Colors.WhiteSkin , enabled:this.baseData.arms > 0},
            { area: "backLeg", src: "back-leg" + this.baseData.leg + "00", color: this.baseData.botomColor , enabled:this.baseData.leg > 0},
            { area: "backShoes", src: "back-shoe" + this.baseData.shoe + "00", color: this.baseData.shoeColor , enabled:this.baseData.shoe > 0},
            { area: "frontLeg", src: "front-leg" + this.baseData.leg + "00", color: this.baseData.botomColor , enabled:this.baseData.leg > 0},
            { area: "frontShoes", src: "front-shoe" + this.baseData.shoe + "00", color: this.baseData.shoeColor , enabled:this.baseData.shoe > 0},
            { area: "chest", src: "chest" + this.baseData.chest + "00", color: this.baseData.topClothColor , enabled:this.baseData.chest > 0},
            { area: "backHead", src: "back-head" + this.baseData.head + "00", color: PlayerGameViewSpriteSheet.Colors.WhiteSkin , enabled:this.baseData.backHead > 0},
            { area: "head", src: "head" + this.baseData.head + "00", color: PlayerGameViewSpriteSheet.Colors.WhiteSkin , enabled:this.baseData.head > 0},
            { area: "face", src: "face" + this.baseData.face + "00", color: 0xFFFFFF , enabled:this.baseData.face > 0},
            { area: "frontArm", src: "front-arm" + this.baseData.arms + "00", color: PlayerGameViewSpriteSheet.Colors.WhiteSkin , enabled:this.baseData.arms > 0},
            { area: "sleeve", src: "sleeves" + this.baseData.sleeves + "00", color: this.baseData.topClothColor , enabled:this.baseData.sleeves > 0},
            { area: "topHead", src: "top-head" + this.baseData.topHead + "00", color: 0xFFFFFF , enabled:this.baseData.topHead > 0},
            { area: "frontFace", src: "front-face" + this.baseData.topHead + "00", color: 0xFFFFFF , enabled:this.baseData.frontFace > 0},
        ]

        this.bodyData.forEach(element => {


                let sprite = element.enabled ? PIXI.Sprite.from(element.src + "01") : new PIXI.Sprite();
                sprite.tint = element.color;
                this.spriteLayersData[element.area] = {
                    sprite,
                    enabled:element.enabled
                }
                
                this.view.addChild(sprite);
                
                if (data.anchor) {
                    sprite.anchor.set(data.anchor.x, data.anchor.y)
                } else {
                    sprite.anchor.set(0.45, 0.9)
                }
            
        });
    }
    update(delta) {


        if (this.gameObject.gameView.view) {
            if (this.gameObject.physics.magnitude > 0) {

                if (this.gameObject.physics.velocity.x > 0.01) {
                    this.direction = 1
                } else if (this.gameObject.physics.velocity.x < -0.01) {
                    this.direction = -1
                }

                this.currentTime += delta;
                if (this.currentTime >= this.time) {
                    this.currentTime = 0;
                    this.currentFrame++
                    this.currentFrame %= this.maxFrame;
                    this.currentFrame = Math.max(this.currentFrame, 2)
                }

                //this.offsetSin = Utils.lerp(this.offsetSin, 0, 0.5)
            } else {

                this.currentFrame = 0
                this.currentTime = this.time
            }
            
            
        }
        this.offsetSin += delta * 4 * this.sinSpeed;
        this.offsetSin %= Math.PI * 2

        this.view.scale.set(this.direction *this.baseScale * (Math.sin(this.offsetSin) * 0.05 + 0.95), (Math.cos(this.offsetSin) * 0.03 + 0.97) *this.baseScale);

        this.bodyData.forEach(element => {
            if(this.spriteLayersData[element.area].enabled){
                this.spriteLayersData[element.area].sprite.texture = PIXI.Texture.from(element.src + "0" + (this.currentFrame + 1))
            }
        });

    }
}