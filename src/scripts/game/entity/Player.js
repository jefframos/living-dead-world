import Bullet from "./Bullet";
import GameAgent from "../core/entity/GameAgent";
import InputModule from "../core/modules/InputModule";
import Layer from "../core/Layer";
import PhysicsModule from "../core/modules/PhysicsModule";
import RenderModule from "../core/modules/RenderModule";
import Sensor from "../core/utils/Sensor";
import SpriteJump from "../components/SpriteJump";
import config from "../../config";
import utils from "../../utils";

export default class Player extends GameAgent {
    static MainPlayer = this;
    static Deaths = 0;
    constructor() {
        super();

        this.totalDirections = 8
        this.autoSetAngle = false;
        this.gameView.layer = RenderModule.RenderLayers.Gameplay
        this.gameView.view = new PIXI.Sprite.from('peppa2')
        //this.setDebug(15)        
        this.playerStats = {
            health: 0,
            deaths: 0
        }
        window.GUI.add(this.playerStats, 'health').listen();
        window.GUI.add(this.playerStats, 'deaths').listen();
    }
    build(radius = 15) {

        Player.MainPlayer = this;
        super.build()

        this.health.reset()

        this.currentEnemiesColliding = []

        this.addComponent(SpriteJump)

        this.sensor = this.engine.poolGameObject(Sensor)
        this.sensor.build(250)
        this.sensor.onTrigger.add(this.onSensorTrigger.bind(this))
        this.addChild(this.sensor)
        this.buildCircle(0, 0, 15);

        this.speed = 100

        this.shootBaseTime = 0.25
        this.shootTimer = 0.5
        this.transform.angle = -Math.PI / 2
        this.layerCategory = Layer.Player
        this.layerMask = Layer.PlayerCollision

        this.gameView.view.anchor.set(0.5, 1)
        this.gameView.view.scale.set(15 / this.gameView.view.width * this.gameView.view.scale.x * 2)
        this.gameView.applyScale();

        this.anchorOffset = 0

    }
    onSensorTrigger(element) {
    }
    die() {
        super.die();

        Player.Deaths++;
    }
    start() {
        this.input = this.engine.findByType(InputModule)
        this.physicsModule = this.engine.findByType(PhysicsModule)
    }

    collisionEnter(collided) {
        if (collided.layerCategory != Layer.Enemy) return;
        if (this.findInCollision(collided)) return;
        this.currentEnemiesColliding.push({ entity: collided, timer: 0 });
    }
    collisionExit(collided) {
        if (collided.layerCategory != Layer.Enemy) return;
        if (!this.findInCollision(collided)) return;
        this.currentEnemiesColliding = this.currentEnemiesColliding.filter(item => item.entity !== collided);
    }
    shoot() {
        this.shootTimer = this.shootBaseTime;

        let bullet = this.engine.poolGameObject(Bullet, true)
        let forw = this.forward;

        //this.view.play('Pistol_Shoot')
        let shootAngle = this.transform.angle//Math.floor(this.transform.angle / this.angleChunkRad) * this.angleChunkRad;

        //console.log(this.sensor.collisionList.length,this.sensor.collisionList[0])
        //console.log(this.sensor.collisionList.length)
        if (this.sensor.collisionList.length) {
            utils.distSort(this.transform.position, this.sensor.collisionList)

            //let first = this.sensor.collisionList[Math.floor(Math.random() * this.sensor.collisionList.length)].transform.position
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

                if (this.sensor.collisionList.length) {
                    this.shoot();
                }
            }
        }

        this.currentEnemiesColliding.forEach(element => {
            if (element.timer <= 0) {
                this.damage(10);
                element.timer = 1;
            } else {
                element.timer -= delta;
            }
        });

        this.playerStats.health = this.health.currentHealth
        this.playerStats.deaths = Player.Deaths

        this.sensor.x = this.transform.position.x
        this.sensor.y = this.transform.position.y

        this.transform.angle = Math.atan2(this.input.mousePosition.y - this.transform.position.y, this.input.mousePosition.x - this.transform.position.x)
        if (window.isMobile && this.input.touchAxisDown) {
            this.physics.velocity.x = Math.cos(this.input.direction) * this.speed * delta
            this.physics.velocity.y = Math.sin(this.input.direction) * this.speed * delta
            this.transform.angle = this.input.direction

        } else if (this.input.isMouseDown) {

            //from the middle
            this.transform.angle = Math.atan2(this.input.mousePosition.y - config.height / 2, this.input.mousePosition.x - config.width / 2)
            this.physics.velocity.x = Math.cos(this.transform.angle) * this.speed * delta
            this.physics.velocity.y = Math.sin(this.transform.angle) * this.speed * delta

        } else if (this.input.magnitude > 0) {
            this.transform.angle = this.input.direction

            this.physics.velocity.x = Math.cos(this.transform.angle) * this.speed * delta
            this.physics.velocity.y = Math.sin(this.transform.angle) * this.speed * delta



        } else {
            this.transform.angle = this.input.direction
            this.physics.velocity.x = 0
            this.physics.velocity.y = 0
        }

        if(this.physics.velocity.x > 0){
            this.gameView.view.scale.x = -this.gameView.baseScale.x
        }else if(this.physics.velocity.x < 0){
            this.gameView.view.scale.x = this.gameView.baseScale.x
        }

        super.update(delta)
    }

}