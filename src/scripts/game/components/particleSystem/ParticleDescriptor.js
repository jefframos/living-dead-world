import * as PIXI from 'pixi.js';

import Pool from '../../core/utils/Pool';

export default class ParticleDescriptor {
    constructor(data) {
        this.lifeSpan = 1;
        this.direction = 0;
        this.velocityX = 0;
        this.velocityY = 0;

        

        this.blendMode = PIXI.BLEND_MODES.NORMAL;

        this.velocityOffsetX = 0;
        this.velocityOffsetY = 0;

        this.gravity = 0;
        this.scale = 1;
        this.texture = PIXI.Texture.from('spark2');
        this.baseData = data;
        this.baseBehaviours = [];
        this.behaviours = [];
        this.tint = 0xFFFFFF;

        this.shouldDestroy = false;
    }
    addBaseBehaviours(behavior, params) {
        this.baseBehaviours.push({ behavior, params });
    }
    applyBaseData() {
        if (this.baseData) {
            for (const key in this.baseData) {
                if (this[key] !== undefined) {
                    if (Array.isArray(this.baseData[key])) {
                        this[key] = Math.random() * (this.baseData[key][1] - this.baseData[key][0]) + this.baseData[key][0];
                    } else {
                        this[key] = this.baseData[key];
                    }
                }
            }
        }

    }
    clone(descriptor) {
        for (const key in this) {
            this[key] = descriptor[key];
        }
        this.applyBaseData();
        this.shouldDestroy = false;

        this.behaviours = [];
        descriptor.baseBehaviours.forEach(element => {
            let behaviour = Pool.instance.getElement(element.behavior);
            behaviour.build(element.params);
            behaviour.reset();

            this.behaviours.push(behaviour);
        });

    }
    update(delta) {
        this.lifeSpan -= delta;
        if (this.lifeSpan <= 0) {
            this.shouldDestroy = true;
        }

        this.behaviours.forEach(element => {
            element.update(delta);
        });
    }


}