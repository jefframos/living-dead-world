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
        this.baseScale = 0.35
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
        return num;
    }
    setData(data) {
        this.playerContainer = new PIXI.Sprite();
        this.view = this.gameObject.gameView.view;
        this.view.texture = PIXI.Texture.EMPTY;
        this.spriteLayersData = {};

        this.baseData = {
            chest: Math.ceil(Math.random() * 21),
            head: 1,//Math.ceil(Math.random() * 4),
            topHead: Math.ceil(Math.random() * 17),
            face:Math.ceil(Math.random() * 19),
            hat: Math.random() > 0.4 ? Math.floor(Math.random() * 15) : 0,//Math.ceil(Math.random() * 4),
            leg: 1,//Math.ceil(Math.random() * 19)
            sleeves: 2,//Math.ceil(Math.random() * 19)
            arms: 1,//Math.ceil(Math.random() * 19)
            shoe: 0,//Math.ceil(Math.random() * 19)
            frontFace: 0,//Math.ceil(Math.random() * 19)
            backHead: 0,//Math.ceil(Math.random() * 19)
            topClothColor: 0xFFFFFF,
            botomColor: 0xFFFFFF,
            shoeColor: 0x007272,
        }
        this.bodyData = [
            { area: "backArm", src: "back-arm" + this.baseData.arms + "00", color: PlayerGameViewSpriteSheet.Colors.WhiteSkin, enabled: this.baseData.arms > 0, animate: true },
            { area: "backLeg", src: "back-leg" + this.baseData.leg + "-00", color: this.baseData.botomColor, enabled: this.baseData.leg > 0, animate: true },
            { area: "backShoes", src: "back-shoe" + this.baseData.shoe + "00", color: this.baseData.shoeColor, enabled: this.baseData.shoe > 0 , animate: true},
            { area: "frontLeg", src: "front-leg" + this.baseData.leg + "-00", color: this.baseData.botomColor, enabled: this.baseData.leg > 0, animate: true },
            { area: "frontShoes", src: "front-shoe" + this.baseData.shoe + "00", color: this.baseData.shoeColor, enabled: this.baseData.shoe > 0, animate: true },
            { area: "chest", src: "chest-00" + this.format(this.baseData.chest), color: this.baseData.topClothColor, enabled: this.baseData.chest > 0 },
            { area: "backHead", src: "back-head-00" + this.format(this.baseData.head), color: PlayerGameViewSpriteSheet.Colors.WhiteSkin, enabled: this.baseData.backHead > 0 },
            { area: "head", src: "head-00" + this.format(this.baseData.head), color: PlayerGameViewSpriteSheet.Colors.WhiteSkin, enabled: this.baseData.head > 0 },
            { area: "face", src: "face-00"+ this.format(this.baseData.face), color: 0xFFFFFF, enabled: this.baseData.face > 0 },
            { area: "frontArm", src: "front-arm" + this.baseData.arms + "00", color: PlayerGameViewSpriteSheet.Colors.WhiteSkin, enabled: this.baseData.arms > 0, animate: true },
            { area: "sleeve", src: "sleeves" + this.baseData.sleeves + "00", color: this.baseData.topClothColor, enabled: this.baseData.sleeves > 0, animate: true },
            { area: "topHead", src: "top-head-00" + this.format(this.baseData.topHead), color: 0xFFFFFF, enabled: this.baseData.topHead > 0  && this.baseData.hat == 0},
            { area: "frontFace", src: "front-face-00" + this.format(this.baseData.frontFace), color: 0xFFFFFF, enabled: this.baseData.frontFace > 0 },
            { area: "hat", src: "hat-00" + this.format(this.baseData.hat), color: 0xFFFFFF, enabled: this.baseData.hat > 0 },
        ]

        this.bodyData.forEach(element => {


            let sprite = element.enabled ? PIXI.Sprite.from(element.src + (element.animate?"01":"")) : new PIXI.Sprite();
            sprite.tint = element.color;
            this.spriteLayersData[element.area] = {
                sprite,
                enabled: element.enabled,
                animate: element.animate
            }

            this.playerContainer.addChild(sprite);

            if (data.anchor) {
                sprite.anchor.set(data.anchor.x, data.anchor.y)
            } else {
                sprite.anchor.set(0.45, 0.9)
            }

        });
        this.view.addChild(this.playerContainer)
        this.staticTexture = renderer.renderer.generateTexture(this.playerContainer);
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

        this.view.scale.set(this.direction * this.baseScale * (Math.sin(this.offsetSin) * 0.05 + 0.95), (Math.cos(this.offsetSin) * 0.03 + 0.97) * this.baseScale);

        this.bodyData.forEach(element => {
            if (this.spriteLayersData[element.area].enabled && this.spriteLayersData[element.area].animate) {
                this.spriteLayersData[element.area].sprite.texture = PIXI.Texture.from(element.src + "0" + (this.currentFrame + 1))
            }
        });

    }
}