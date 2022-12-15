import Bullet from "./Bullet";
import GameAgent from "../modules/GameAgent";
import InputModule from "../modules/InputModule";
import Layer from "../core/Layer";
import Matter from "matter-js";
import PhysicsModule from "../modules/PhysicsModule";
import Game from "../../Game";

export default class Player extends GameAgent {
    constructor() {
        super();
        //this.setDebug(15)
        this.autoSetAngle = false;
    }
    build(radius = 15) {
        super.build()

        this.buildCircle(0, 0, 15);


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
                speed: 0.1
            },
        ]

        this.injectAnimations(animations);

        this.speed = 100
        this.shootTimer = 0.2
        this.transform.angle = -Math.PI / 2
        this.layerCategory = Layer.Player
        this.layerMask = Layer.Environment | Layer.Enemy
    }
    start() {
        this.input = this.engine.findByType(InputModule)
        this.physicsModule = this.engine.findByType(PhysicsModule)
    }

    collisionEnter(collided) {
        //this.physicsModule.removeAgent(collided);
    }
    shoot() {
        this.shootTimer = 0.15;

        let bullet = this.engine.poolGameObject(Bullet, true)
        let forw = this.forward;

        //console.log(forw)

        bullet.setPosition(this.transform.position.x + forw.x * 20 + this.physics.velocity.x, this.transform.position.y + forw.y * 20 + this.physics.velocity.y);
        bullet.shoot(this.transform.angle + Math.random() * 0.2 - 0.1, this.physics.magnitude)
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



        //console.log(this.input.mouse)
        //console.log(this.transform.angle * 180 / 3.14)

        //console.log(Game.GlobalScale.x, this.input.mousePosition.x)
        this.transform.angle = Math.atan2(this.input.mousePosition.y - this.transform.position.y, this.input.mousePosition.x - this.transform.position.x)
        if (this.input.touchAxisDown) {
            this.physics.velocity.x = Math.cos(this.input.direction) * this.speed * delta
            this.physics.velocity.y = Math.sin(this.input.direction) * this.speed * delta
            this.transform.angle = this.input.direction

        } else if (this.input.isMouseDown) {
            this.physics.velocity.x = Math.cos(this.transform.angle) * this.speed * delta
            this.physics.velocity.y = Math.sin(this.transform.angle) * this.speed * delta

        } else if (this.input.magnitude > 0) {
            this.physics.velocity.x = Math.cos(this.input.direction) * this.speed * delta
            this.physics.velocity.y = Math.sin(this.input.direction) * this.speed * delta
        } else {
            this.transform.angle = Math.atan2(this.input.mousePosition.y - this.transform.position.y, this.input.mousePosition.x - this.transform.position.x)
            this.physics.velocity.x = 0
            this.physics.velocity.y = 0
        }

        super.update(delta)
    }
}