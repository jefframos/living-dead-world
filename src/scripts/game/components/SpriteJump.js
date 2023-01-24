import BaseComponent from '../core/gameObject/BaseComponent';
import Eugine from '../core/Eugine';
import signals from 'signals';

export default class SpriteJump extends BaseComponent {
    constructor() {
        super();

        this.acc = 0
        this.offsetSin = Math.random() * Math.PI * 2;
        this.rnd = Math.random();
        this.jumpHight = 20
    }
    enable() {
        super.enable();
        this.offsetSin = Math.random() * Math.PI * 2;
    }
    update(delta) {        
        delta *= Eugine.PhysicsTimeScale;
        if (this.gameObject.gameView.view) {
            if (this.gameObject.physics.magnitude > 0) {
                this.offsetSin += delta * 8;
                this.offsetSin %= Math.PI
            } else {
                this.offsetSin = utils.lerp(this.offsetSin, 0, 0.5)
            }
            this.gameObject.transform.position.y = Math.sin(this.offsetSin) * 0.5 * -this.jumpHight
        }
    }
}