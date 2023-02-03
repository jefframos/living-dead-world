import AlphaBehaviour from "../components/particleSystem/particleBehaviour/AlphaBehaviour";
import ColorBehaviour from "../components/particleSystem/particleBehaviour/ColorBehaviour";
import GameObject from "../core/gameObject/GameObject";
import GameStaticData from "../data/GameStaticData";
import ParticleDescriptor from "../components/particleSystem/ParticleDescriptor";
import ParticleEmitter from "../components/particleSystem/ParticleEmitter";
import RenderModule from "../core/modules/RenderModule";
import SinoidBehaviour from "../components/particleSystem/particleBehaviour/SinoidBehaviour";
import SpriteSheetBehaviour from "../components/particleSystem/particleBehaviour/SpriteSheetBehaviour";

export default class EffectsManager extends GameObject {
    static instance;
    static TargetLayer = {
        GameplayLayer: 'GameplayLayer',
        BaseLayer: 'BaseLayer'
    }
    static ParticleBehaviours = {
        Alpha: AlphaBehaviour,
        Color: ColorBehaviour,
        Sinoid: SinoidBehaviour,
        SpriteSheet: SpriteSheetBehaviour
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
            fontFamily: 'retro',
            align: "center",
            dropShadow: true,
            dropShadowAngle: 1.5,
            fontSize: 14,
            dropShadowDistance: 2,
            fill: "#ffffff",
            //fill: "#febc15",
            fontWeight: 800,
            letterSpacing: 2,
            strokeThickness: 3,
        });



        this.particleDescriptors = {};
        this.makeDescriptors();

        console.log('>>>', this.particleDescriptors)

        // this.smokeTrail = new ParticleDescriptor({ lifeSpan: 999, scale: 1 })
        // this.smokeTrail.addBaseBehaviours(SpriteSheetBehaviour, GameStaticData.instance.getSharedDataById('vfx', 'SMOKE_01'))

        // this.bloodSplat = new ParticleDescriptor({ lifeSpan: 999, scale: 1 })
        // this.bloodSplat.addBaseBehaviours(SpriteSheetBehaviour, GameStaticData.instance.getSharedDataById('vfx', 'BLOD_SPLAT_01'))




        this.bloodDescriptor.addBaseBehaviours(AlphaBehaviour, { time: [1, 2] })
        this.bloodDescriptor.addBaseBehaviours(ColorBehaviour, { time: [1, 3], startValue: 0xff0000, endValue: 0x9f182f })


        this.labels = [];
        this.news = 0
        this.damageFontPool = [];
    }
    makeDescriptors() {
        let descriptors = GameStaticData.instance.getAllDataFrom('vfx', 'particleDescriptors')


        descriptors.forEach(data => {

            this.particleDescriptors[data.id] = new ParticleDescriptor(data)
            console.log(data)

            if (data.baseBehaviours) {

                if (Array.isArray(data.baseBehaviours)) {

                    data.baseBehaviours.forEach(behaviour => {
                        console.log(behaviour)
                        let behaviourConstructor = EffectsManager.ParticleBehaviours[behaviour.behaviourId];
                        if (behaviourConstructor.name == SpriteSheetBehaviour.name) {
                            this.particleDescriptors[data.id].addBaseBehaviours(behaviourConstructor, GameStaticData.instance.getSharedDataById('vfx', behaviour.vfxId));
                        } else {

                            this.particleDescriptors[data.id].addBaseBehaviours(behaviourConstructor, behaviour)
                        }
                    });
                } else {
                    EffectsManager.ParticleBehaviours[data.baseBehaviours];
                    let behaviour = GameStaticData.instance.getDataById('vfx', 'behaviours', data.baseBehaviours)
                    let behaviourConstructor = EffectsManager.ParticleBehaviours[behaviour.behaviourId]

                    if (behaviourConstructor.name == SpriteSheetBehaviour.name) {
                        this.particleDescriptors[data.id].addBaseBehaviours(behaviourConstructor, GameStaticData.instance.getSharedDataById('vfx', behaviour.vfxId));
                    } else {

                        this.particleDescriptors[data.id].addBaseBehaviours(behaviourConstructor, behaviour)
                    }

                }

            }
        });

        console.log(this.particleDescriptors['BLOOD_SPLAT'])
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
        //this.particleEmitter.emit(this.skullDescriptor, { minX: entity.gameView.x, maxX: entity.gameView.x, minY: entity.gameView.y, maxY: entity.gameView.y }, 1);
        //this.particleEmitterKill.emit(this.bloodPuddle, { minX: entity.gameView.x, maxX: entity.gameView.x, minY: entity.gameView.y, maxY: entity.gameView.y }, 1);
        return

    }
    popDamage(entity, value) {
        // console.log(entity.engineID)
        let ang = Math.random() * Math.PI * 2;
        let dist = Math.random() * 30;
        let text = this.getDamageFont()
        text.alpha = 1
        text.text = value
        text.x = entity.gameView.x + Math.cos(ang) * dist
        text.y = entity.gameView.y + Math.sin(ang) * dist
        text.timer = 1
        text.anchor.set(0.5)
        this.labels.push(text)
        this.effectsContainer.addChild(text)

        //this.particleEmitter.emit(this.particleDescriptors['BLOOD_SPLAT'], [entity.gameView.x, entity.gameView.y], 1);
        //this.particleEmitter.emit(this.particleDescriptors['BLOOD_SPLAT'], [entity.gameView.x, entity.gameView.y]);

        //this.particleEmitter.emit(this.bloodSplat, { minX: entity.gameView.x, maxX: entity.gameView.x, minY: entity.gameView.y, maxY: entity.gameView.y }, 1);

    }

    testParticles(entity, value) {
        this.particleEmitter.emit(this.particleDescriptors['FREE_BLOOD_SPLAT'], [entity.gameView.x, entity.gameView.y]);
        //this.particleEmitter.emit(this.bloodSplat, { minX: entity.gameView.x, maxX: entity.gameView.x, minY: entity.gameView.y, maxY: entity.gameView.y }, 1);
    }

    emitParticles(position, descriptor, quant = 1, overrides, target = EffectsManager.TargetLayer.GameplayLayer) {

        if (target == EffectsManager.TargetLayer.GameplayLayer) {
            this.particleEmitter.emit(descriptor, { minX: position.x, maxX: position.x, minY: position.y, maxY: position.y }, 1, overrides);
        } else {
            this.particleEmitterBottom.emit(descriptor, { minX: position.x, maxX: position.x, minY: position.y, maxY: position.y }, 1, overrides);
        }
    }

    emitById(position, descriptor, quant = 1, overrides, target = EffectsManager.TargetLayer.GameplayLayer) {
        if (target == EffectsManager.TargetLayer.GameplayLayer) {
            this.particleEmitter.emit(this.particleDescriptors[descriptor], { minX: position.x, maxX: position.x, minY: position.y, maxY: position.y }, 1, overrides);
        } else {
            this.particleEmitterBottom.emit(this.particleDescriptors[descriptor], { minX: position.x, maxX: position.x, minY: position.y, maxY: position.y }, 1, overrides);
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