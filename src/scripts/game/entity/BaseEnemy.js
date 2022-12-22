import GameAgent from "../modules/GameAgent";
import Layer from "../core/Layer";

export default class BaseEnemy extends GameAgent {
    constructor() {
        super();
        //this.setDebug(15)
        this.view = new PIXI.Sprite.from('tile_0121')

    }
    build(radius = 15) {
        super.build();
        //this.view.scale.set(0.2)
        this.buildCircle(0, 0, 15);


        this.body.isSensor = false;
        this.layerCategory = Layer.Enemy
        this.layerMask = Layer.EnemyCollision

        this.view.anchor.set(0.5,1)
        this.view.scale.set(2,3)

        this.speedAdjust = 0
    }
    die() {
        this.body.isSensor = true;
        this.destroy()
    }
    update(delta) {

        if (!this.dying) {
            this.timer += delta * (this.speed * delta * Math.random())

            let dir = this.timer
            this.physics.velocity.x = Math.cos(dir) * this.speed * this.speedAdjust * delta
            this.physics.velocity.y = Math.sin(dir) * this.speed * this.speedAdjust * delta
            //this.speedAdjust = Math.sin(this.view.currentFrame / 9 * Math.PI) + 0.1

            // if (this.physics.magnitude > 0) {
            //     this.view.play('Walk')
            // } else {

            //     this.view.play('Idle')
            // }
        } else {
            this.physics.velocity.x = 0
            this.physics.velocity.y = 0
        }

        super.update(delta)
    }
}