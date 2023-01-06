import AlphaBehaviour from "../components/particleSystem/particleBehaviour/AlphaBehaviour";
import ColorBehaviour from "../components/particleSystem/particleBehaviour/ColorBehaviour";
import GameObject from "../core/gameObject/GameObject";
import ParticleDescriptor from "../components/particleSystem/ParticleDescriptor";
import ParticleEmitter from "../components/particleSystem/ParticleEmitter";

export default class EffectsManager extends GameObject {
    static instance;
    constructor(container, gameContainer) {
        super();
        EffectsManager.instance = this;
        this.effectsContainer = container;
        this.gameContainer = gameContainer;

        this.effectsContainer.alpha = true;
        this.particleEmitter = new ParticleEmitter(this.gameContainer);


        //the descriptor is on the enemy
        this.smallFireDescriptor = new ParticleDescriptor(
            {
                velocityX: [-100, 100],
                velocityY: [-50, -180],
                gravity: 200,
                scale: [0.8, 0.5],
                lifeSpan: [1, 1.5],
                tint:0xff0000,
                texture: PIXI.Texture.from('spark2')
            }
        )

        this.smallFireDescriptor.addBaseBehaviours(AlphaBehaviour, { time: [1, 2] })
        this.smallFireDescriptor.addBaseBehaviours(ColorBehaviour, { time: [1, 3], startValue: 0xff0000, endValue: 0x9f182f })


        this.labels = [];
        this.news = 0
        this.damageFontPool = [];
    }

    update(delta) {
        this.effectsContainer.pivot.x = this.gameContainer.pivot.x
        this.effectsContainer.pivot.y = this.gameContainer.pivot.y

        this.effectsContainer.x = this.gameContainer.x
        this.effectsContainer.y = this.gameContainer.y

        //for (let index = 0; index < this.labels.length; index++) {
        for (let index = this.labels.length - 1; index >= 0; index--) {
            this.labels[index].alpha -= delta * 2;
            if (this.labels[index].alpha <= 0) {
                this.damageFontPool.push(this.labels[index]);
                this.labels.splice(index, 1)
            }

        }

        this.particleEmitter.update(delta)
    }
    popDamage(entity, value) {
        // console.log(entity.engineID)
        let text = this.getDamageFont()
        text.alpha = 1
        text.text = value
        text.x = entity.gameView.x
        text.y = entity.gameView.y
        text.anchor.set(0.5)
        this.labels.push(text)
        this.effectsContainer.addChild(text)

        this.particleEmitter.emit(this.smallFireDescriptor, { minX: entity.gameView.x, maxX: entity.gameView.x, minY: entity.gameView.y, maxY: entity.gameView.y }, 4)

        this.particleEmitter
    }

    getDamageFont() {

        if (this.damageFontPool.length > 0) {
            let element = this.damageFontPool.pop();
            return element;
        }
        let newElement = new PIXI.BitmapText("150", { fontName: 'damage1' });
        this.news++
        return newElement;

    }
}