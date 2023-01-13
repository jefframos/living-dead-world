import BaseMelee from "../components/weapon/BaseMelee";
import Bullet from "../components/weapon/bullets/Bullet";
import FloatingProjectile from "../components/weapon/FloatingProjectile";
import GameAgent from "../core/entity/GameAgent";
import InputModule from "../core/modules/InputModule";
import Layer from "../core/Layer";
import PhysicsModule from "../core/modules/PhysicsModule";
import RenderModule from "../core/modules/RenderModule";
import Sensor from "../core/utils/Sensor";
import SpriteFacing from "../components/SpriteFacing";
import SpriteJump from "../components/SpriteJump";
import ThrowingProjectile from "../components/weapon/ThrowingProjectile";
import Utils from "../core/utils/Utils";
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


        this.sensor = this.engine.poolGameObject(Sensor)
        this.sensor.build(250)
        this.sensor.onTrigger.add(this.onSensorTrigger.bind(this))
        this.addChild(this.sensor)
        this.buildCircle(0, 0, 15);

        this.weapon = this.engine.poolGameObject(BaseMelee)
        this.addChild(this.weapon)
        this.weapon.build()
        
        // this.weapon2 = this.engine.poolGameObject(FloatingProjectile) 
        // this.addChild(this.weapon2)
        // this.weapon2.build()

        this.weapon3 = this.engine.poolGameObject(ThrowingProjectile) 
        this.addChild(this.weapon3)
        this.weapon3.build()

        this.speed = 100

        this.transform.angle = -Math.PI / 2
        this.layerCategory = Layer.Player
        this.layerMask = Layer.PlayerCollision

        this.gameView.view.anchor.set(0.5, 1);
        this.gameView.view.scale.set(15 / this.gameView.view.width * this.gameView.view.scale.x * 2);
        this.gameView.view.scale.y = Math.abs(this.gameView.view.scale.y);
        this.gameView.view.scale.x = Math.abs(this.gameView.view.scale.x);
        this.gameView.applyScale();

        this.anchorOffset = 0


        this.addComponent(SpriteJump)
        this.addComponent(SpriteFacing)


        this.framesAfterStart = 0;

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

    update(delta) {
        this.framesAfterStart++
        if (this.framesAfterStart == 1) {
            this.sensor.collisionList.forEach(element => {
                if (element.destroy) {
                    element.destroy()
                }
            });
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
        this.sensor.z = this.transform.position.z

        this.transform.angle = Math.atan2(this.input.mousePosition.y - this.transform.position.z, this.input.mousePosition.x - this.transform.position.x)
        if (window.isMobile && this.input.touchAxisDown) {
            this.physics.velocity.x = Math.cos(this.input.direction) * this.speed * delta
            this.physics.velocity.z = Math.sin(this.input.direction) * this.speed * delta
            this.transform.angle = this.input.direction

        } else if (this.input.isMouseDown) {

            //from the middle
            this.transform.angle = Math.atan2(this.input.mousePosition.y - config.height / 2, this.input.mousePosition.x - config.width / 2)
            this.physics.velocity.x = Math.cos(this.transform.angle) * this.speed * delta
            this.physics.velocity.z = Math.sin(this.transform.angle) * this.speed * delta

        } else if (this.input.magnitude > 0) {
            this.transform.angle = this.input.direction

            this.physics.velocity.x = Math.cos(this.transform.angle) * this.speed * delta
            this.physics.velocity.z = Math.sin(this.transform.angle) * this.speed * delta



        } else {
            this.transform.angle = this.input.direction
            this.physics.velocity.x = 0
            this.physics.velocity.z = 0
        }



        super.update(delta)
    }

}