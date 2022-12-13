import Matter from "matter-js";
import GameAgent from "../modules/GameAgent";
import InputModule from "../modules/InputModule";
import PhysicsEntity from "../modules/PhysicsEntity";
import PhysicsModule from "../modules/PhysicsModule";

export default class Bullet extends PhysicsEntity {
    constructor() {
        super(5, false);

        this.view = new PIXI.Sprite.from('new_item')
        this.view.anchor.set(0.5)
        this.view.scale.set(5 / this.view.width * 2)
        this.speed = 30



        this.body.collisionFilter.group = 0
        this.body.collisionFilter.mask = 1 | 2
    }
    shoot(ang) {
        this.physics.velocity.x = Math.cos(ang) * this.speed
        this.physics.velocity.y = Math.sin(ang) * this.speed
    }
    collisionEnter(collided) {
        console.log(collided.body.isStatic)
        if(!collided.body.isStatic){
            this.physicsModule.removeAgent(collided);
        }
        this.physicsModule.removeAgent(this);
    }
    start() {
        this.physicsModule = this.engine.findByType(PhysicsModule)
    }

    update(delta) {
        super.update(delta)
        this.view.x = this.transform.position.x
        this.view.y = this.transform.position.y
    }
}