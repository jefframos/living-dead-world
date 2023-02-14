import BaseComponent from '../core/gameObject/BaseComponent';
import Eugine from '../core/Eugine';
import Particle from './particleSystem/Particle';
import Pool from '../core/utils/Pool';

export default class SpriteSheetGameView extends BaseComponent {
    constructor() {
        super();
        this.descriptor = null;
        this.particle = null;

        this.colorOverride = 0xFFFFFF;
    }
    enable() {
        super.enable();

    }
    setDescriptor(particleDescriptor, param) {
        for (const key in param) {
            if (Object.hasOwnProperty.call(param, key) && this.gameObject.gameView.view[key] !== undefined) {
                this.gameObject.gameView.view[key] = param[key];
            }
        }
        if (param.viewOffset) {
            this.gameObject.gameView.viewOffset = param.viewOffset;
        }

        this.descriptor = particleDescriptor;

        this.particle = Pool.instance.getElement(Particle);
        this.particle.build(particleDescriptor)
        if (param.color) {
            this.gameObject.gameView.view.tint = param.color;
            this.colorOverride = param.color;
        }else{
            this.colorOverride = 0xFFFFFF;
        }
    }
    update(delta) {
        delta *= Eugine.PhysicsTimeScale;

        if (this.particle) {
            this.particle.update(delta);
            this.gameObject.gameView.view.texture = this.particle.sprite.texture
        }
    }
}