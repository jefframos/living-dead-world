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
    static AnimatingSequenceType = {
        RotationSin: 'RotationSin',
        RotationCos: 'RotationCos',
        PositionCos: 'PositionCos',
        PositionSin: 'PositionSin',
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
        this.playerContainer = new PIXI.Container();
        this.spriteLayersData = {};
        if (this.gameObject) {

            this.view = this.gameObject.gameView.view;
            this.view.texture = PIXI.Texture.EMPTY;
            this.buildSpritesheet();
        }
    }
    buildSpritesheet(baseData) {

        if (baseData) {
            this.baseData = baseData
        } else {
            this.baseData = new PlayerViewStructure();
        }

        this.baseData.onStructureUpdate.add(this.structureUpdate.bind(this))
        this.baseData.onColorUpdate.add(this.colorUpdate.bind(this))

        this.bodyData = [
            { area: "backArm", src: "front-arm00{frame}", frame: Utils.formatNumber(this.baseData.arms, 1), offset: { x: 85, y: 120 }, anchor: { x: 0.25, y: 0.6 }, colorId: 'skinColor', color: this.baseData.skinColor, enabled: this.baseData.arms > 0, animationType: PlayerGameViewSpriteSheet.AnimatingSequenceType.RotationCos, animForce:2 },
            { area: "backSleeves", src: "sleeve-00{frame}", frame: Utils.formatNumber(this.baseData.sleeves, 1), offset: { x: 85, y: 120 }, anchor: { x: 0.25, y: 0.6 }, colorId: 'sleevesColor', color: this.baseData.sleevesColor, enabled: this.baseData.sleeves > 0, animationType: PlayerGameViewSpriteSheet.AnimatingSequenceType.RotationCos, animForce:2 },

            //  { area: "sleeves", src: "sleeve-00{frame}", frame: Utils.formatNumber(this.baseData.sleeves, 1), offset:{x:90,y:120}, anchor:{x:0.25,y:0.6}, colorId: 'sleevesColor', color: this.baseData.sleevesColor, enabled: this.baseData.sleeves > 0, animationType: PlayerGameViewSpriteSheet.AnimatingSequenceType.RotationCos },
            { area: "backHead", src: "back-head-00{frame}", frame: Utils.formatNumber(this.baseData.topHead, 1), colorId: 'hairColor', color: this.baseData.hairColor, enabled: this.baseData.topHead > 0 && this.baseData.hat == 0 },
            { area: "backLeg", src: "back-leg{frame}-00", frame: this.baseData.leg, colorId: 'botomColor', color: this.baseData.botomColor, enabled: this.baseData.leg > 0, animate: true },
            { area: "backShoes", src: "back-shoe{frame}00", frame: this.baseData.shoe, colorId: 'shoeColor', color: this.baseData.shoeColor, enabled: this.baseData.shoe > 0, animate: true },
            { area: "frontLeg", src: "front-leg{frame}-00", frame: this.baseData.leg, colorId: 'botomColor', color: this.baseData.botomColor, enabled: this.baseData.leg > 0, animate: true },
            { area: "frontShoes", src: "front-shoe{frame}00", frame: this.baseData.shoe, colorId: 'shoeColor', color: this.baseData.shoeColor, enabled: this.baseData.shoe > 0, animate: true },

            { area: "chest", src: "chest-00{frame}", frame: Utils.formatNumber(this.baseData.chest, 1), colorId: 'topClothColor', color: this.baseData.topClothColor, enabled: this.baseData.chest > 0, animationType: PlayerGameViewSpriteSheet.AnimatingSequenceType.PositionCos, animForce:1  },
            { area: "head", src: "head-00{frame}", frame: Utils.formatNumber(this.baseData.head, 1), colorId: 'skinColor', color: this.baseData.skinColor, enabled: this.baseData.head > 0, animationType: PlayerGameViewSpriteSheet.AnimatingSequenceType.PositionCos, animForce:1 },
            { area: "mouth", src: "mouth-00{frame}", frame: Utils.formatNumber(this.baseData.face, 1), color: 0xFFFFFF, enabled: true , animationType: PlayerGameViewSpriteSheet.AnimatingSequenceType.PositionCos, animForce:1 },


            { area: "topHead", src: "top-head-00{frame}", frame: Utils.formatNumber(this.baseData.topHead, 1), colorId: 'hairColor', color: this.baseData.hairColor, enabled: this.baseData.topHead > 0 && this.baseData.hat == 0, animationType: PlayerGameViewSpriteSheet.AnimatingSequenceType.PositionCos, animForce:1 },
            { area: "eyes", src: "eyes-00{frame}", frame: Utils.formatNumber(this.baseData.face, 1), color: 0xFFFFFF, enabled: true , animationType: PlayerGameViewSpriteSheet.AnimatingSequenceType.PositionCos, animForce:1.2 },

            { area: "ears", src: "ear-00{frame}", frame: Utils.formatNumber(this.baseData.ears, 1), colorId: 'skinColor', color: this.baseData.skinColor, enabled: true , animationType: PlayerGameViewSpriteSheet.AnimatingSequenceType.PositionCos, animForce:1 },

            { area: "frontFace", src: "front-face-00{frame}", frame: Utils.formatNumber(this.baseData.frontFace, 1), colorId: 'faceHairColor', color: this.baseData.faceHairColor, enabled: this.baseData.frontFace > 0 },
            { area: "mask", src: "mask-00{frame}", frame: Utils.formatNumber(this.baseData.mask, 1), color: 0xFFFFFF, enabled: this.baseData.mask > 0 },

            { area: "hat", src: "hat-00{frame}", frame: Utils.formatNumber(this.baseData.hat, 1), color: 0xFFFFFF, enabled: this.baseData.hat > 0 },
            { area: "frontArm", src: "front-arm00{frame}", frame: Utils.formatNumber(this.baseData.arms, 1), offset: { x: 35, y: 120 }, anchor: { x: 0.25, y: 0.55 }, colorId: 'skinColor', color: this.baseData.skinColor, enabled: this.baseData.arms > 0, animationType: PlayerGameViewSpriteSheet.AnimatingSequenceType.RotationSin , animForce:2},
            { area: "sleeves", src: "sleeve-00{frame}", frame: Utils.formatNumber(this.baseData.sleeves, 1), offset: { x: 35, y: 120 }, anchor: { x: 0.25, y: 0.55 }, colorId: 'sleevesColor', color: this.baseData.sleevesColor, enabled: this.baseData.sleeves > 0, animationType: PlayerGameViewSpriteSheet.AnimatingSequenceType.RotationSin, animForce:2 },
        ]

        let spriteSize = { width: 0, height: 0 }
        this.bodyData.forEach(element => {
            const src = element.src.replace('{frame}', element.frame)
            let sprite = element.enabled ? PIXI.Sprite.from(src + (element.animate ? "01" : "")) : new PIXI.Sprite();
            sprite.tint = element.color;
            this.spriteLayersData[element.area] = {
                sprite,
                enabled: element.enabled,
                animate: element.animate,
                animationType: element.animationType,
                offset: element.offset,
                animForce: element.animForce
            }

            this.playerContainer.addChild(sprite);


            if (element.anchor) {

                sprite.anchor.x = element.anchor.x
                sprite.anchor.y = element.anchor.y
            }

            if (element.offset) {
                sprite.x = element.offset.x
                sprite.y = element.offset.y
            }

            if (sprite.width > 10) {
                spriteSize.width = sprite.width
                spriteSize.height = sprite.height
            }

        });

        this.view.addChild(this.playerContainer)

        if (this.spriteData.anchor) {
            this.playerContainer.pivot.set(this.spriteData.anchor.x * spriteSize.width, this.spriteData.anchor.y * spriteSize.height)
        } else {
            this.playerContainer.pivot.set(0.45 * spriteSize.width, 0.9 * spriteSize.height)
        }


        this.staticTexture = renderer.renderer.generateTexture(this.playerContainer);
    }
    colorUpdate(region, value) {


        console.log(region, value)
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
        this.bodyData[id].frame = Utils.formatNumber(value, 1);
        this.spriteLayersData[region].enabled = this.bodyData[id].enabled;

        if (!this.spriteLayersData[region].enabled) {
            this.spriteLayersData[region].sprite.texture = PIXI.Texture.EMPTY;
        }
        else if (this.spriteLayersData[region].enabled && !this.spriteLayersData[region].animate) {
            const src = this.bodyData[id].src.replace('{frame}', this.bodyData[id].frame);
            this.spriteLayersData[region].sprite.texture = PIXI.Texture.from(src)
        }

    }
    update(delta) {

        if (this.gameObject) {
            if (this.gameObject.gameView.view) {
                if (this.gameObject.physics.magnitude > 0) {
                   // this.offsetSin += delta * 4 * this.sinSpeed;
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

                } else {

                    this.currentFrame = 0
                    this.currentTime = this.time
                }
            }
        }

        this.offsetSin += delta * 4 * this.sinSpeed;
        this.offsetSin %= Math.PI * 2

        this.sin = Math.sin(this.offsetSin + Math.PI / 4)
        this.cos = Math.cos(this.offsetSin)


        this.view.scale.set(this.direction * this.baseScale * (this.sin * 0.002 + 0.98), this.cos * 0.003 + 0.97 * this.baseScale);

        const normal = (this.currentFrame + 1) / this.maxFrame;


        this.bodyData.forEach(element => {
            const spriteElement = this.spriteLayersData[element.area];
            if (spriteElement.enabled) {
                if (spriteElement.animationType == PlayerGameViewSpriteSheet.AnimatingSequenceType.RotationCos) {
                    const targetAngle = Math.cos(normal * Math.PI * 2 + Math.PI) * 0.5;
                    
                    spriteElement.sprite.rotation =  Utils.angleLerp(spriteElement.sprite.rotation, targetAngle, 0.5 )

                    if (spriteElement.offset) {
                        spriteElement.sprite.y = spriteElement.offset.y + this.cos * spriteElement.animForce
                    }
                } else if (spriteElement.animationType == PlayerGameViewSpriteSheet.AnimatingSequenceType.RotationSin) {

                    const targetAngle = Math.sin(normal * Math.PI * 2 + Math.PI) * 0.5 - 0.5;

                    spriteElement.sprite.rotation =  Utils.angleLerp(spriteElement.sprite.rotation, targetAngle, 0.5 )


                    if (spriteElement.offset) {
                        spriteElement.sprite.y = spriteElement.offset.y + (this.sin) * spriteElement.animForce
                    }
                } else if (spriteElement.animationType == PlayerGameViewSpriteSheet.AnimatingSequenceType.PositionCos) {
                    if (spriteElement.offset) {
                        spriteElement.sprite.y = spriteElement.offset.y + (this.cos) * spriteElement.animForce
                    } else {
                        spriteElement.sprite.y = (this.cos) * spriteElement.animForce
                    }
                } else if (spriteElement.animationType == PlayerGameViewSpriteSheet.AnimatingSequenceType.PositionSin) {
                    if (spriteElement.offset) {
                        spriteElement.sprite.y = spriteElement.offset.y + (this.sin) * spriteElement.animForce
                    } else {
                        spriteElement.sprite.y = (this.sin) * spriteElement.animForce
                    }
                }
            }
            if (spriteElement.enabled && spriteElement.animate) {
                const src = element.src.replace('{frame}', element.frame);
                spriteElement.sprite.texture = PIXI.Texture.from(src + "0" + (this.currentFrame + 1));
                spriteElement.sprite.tint = element.color;
            } else {
                spriteElement.sprite.tint = element.color;
            }
        });

    }
}