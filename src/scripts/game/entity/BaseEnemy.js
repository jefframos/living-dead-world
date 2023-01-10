import GameAgent from "../core/entity/GameAgent";
import Layer from "../core/Layer";
import Player from "./Player";
import SpriteFacing from "../components/SpriteFacing";
import SpriteJump from "../components/SpriteJump";

export default class BaseEnemy extends GameAgent {
    constructor() {
        super();
        //this.setDebug(15)

        this.enemies = ['cat','dog','elephant','poney','rabbit','sheep']
        //this.enemies = ['tile_0122', 'tile_0109','tile_0110','tile_0111','tile_0112','tile_0120','tile_0121','tile_0122','tile_0123','tile_0124']
        this.gameView.view = new PIXI.Sprite()

    }
    build(radius = 15) {
        super.build();
        //this.view.scale.set(0.2)
        this.buildCircle(0, 0, 15);


        this.gameView.view.texture = new PIXI.Texture.from(this.enemies[Math.floor(Math.random() * this.enemies.length)])


       

        this.rigidBody.isSensor = false;
        this.layerCategory = Layer.Enemy
        this.layerMask = Layer.EnemyCollision

        this.gameView.view.anchor.set(0.5,1)
        this.gameView.view.scale.set(15 / this.gameView.view.width * Math.abs(this.gameView.view.scale.x) * 2)
        this.gameView.applyScale();

        this.speedAdjust = 3

        this.addComponent(SpriteJump)
        this.addComponent(SpriteFacing)
    }
    destroy(){
        super.destroy();
        this.removeAllSignals();
    }
    update(delta) {

        if (!this.dying) {
            this.timer += delta * (this.speed * delta * Math.random())

            let dir = Math.atan2(Player.MainPlayer.transform.position.z - this.transform.position.z, Player.MainPlayer.transform.position.x - this.transform.position.x)//this.timer
            this.physics.velocity.x = Math.cos(dir) * this.speed * this.speedAdjust * delta
            this.physics.velocity.z = Math.sin(dir) * this.speed * this.speedAdjust * delta
           
        } else {
            this.physics.velocity.x = 0
            this.physics.velocity.z = 0
        }

        super.update(delta)
    }
}