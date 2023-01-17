import BaseMelee from "../components/weapon/BaseMelee";
import BaseWeapon from "../components/weapon/BaseWeapon";
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
import Vector3 from "../core/gameObject/Vector3";
import WeaponAttributes from "../data/WeaponAttributes";
import WeaponData from "../data/WeaponData";
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


        let wData1 = new WeaponData();
        wData1.weaponAttributes.baseLifeRangeSpan = 50
        wData1.weaponViewData.addSpawnSpritesheet({
            time: 0.2,
            startFrame: 1,
            endFrame: 5,
            spriteName: 'hit-h',
            addZero: false,
            lifeSpan: 9999
        },new Vector3(10,0,-20))
        wData1.weaponViewData.baseViewData.alpha = 0

        this.weapon = this.engine.poolGameObject(BaseWeapon)
        this.addChild(this.weapon)
        this.weapon.build(wData1)
        


        let wData2 = new WeaponData();
        wData2.weaponAttributes.baseLifeSpan = 5
        wData2.weaponAttributes.baseLifeRangeSpan = -1
        wData2.weaponAttributes.baseAmount =5
        wData2.weaponAttributes.baseFrequency =5
        wData2.weaponAttributes.baseRadius =30
        wData2.weaponAttributes.forceField = true
        
        wData2.weaponViewData.baseViewData.viewData = 'hit-g1'
        wData2.weaponViewData.baseViewData.scale = 4
        wData2.weaponViewData.baseViewData.offset.y = -20
        wData2.weaponViewData.baseViewData.rotationSpeed = 5
        
        this.weapon2 = this.engine.poolGameObject(FloatingProjectile) 
        this.addChild(this.weapon2)
        this.weapon2.build(wData2)


        let wData4 = new WeaponData();
        wData4.weaponAttributes.baseLifeRangeSpan = 200
        wData4.weaponAttributes.baseAmount = 1
        wData4.weaponAttributes.baseFrequency = 0.25
        wData4.weaponAttributes.baseRadius =30
        //wData4.weaponAttributes.angleOffset = Math.PI / 4
        wData4.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.ClosestEnemy

        wData4.weaponViewData.baseViewData.viewData = 'knife'
        wData4.weaponViewData.baseViewData.scale = 1
        wData4.weaponViewData.baseViewData.offset.y = -20

        this.weapon4 = this.engine.poolGameObject(BaseWeapon) 
        this.addChild(this.weapon4)
        this.weapon4.build(wData4)


        let wData5 = new WeaponData();
        wData5.weaponAttributes.baseLifeRangeSpan = 200
        wData5.weaponAttributes.baseAmount = 1
        wData5.weaponAttributes.baseFrequency = 0.25
        wData5.weaponAttributes.angleOffset = Math.PI / 4
        wData5.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.AngularSequence

        wData5.weaponViewData.addDestroySpritesheet({
            time: 0.2,
            startFrame: 1,
            endFrame: 60,
            spriteName: 'hit_claws_',
            addZero: true,
            lifeSpan: 9999
        },new Vector3(10,0,-20))


        wData5.weaponViewData.baseViewData.viewData = 'smallButton'
        wData5.weaponViewData.baseViewData.scale = 1
        wData5.weaponViewData.baseViewData.offset.y = -20

        this.weapon5 = this.engine.poolGameObject(BaseWeapon) 
        this.addChild(this.weapon5)
        this.weapon5.build(wData5)

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
                if (element.destroy && !element.destroyed) {
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