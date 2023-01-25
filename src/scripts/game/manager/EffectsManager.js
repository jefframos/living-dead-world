import AlphaBehaviour from "../components/particleSystem/particleBehaviour/AlphaBehaviour";
import ColorBehaviour from "../components/particleSystem/particleBehaviour/ColorBehaviour";
import GameObject from "../core/gameObject/GameObject";
import ParticleDescriptor from "../components/particleSystem/ParticleDescriptor";
import ParticleEmitter from "../components/particleSystem/ParticleEmitter";
import RenderModule from "../core/modules/RenderModule";
import SpriteSheetBehaviour from "../components/particleSystem/particleBehaviour/SpriteSheetBehaviour";

export default class EffectsManager extends GameObject {
    static instance;
    static TargetLayer = {
        Gameplay: 1,
        Botom: 2
    }
    constructor(container, gameContainer) {
        super();
        EffectsManager.instance = this;
        this.effectsContainer = container;
        this.gameContainer = gameContainer;

        this.effectsContainer.alpha = true;



        this.skullDescriptor = new ParticleDescriptor(
            {
                velocityX: [-50, 50],
                velocityY: [-50, -180],
                rotationSpeed: [-3, -5],
                gravity: 200,
                scale: 0.5,
                lifeSpan: [1, 1.5],
                tint: 0xFFFFFF,
                texture: ['skull', 'skull2', 'arm', 'leg']
            }
        )
        this.skullDescriptor.addBaseBehaviours(AlphaBehaviour, { time: 0.3, delay: 1 })

        //the descriptor is on the enemy
        this.bloodDescriptor = new ParticleDescriptor(
            {
                velocityX: [-100, 100],
                velocityY: [-50, -180],
                gravity: 200,
                scale: [0.3, 0.5],
                lifeSpan: [1, 1.5],
                tint: 0xff0000,
                texture: PIXI.Texture.from('p1')
            }
        )

        this.bloodPuddle = new ParticleDescriptor(
            {
                velocityX: 0,
                velocityY: 0,
                gravity: 0,
                scale: [0.3, 0.5],
                lifeSpan: 999,
                texture: ['bloodp1', 'bloodp2', 'bloodp3', 'bloodp4']
            }
        )
        this.bloodPuddle.addBaseBehaviours(AlphaBehaviour, { time: [0.5, 0.25], delay: 10 })

        PIXI.BitmapFont.from('damage2', {
            fontFamily: 'peppa_pigmedium',
            align: "center",
            dropShadow: true,
            dropShadowAngle: 1.5,
            fontSize: 14,
            dropShadowDistance: 2,
            fill: "#febc15",
            fontWeight: 800,
            letterSpacing: 2,
            strokeThickness: 1,
            wordWrap: true,
            wordWrapWidth: 300
        });

        this.smokeTrail = new ParticleDescriptor({ lifeSpan: 999, scale: 1 })
        this.smokeTrail.addBaseBehaviours(SpriteSheetBehaviour, {
            time: 0.5,
            startFrame: 1,
            endFrame: 7,
            spriteName: 'hit-l',
            addZero: false,
        })

        this.bloodSplat = new ParticleDescriptor({ lifeSpan: 999, scale: 1 })
        this.bloodSplat.addBaseBehaviours(SpriteSheetBehaviour, {
            time: 0.2,
            startFrame: 1,
            endFrame: 6,
            spriteName: 'blood-2-',
            addZero: false,
        })

        this.bloodDescriptor.addBaseBehaviours(AlphaBehaviour, { time: [1, 2] })
        this.bloodDescriptor.addBaseBehaviours(ColorBehaviour, { time: [1, 3], startValue: 0xff0000, endValue: 0x9f182f })


        this.labels = [];
        this.news = 0
        this.damageFontPool = [];
    }
    start() {
        this.renderModule = this.engine.findByType(RenderModule);
        this.baseLayer = this.renderModule.layers[RenderModule.RenderLayers.Floor].container;
        this.bottomLayer = this.renderModule.layers[RenderModule.RenderLayers.Default].container;

        this.particleEmitter = new ParticleEmitter(this.gameContainer);
        this.particleEmitterBottom = new ParticleEmitter(this.bottomLayer);
        this.particleEmitterKill = new ParticleEmitter(this.baseLayer, 500);
    }
    update(delta) {
        this.effectsContainer.pivot.x = this.gameContainer.pivot.x
        this.effectsContainer.pivot.y = this.gameContainer.pivot.y

        this.effectsContainer.scale.x = this.gameContainer.scale.x
        this.effectsContainer.scale.y = this.gameContainer.scale.y


        this.effectsContainer.x = this.gameContainer.x
        this.effectsContainer.y = this.gameContainer.y

        //for (let index = 0; index < this.labels.length; index++) {
        for (let index = this.labels.length - 1; index >= 0; index--) {
            this.labels[index].timer -= delta;
            this.labels[index].y -= delta * 5
            if (this.labels[index].timer < 0.5) {
                this.labels[index].alpha = this.labels[index].timer * 2;
            }
            if (this.labels[index].timer <= 0) {
                this.damageFontPool.push(this.labels[index]);
                this.labels.splice(index, 1)
            }

        }

        this.particleEmitter.update(delta)
        this.particleEmitterBottom.update(delta)
        this.particleEmitterKill.update(delta)
    }
    popKill(entity) {
        this.particleEmitter.emit(this.skullDescriptor, { minX: entity.gameView.x, maxX: entity.gameView.x, minY: entity.gameView.y, maxY: entity.gameView.y }, 1);
        return
        this.particleEmitterKill.emit(this.bloodPuddle, { minX: entity.gameView.x, maxX: entity.gameView.x, minY: entity.gameView.y, maxY: entity.gameView.y }, 1);

    }
    popDamage(entity, value) {
        // console.log(entity.engineID)
        let ang = Math.random() * Math.PI * 2;
        let dist = Math.random() * 30;
        let text = this.getDamageFont()
        text.alpha = 1
        text.text = value
        text.x = entity.gameView.x + Math.cos(ang) * dist
        text.y = entity.gameView.y+ Math.sin(ang) * dist
        text.timer = 1
        text.anchor.set(0.5)
        this.labels.push(text)
        this.effectsContainer.addChild(text)

        //this.particleEmitter.emit(this.bloodDescriptor, { minX: entity.gameView.x, maxX: entity.gameView.x, minY: entity.gameView.y, maxY: entity.gameView.y }, 3);
        //uses blod spritesheet
        this.particleEmitter.emit(this.bloodSplat, { minX: entity.gameView.x, maxX: entity.gameView.x, minY: entity.gameView.y, maxY: entity.gameView.y }, 1);

    }

