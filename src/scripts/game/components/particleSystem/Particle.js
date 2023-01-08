import * as PIXI from 'pixi.js';

import ParticleDescriptor from './ParticleDescriptor'

export default class Particle {

    constructor() {
        this.descriptor = new ParticleDescriptor();
        this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    }

    set x(value) {
        this.sprite.x = value;
    }
    set y(value) {
        this.sprite.y = value;
    }
    get shouldDestroy() {
        return this.descriptor.shouldDestroy;

    }
    build(descriptor) {
        this.descriptor.clone(descriptor);
        this.sprite.texture = this.descriptor.texture;
        this.sprite.tint = this.descriptor.tint;
        this.sprite.anchor.set(0.5)
        this.sprite.rotation = 0;
        this.sprite.alpha = 1;
        this.sprite.scale.set(this.descriptor.scale);
        this.sprite.blendMode = this.descriptor.blendMode;
    }
    update(delta) {
        this.descriptor.update(delta);
        this.sprite.x += this.descriptor.velocityX * delta + this.descriptor.velocityOffsetX * delta;
        this.sprite.y += this.descriptor.velocityY * delta + this.descriptor.velocityOffsetY * delta;
        this.sprite.rotation += this.descriptor.rotationSpeed * delta;


        this.descriptor.velocityY += this.descriptor.gravity * delta;

        this.descriptor.behaviours.forEach(element => {
            if (element.type == 'descriptor') {
                if (this.descriptor[element.property] !== undefined) {
                    this.descriptor[element.property] = element.currentValue;
                }
            } else if (element.type == 'sprite') {
                if (this.sprite[element.property] !== undefined) {
                    this.sprite[element.property] = element.currentValue;
                }
            }
        });
    }
}