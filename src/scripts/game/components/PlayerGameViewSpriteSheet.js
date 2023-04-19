import BaseComponent from '../core/gameObject/BaseComponent';
import PlayerViewStructure from '../entity/PlayerViewStructure';
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
        this.sinSpeed = 1
        this.direction = 1
        this.baseScale = 0.375
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
        this.spriteData = data;
        this.playerContainer = new PIXI.Sprite();
        this.spriteLayersData = {};
        if (this.gameObject) {

            this.view = this.gameObject.gameView.view;
            this.view.texture = PIXI.Texture.EMPTY;
            this.buildSpritesheet();
        }
    }
    buildSpritesheet(baseData) {


        //sushi
        // this.baseData = {
        //     chest: 17,
        //     head: 1,//Math.ceil(Math.random() * 4),
        //     topHead: 4,
        //     face:20,
        //     hat: 0,//Math.random() > 0.94 ? Math.floor(Math.random() * 21) : 0,//Math.ceil(Math.random() * 4),
        //     leg: 1,//Math.ceil(Math.random() * 19)
        //     sleeves: 2,//Math.ceil(Math.random() * 19)
        //     arms: 1,//Math.ceil(Math.random() * 19)
        //     shoe: 0,//Math.ceil(Math.random() * 19)
        //     frontFace:8,
        //     backHead: 0,//Math.ceil(Math.random() * 19)
        //     hairColor: 0x333333,
        //     topClothColor: 0xFFFFFF,
        //     sleevesColor: 0x555555,
        //     botomColor: 0x333333,
        //     shoeColor: 0x007272,
        // }
        if (baseData) {
            this.baseData = baseData
        } else {
            this.baseData = new PlayerViewStructure();

            this.baseData.chest = Math.ceil(Math.random() * 2)
            this.baseData.head = Math.ceil(Math.random() * 3)//Math.ceil(Math.random() * 4)
            this.baseData.topHead = Math.floor(Math.random() * 29)
            this.baseData.face = Math.ceil(Math.random() * 20)
            this.baseData.hat = Math.random() > 0.6 ? Math.floor(Math.random() * 22) : 0
            this.baseData.leg = 1//Math.ceil(Math.random() * 19
            this.baseData.sleeves = 2//Math.ceil(Math.random() * 19
            this.baseData.arms = 1//Math.ceil(Math.random() * 19
            this.baseData.shoe = 1//Math.ceil(Math.random() * 19
            this.baseData.frontFace = Math.floor(Math.random() * 9)
            this.baseData.backHead = 0//Math.ceil(Math.random() * 19
            this.baseData.skinColor = PlayerViewStructure.Colors.WhiteSkin
            this.baseData.hairColor = 0xFFFFFF
            this.baseData.faceHairColor = 0xFFFFFF
            this.baseData.topClothColor = 0xFFFFFF
            this.baseData.sleevesColor = 0xFFFFFF
            this.baseData.botomColor = 0x333333
            this.baseData.shoeColor = 0x007272

        }

        this.baseData.onStructureUpdate.add(this.structureUpdate.bind(this))
        this.baseData.onColorUpdate.add(this.colorUpdate.bind(this))

        this.bodyData = [
            { area: "backArm", src: "back-arm{frame}00", frame: this.baseData.arms, colorId: 'skinColor', color: this.baseData.skinColor, enabled: this.baseData.arms > 0, animate: true },
            { area: "backLeg", src: "back-leg{frame}-00", frame: this.baseData.leg, colorId: 'botomColor', color: this.baseData.botomColor, enabled: this.baseData.leg > 0, animate: true },
            { area: "backShoes", src: "back-shoe{frame}00", frame: this.baseData.shoe, colorId: 'shoeColor', color: this.baseData.shoeColor, enabled: this.baseData.shoe > 0, animate: true },
            { area: "frontLeg", src: "front-leg{frame}-00", frame: this.baseData.leg, colorId: 'botomColor', color: this.baseData.botomColor, enabled: this.baseData.leg > 0, animate: true },
            { area: "frontShoes", src: "front-shoe{frame}00", frame: this.baseData.shoe, colorId: 'shoeColor', color: this.baseData.shoeColor, enabled: this.baseData.shoe > 0, animate: true },

            { area: "chest", src: "chest-00{frame}", frame: this.format(this.baseData.chest), colorId: 'topClothColor', color: this.baseData.topClothColor, enabled: this.baseData.chest > 0 },
            { area: "backHead", src: "back-head-00{frame}", frame: this.format(this.baseData.topHead), colorId: 'hairColor', color: this.baseData.hairColor, enabled: this.baseData.topHead > 0 && this.baseData.hat == 0 },
            { area: "head", src: "head-00{frame}", frame: this.format(this.baseData.head), colorId: 'skinColor', color: this.baseData.skinColor, enabled: this.baseData.head > 0 },
            { area: "face", src: "face-00{frame}", frame: this.format(this.baseData.face), color: 0xFFFFFF, enabled: this.baseData.face > 0 },

            { area: "frontArm", src: "front-arm{frame}00", frame: this.baseData.arms, colorId: 'skinColor', color: this.baseData.skinColor, enabled: this.baseData.arms > 0, animate: true },
            { area: "sleeve", src: "sleeves{frame}00", frame: this.baseData.sleeves, colorId: 'sleevesColor', color: this.baseData.sleevesColor, enabled: this.baseData.sleeves > 0, animate: true },

            { area: "topHead", src: "top-head-00{frame}", frame: this.format(this.baseData.topHead), colorId: 'hairColor', color: this.baseData.hairColor, enabled: this.baseData.topHead > 0 && this.baseData.hat == 0 },
            { area: "frontFace", src: "front-face-00{frame}", frame: this.format(this.baseData.frontFace), colorId: 'faceHairColor', color: this.baseData.faceHairColor, enabled: this.baseData.frontFace > 0 },
            { area: "hat", src: "hat-00{frame}", frame: this.format(this.baseData.hat), color: 0xFFFFFF, enabled: this.baseData.hat > 0 },
        ]

        this.bodyData.forEach(element => {
            const src = element.src.replace('{frame}', element.frame)
            let sprite = element.enabled ? PIXI.Sprite.from(src + (element.animate ? "01" : "")) : new PIXI.Sprite();
            sprite.tint = element.color;
            this.spriteLayersData[element.area] = {
                sprite,
                enabled: element.enabled,
                animate: element.animate
            }

            this.playerContainer.addChild(sprite);

            if (this.spriteData.anchor) {
                sprite.anchor.set(this.spriteData.anchor.x, this.spriteData.anchor.y)
            } else {
                sprite.anchor.set(0.45, `0.9`)
            }

        });
        this.view.addChild(this.playerContainer)
        this.staticTexture = renderer.renderer.generateTexture(this.playerContainer);
    }
    colorUpdate(region, value) {

        let ids = [];
        for (var i = 0; i < this.bodyData.length; i++) {
            if (this.bodyData[i].colorId == region) {
                ids.push(i);
            }
        }
        if (ids.length < 0) {
            return
        }
        ids.forEach(element => {
            this.bodyData[element].color = value;
        });

    }
    structureUpdate(region, value) {

        let id = -1;
        for (var i = 0; i < this.bodyData.length; i++) {
            if (this.bodyData[i].area == region) {
                id = i;
                break
            }
        }

        if (id < 0) {
            return
        }

        this.bodyData[id].enabled = value > 0;
        this.bodyData[id].frame = this.format(value);
        this.spriteLayersData[region].enabled = this.bodyData[id].enabled;

        if (this.spriteLayersData[region].enabled && !this.spriteLayersData[region].animate) {
            const src = this.bodyData[id].src.replace('{frame}', this.bodyData[id].frame);
            this.spriteLayersData[region].sprite.texture = PIXI.Texture.from(src)
        }

    }
    update(delta) {


        if (this.gameObject) {

            if (this.gameObject.gameView.view) {
                if (this.gameObject.physics.magnitude > 0) {
                    this.offsetSin += delta * 4 * this.sinSpeed;
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
        }

        this.offsetSin += delta * 4 * this.sinSpeed;
        this.offsetSin %= Math.PI * 2

        this.sin = Math.sin(this.offsetSin + Math.PI / 4) * 0.02 + 0.98
        this.cos = Math.cos(this.offsetSin) * 0.03 + 0.97


        this.view.scale.set(this.direction * this.baseScale * this.sin, this.cos * this.baseScale);

        this.bodyData.forEach(element => {
            if (this.spriteLayersData[element.area].enabled && this.spriteLayersData[element.area].animate) {
                //console.log(element.area)
                const src = element.src.replace('{frame}', element.frame);
                this.spriteLayersData[element.area].sprite.texture = PIXI.Texture.from(src + "0" + (this.currentFrame + 1));
                this.spriteLayersData[element.area].sprite.tint = element.color;
            } else {
                this.spriteLayersData[element.area].sprite.tint = element.color;
            }
        });

    }
}