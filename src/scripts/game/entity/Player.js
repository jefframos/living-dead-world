import Bullet from "./Bullet";
import GameAgent from "../modules/GameAgent";
import InputModule from "../modules/InputModule";
import Layer from "../core/Layer";
import Matter from "matter-js";
import PhysicsModule from "../modules/PhysicsModule";

export default class Player extends GameAgent {
    constructor() {
        super(15);


        this.characterAnimationID = 'Hero';
        let animations = [
            {
                id: 'Idle',
                name: 'idle',
                frames: 5,
                speed: 0.2
            },
            {
                id: 'Run',
                name: 'running',
                frames: 10,
                speed: 0.2
            },
        ]

        this.injectAnimations(animations);

        this.speed = 2

        this.shootTimer = 0.2

        this.latestDirection = -Math.PI / 2

        this.layerCategory = Layer.Player
        this.layerMask = Layer.Environment | Layer.Enemy

        console.log("POOLING ASAP")
    }
    start() {
        this.input = this.engine.findByType(InputModule)
        this.physicsModule = this.engine.findByType(PhysicsModule)
    }
    
    collisionEnter(collided) {
        //this.physicsModule.removeAgent(collided);
    }
    shoot() {
        this.shootTimer = 0.5;

        let bullet = new Bullet();
        bullet.x = this.transform.position.x
        bullet.y = this.transform.position.y
        this.engine.addGameObject(bullet)

        bullet.shoot(this.latestDirection)
    }
    update(delta) {
        this.shootTimer -= delta;
        if (this.shootTimer <= 0) {
            this.shoot()
        }
        this.timer += delta * (this.speed)
        if (this.physics.magnitude > 0) {
            this.view.play('Run')
        } else {

            this.view.play('Idle')
        }

        if (this.input.magnitude > 0) {
            this.physics.velocity.x = Math.cos(this.input.direction) * this.speed
            this.physics.velocity.y = Math.sin(this.input.direction) * this.speed

            this.latestDirection = this.input.direction
        } else {
            this.physics.velocity.x = 0
            this.physics.velocity.y = 0
        }

        super.update(delta)
    }
}