    testParticles(entity, value) {
        this.particleEmitter.emit(this.bloodSplat, { minX: entity.gameView.x, maxX: entity.gameView.x, minY: entity.gameView.y, maxY: entity.gameView.y }, 1);
    }

    emitParticles(position, descriptor, quant = 1, overrides, target = EffectsManager.TargetLayer.Gameplay) {
        if (target == EffectsManager.TargetLayer.Gameplay) {
            this.particleEmitter.emit(descriptor, { minX: position.x, maxX: position.x, minY: position.y, maxY: position.y }, 1, overrides);
        } else {
            this.particleEmitterBottom.emit(descriptor, { minX: position.x, maxX: position.x, minY: position.y, maxY: position.y }, 1, overrides);
        }
    }

    emitById(position, descriptor, quant = 1, overrides, target = EffectsManager.TargetLayer.Gameplay) {
        if (target == EffectsManager.TargetLayer.Gameplay) {
            this.particleEmitter.emit(this[descriptor], { minX: position.x, maxX: position.x, minY: position.y, maxY: position.y }, 1, overrides);
        } else {
            this.particleEmitterBottom.emit(this[descriptor], { minX: position.x, maxX: position.x, minY: position.y, maxY: position.y }, 1, overrides);
        }
    }

    getDamageFont() {

        if (this.damageFontPool.length > 0) {
            let element = this.damageFontPool.pop();
            return element;
        }
        let newElement = new PIXI.BitmapText("150", { fontName: 'damage2' });
        this.news++
        return newElement;

    }
}