import Engine from "../core/Engine";
import GameAgent from "../modules/GameAgent";
import InputModule from "../modules/InputModule";
import Layer from "../core/Layer";
import Matter from "matter-js";
import PhysicsEntity from "../modules/PhysicsEntity";
import PhysicsModule from "../modules/PhysicsModule";
import StandardZombie from "./StandardZombie";
import config from "../../config";

export default class Bullet extends PhysicsEntity {
    constructor() {
        super();
        this.view = new PIXI.Sprite.from('shoot')
        this.view.alpha = 0.2
        //this.setDebug(5)
    }
    build() {
        super.build()
        this.buildCircle(0, 0, 5)

        this.view.anchor.set(0.5)
        this.view.scale.set(5 / this.view.width * 2 * this.view.scale.x)
        this.speed = 250

        this.body.collisionFilter.group = 2
        this.body.collisionFilter.mask = 3


        this.lifeSpan = 4

        this.layerCategory = Layer.Bullet
        this.layerMask = Layer.Enemy | Layer.Environment

        this.body.isSensor = true

        this.viewOffset.y = - 20;


    }
    enable(){
        super.enable();
        this.view.visible = false
    }
    shoot(ang, magnitude) {
        this.angle = ang;

        this.speed += this.speed * magnitude * 0.5
        this.view.rotation =  this.angle

        this.physics.velocity.x = 0
        this.physics.velocity.y = 0
    }
    collisionEnter(collided) {
        if(collided.body.isSensor){
            return;
        }
        if (collided.body.isStatic) {
            this.destroy()

        }else{
            if(collided.die){
                collided.die()
                this.engine.poolAtRandomPosition(StandardZombie, true, {minX:50, maxX: config.width, minY:50, maxY:200})
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
        this.view.x = this.transform.position.x
        this.view.y = this.transform.position.y + this.viewOffset.y

        this.view.visible = true;


        this.view.rotation = this.transform.angle
    }
}