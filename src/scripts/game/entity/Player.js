import Bullet from "./Bullet";
import Game from "../../Game";
import GameAgent from "../modules/GameAgent";
import InputModule from "../modules/InputModule";
import Layer from "../core/Layer";
import Matter from "matter-js";
import PhysicsModule from "../modules/PhysicsModule";
import Sensor from "../core/Sensor";

export default class Player extends GameAgent {
    constructor() {
        super();
        this.totalDirections = 8
        this.autoSetAngle = false;
        this.view = new PIXI.Sprite.from('tile_0085')
        this.setDebug(15)

    }
    build(radius = 15) {
        super.build()
        
        this.sensor = this.engine.poolGameObject(Sensor, true)
        this.sensor.onTrigger.add(this.onSensorTrigger.bind(this))
        this.addChild(this.sensor)
        //this.sensor.setPosition(200,200)
        this.buildCircle(0, 0, 15);

        // this.characterAnimationID = 'Hero';
        // let animations = [
        //     {
        //         id: 'Idle',
        //         name: 'idle',
        //         frames: 5,
        //         speed: 0.2
        //     },
        //     {
        //         id: 'Run',
        //         name: 'running',
        //         frames: 10,
        //         speed: 0.1
        //     },
        //     {
        //         id: 'Pistol_Run',
        //         name: 'pistol_run',
        //         frames: 10,
        //         speed: 0.1
        //     },
        //     {
        //         id: 'Pistol_Idle',
        //         name: 'pistol_idle',
        //         frames: 5,
        //         speed: 0.1
        //     },
        //     {
        //         id: 'Pistol_Shoot',
        //         name: 'pistol_shoot',
        //         frames: 5,
        //         speed: 0.1,
        //         loop: false
        //     },
        // ]

        // this.injectAnimations(animations, true);

        this.speed = 100

        this.shootBaseTime = 0.2
        this.shootTimer = 0.1
        this.transform.angle = -Math.PI / 2
        this.layerCategory = Layer.Player
        this.layerMask = Layer.PlayerCollision

        this.view.anchor.set(0.5,1)
        this.view.scale.set(2)

        //this.view.play('Pistol_Idle')
    }
    onSensorTrigger(element){
        //console.log(element)
        
    }
    onAnimationEnd(animation, state) {

        if (state == 'Pistol_Shoot') {
            this.view.play('Pistol_Idle')
        }
    }
    start() {
        this.input = this.engine.findByType(InputModule)
        this.physicsModule = this.engine.findByType(PhysicsModule)
    }

    collisionEnter(collided) {
        //this.physicsModule.removeAgent(collided);
    }
    shoot() {
        //return
        //this.isShooting = true;

        this.shootTimer =this.shootBaseTime;

        let bullet = this.engine.poolGameObject(Bullet, true)
        let forw = this.forward;

        //this.view.play('Pistol_Shoot')
        let shootAngle = this.transform.angle//Math.floor(this.transform.angle / this.angleChunkRad) * this.angleChunkRad;

        if(this.sensor.collisionList.length){
            let first = this.sensor.collisionList[0].transform.position
            shootAngle = Math.atan2(first.y - this.transform.position.y, first.x - this.transform.position.x)
        }
        bullet.setPosition(this.transform.position.x + Math.cos(shootAngle) * 20 + this.physics.velocity.x, this.transform.position.y + Math.sin(shootAngle) * 20 + this.physics.velocity.y);

        bullet.shoot(shootAngle + Math.random() * 0.2 - 0.1, this.physics.magnitude)
    }
    update(delta) {
        if (!this.isShooting) {


            this.shootTimer -= delta;
            if (this.shootTimer <= 0) {
                this.shoot()
            }
        }

        // if (this.physics.magnitude > 0) {
        //     this.view.play('Pistol_Run')
        // } else if (!this.view.currentState == 'Pistol_Shoot') {
        //     this.view.play('Pistol_Idle')
        // }

        this.sensor.x = this.transform.position.x
        this.sensor.y = this.transform.position.y

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