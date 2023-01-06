import GameAgent from "../core/entity/GameAgent";
import Layer from "../core/Layer";
import Player from "./Player";
import SpriteJump from "../components/SpriteJump";

export default class BaseEnemy extends GameAgent {
    constructor() {
        super();
        //this.setDebug(15)
        this.gameView.view = new PIXI.Sprite.from('tile_0121')

    }
    build(radius = 15) {
        super.build();
        //this.view.scale.set(0.2)
        this.buildCircle(0, 0, 15);

        this.addComponent(SpriteJump)

        this.rigidBody.isSensor = false;
        this.layerCategory = Layer.Enemy
        this.layerMask = Layer.EnemyCollision

        this.gameView.view.anchor.set(0.5,1)
        this.gameView.view.scale.set(2,3)

        this.speedAdjust = 3
    }
    destroy(){
        super.destroy();
        this.removeAllSignals();
    }
    update(delta) {

        if (!this.dying) {
            this.timer += delta * (this.speed * delta * Math.random())

            let dir = Math.atan2(Player.MainPlayer.transform.position.y - this.transform.position.y, Player.MainPlayer.transform.position.x - this.transform.position.x)//this.timer
            this.physics.velocity.x = Math.cos(dir) * this.speed * this.speedAdjust * delta
            this.physics.velocity.y = Math.sin(dir) * this.speed * this.speedAdjust * delta
           
        } else {
            this.physics.velocity.x = 0
            this.physics.velocity.y = 0
        }

        super.update(delta)
    }
}