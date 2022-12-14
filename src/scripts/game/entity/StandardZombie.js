import GameAgent from "../modules/GameAgent";
import Layer from "../core/Layer";

export default class StandardZombie extends GameAgent {
    constructor() {
        super(15);


        this.characterAnimationID = 'Zombie1';

        let animations = [
            {
                id: 'Walk',
                name: 'zombieWalk',
                frames: 10,
                speed: 0.2
            },
            {
                id: 'Idle',
                name: 'zombieIdle',
                frames: 5,
                speed: 0.2
            },
        ]

        this.injectAnimations(animations);

        this.layerCategory = Layer.Enemy
        this.layerMask = Layer.Environment | Layer.Player | Layer.Bullet
    }
    update(delta) {
        this.timer += delta * (this.speed)

        this.physics.velocity.x = Math.cos(this.timer) * this.speed * this.speedAdjust
        this.physics.velocity.y = Math.sin(this.timer) * this.speed * this.speedAdjust
        this.speedAdjust = Math.sin(this.view.currentFrame / 9 * Math.PI) + 0.1

        if (this.physics.magnitude > 0) {
            this.view.play('Walk')
        } else {

            this.view.play('Idle')
        }

        super.update(delta)
    }
}