import Engine from "../core/Engine";
import GameAgent from "../modules/GameAgent";
import InputModule from "../modules/InputModule";
import Layer from "../core/Layer";
import Matter from "matter-js";
import PhysicsEntity from "../modules/PhysicsEntity";
import PhysicsModule from "../modules/PhysicsModule";

export default class Bullet extends PhysicsEntity {
    constructor() {
        super(5, false);

        this.view = new PIXI.Sprite.from('new_item')
        this.view.anchor.set(0.5)
        this.view.scale.set(5 / this.view.width * 2)
        this.speed = 30
        
        this.body.collisionFilter.group = 2
        this.body.collisionFilter.mask = 3


        this.span = 1

        this.layerCategory = Layer.Bullet
        this.layerMask = Layer.Enemy
    }
    shoot(ang) {
        this.physics.velocity.x = Math.cos(ang) * this.speed
        this.physics.velocity.y = Math.sin(ang) * this.speed
    }
    collisionEnter(collided) {
        if(!collided.body.isStatic){
            collided.destroy();
        }
        this.destroy()
    }
    start() {
        this.physicsModule = this.engine.findByType(PhysicsModule)
    }
    
    update(delta) {
        super.update(delta)
        
        this.span -= delta
        if(this.span <= 0){            
            this.destroy()
        }
        this.view.x = this.transform.position.x
        this.view.y = this.transform.position.y - 30
    }
}