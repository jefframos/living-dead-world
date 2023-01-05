import * as PIXI from 'pixi.js';
import GameObject from '../core/GameObject';
import Particle from './Particle'

export default class ParticleEmmiter {

    constructor(container) {
        this.container = container;
        this.position = { x: 0, y: 0 }
        this.particles = [];
        this.frequency = 0.1;
        this.emitTimer = 0;
        this.maxParticles = 1500;
        this.active = true;
    }

    get x() {
        return this.position.x;
    }
    set x(value) {
        this.position.x = value;
    }
    get y() {
        return this.position.y;
    }
    set y(value) {
        this.position.y = value;
    }
    get canEmit() {
        return this.emitTimer <= 0 && this.active;
    }
    reset() {
        for (let index = this.particles.length - 1; index >= 0; index--) {
            const particle = this.particles[index];
            GameObject.Pool.returnElement(particle);
            this.container.removeChild(particle.sprite);
            this.particles.splice(index, 1);

        }
    }
    emit(particleDescriptor, position, quant) {

        for (let index = 0; index < quant; index++) {
            let particle = GameObject.Pool.getElement(Particle);
            particle.build(particleDescriptor)
            particle.x = Math.random() * (position.maxX - position.minX) + position.minX + this.x;
            particle.y = Math.random() * (position.maxY - position.minY) + position.minY + this.y;

            this.container.addChild(particle.sprite);
            this.particles.push(particle)

            this.emitTimer = this.frequency;
            if (this.particles.length > this.maxParticles) {
                let first = this.particles.shift();
                GameObject.Pool.returnElement(first);
                this.container.removeChild(first.sprite);
            }
        }

    }
    update(delta) {
        this.emitTimer -= delta;
        for (let index = this.particles.length - 1; index >= 0; index--) {
            const particle = this.particles[index];
            particle.update(delta)
            if (particle.shouldDestroy) {
                GameObject.Pool.returnElement(particle);
                this.container.removeChild(particle.sprite);
                this.particles.splice(index, 1);
            }
        }
    }
}