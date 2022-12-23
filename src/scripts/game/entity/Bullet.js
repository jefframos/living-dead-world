import BaseEnemy from "./BaseEnemy";
import Engine from "../core/Engine";
import GameAgent from "../modules/GameAgent";
import InputModule from "../modules/InputModule";
import Layer from "../core/Layer";
import Matter from "matter-js";
import PhysicsEntity from "../modules/PhysicsEntity";
import PhysicsModule from "../modules/PhysicsModule";
import StandardZombie from "./StandardZombie";
import config from "../../config";
import GameView from "../core/GameView";

export default class Bullet extends PhysicsEntity {
    constructor() {
        super();

        this.gameView = new GameView(this)
        this.gameView.view = new PIXI.Sprite.from('tile_0103')
        this.gameView.view.alpha = 1
        //this.setDebug(15)
    }
    build() {
        super.build()
        this.buildCircle(0, 0, 15)

        this.gameView.view.anchor.set(0.5)
        this.gameView.view.scale.set(1.5)
        //this.gameView.view.scale.set(5 / this.gameView.view.width * 2 * this.gameView.view.scale.x)
        this.speed = 250

        this.rigidBody.collisionFilter.group = 2
        this.rigidBody.collisionFilter.mask = 3


        this.lifeSpan = 0.5

        this.layerCategory = Layer.Bullet
        this.layerMask = Layer.BulletCollision

        this.rigidBody.isSensor = true

        this.viewOffset.y = - 5;


    }
    enable(){
        super.enable();
        this.gameView.view.visible = false
    }
    shoot(ang, magnitude) {
        this.angle = ang;

        this.speed += this.speed * magnitude * 0.5
        this.gameView.view.rotation =  this.angle + Math.PI/2

        this.physics.velocity.x = 0
        this.physics.velocity.y = 0
    }
    collisionEnter(collided) {
        if(collided.rigidBody.isSensor){
            return;
        }
        if (collided.rigidBody.isStatic) {
            this.destroy()

        }else{
            if(collided.die){
                collided.die()
                this.engine.poolAtRandomPosition(BaseEnemy, true, {minX:50, maxX: config.width, minY:50, maxY:config.height})
                this.destroy()
            }else{

                collided.destroy();
            }
            //this.destroy()
        }
    }
    start() {
        this.physicsModule = this.engine.findByType(PhysicsModule)
    }

    update(delta) {
        super.update(delta)
        this.physics.velocity.x = Math.cos(this.angle) * this.speed * delta
        this.physics.velocity.y = Math.sin(this.angle) * this.speed * delta
        this.lifeSpan -= delta
        if (this.lifeSpan <= 0) {
            this.destroy()
        }
        this.gameView.view.x = this.transform.position.x
        this.gameView.view.y = this.transform.position.y + this.viewOffset.y

        this.gameView.view.visible = true;


        this.gameView.view.rotation =  this.transform.angle + Math.PI/2
    }
}