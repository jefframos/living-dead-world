import EffectsManager from "../manager/EffectsManager";
import GameAgent from "../core/entity/GameAgent";
import GameViewSpriteSheet from "../components/GameViewSpriteSheet";
import InputModule from "../core/modules/InputModule";
import Layer from "../core/Layer";
import PhysicsModule from "../core/modules/PhysicsModule";
import RenderModule from "../core/modules/RenderModule";
import Sensor from "../core/utils/Sensor";
import SpriteFacing from "../components/SpriteFacing";
import SpriteJump from "../components/SpriteJump";
import Vector3 from "../core/gameObject/Vector3";
import config from "../../config";
import signals from "signals";

export default class Player extends GameAgent {
    static MainPlayer = this;
    static Deaths = 0;
    constructor() {
        super();

        this.activeWeapons = [];

        this.onUpdateEquipment = new signals.Signal();
        this.totalDirections = 8
        this.autoSetAngle = false;
        this.gameView.layer = RenderModule.RenderLayers.Gameplay
        this.gameView.view = new PIXI.Sprite.from('knight_idle_anim_f0')
        //this.setDebug(15)        
        this.playerStats = {
            health: 0,
            deaths: 0
        }
        window.GUI.add(this.playerStats, 'health').listen();
        window.GUI.add(this.playerStats, 'deaths').listen();

        this.isPlayer = true;
    }
    build(radius = 15) {

        Player.MainPlayer = this;
        super.build()

        this.distanceWalked = 0;

        this.activeWeapons = [];

        this.health.reset()

        this.currentEnemiesColliding = []


        this.sensor = this.engine.poolGameObject(Sensor)
        this.sensor.build(250)
        this.sensor.onTrigger.add(this.onSensorTrigger.bind(this))
        this.addChild(this.sensor)
        this.buildCircle(0, 0, 15);

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
        let spriteFacing = this.addComponent(SpriteFacing);
        spriteFacing.lerp = 1
        spriteFacing.startScaleX = -1

        this.framesAfterStart = 0;
        let spriteSheet = this.addComponent(GameViewSpriteSheet);

        let animData = {}
        animData[GameViewSpriteSheet.AnimationType.Idle] = {
            spriteName: 'knight_idle_anim_f',
            params: {
                totalFramesRange: { min: 0, max: 5 }, time: 0.1, loop: true
            }
        }
        animData[GameViewSpriteSheet.AnimationType.Running] = {
            spriteName: 'knight_run_anim_f',
            params: {
                totalFramesRange: { min: 0, max: 5 }, time: 0.1, loop: true
            }
        }

        spriteSheet.setData(animData);
    }

    addWeaponData(weaponData) {
        // let weapon = this.engine.poolGameObject(weaponData.customConstructor)

        // if (weaponData.type == WeaponData.WeaponType.Main) {
        //     this.addChild(weapon)
        //     weapon.build(weaponData)
        //     this.activeWeapons[0].addWeapon(weaponData)
        // } else {
        //     this.addChild(weapon)
        //     weapon.build(weaponData)
        //     this.activeWeapons[1].addWeapon(weaponData)
        // }
        // this.refreshEquipment();
    }
    clearWeapon() {
        for (let index = this.activeWeapons.length - 1; index >= 0; index--) {
            this.activeWeapons[index].destroy();
        }
        this.activeWeapons = [];
    }
    addWeapon(inGameWeapon) {
        if (!inGameWeapon.hasWeapon) {
            return;
        }
        let weaponData = inGameWeapon.mainWeapon
        let weapon = this.engine.poolGameObject(weaponData.customConstructor)
        this.addChild(weapon)
        weapon.build(weaponData)

        inGameWeapon.onUpdateWeapon.add(() => {
            this.refreshEquipment();
        })

        this.activeWeapons.push(weapon)
        this.refreshEquipment();
    }
    refreshEquipment() {
        this.onUpdateEquipment.dispatch(this);
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

        for (let index = 0; index < this.currentEnemiesColliding.length; index++) {
            const element = this.currentEnemiesColliding[index];
            if (element.timer <= 0) {
                let dead = this.damage(element.entity.attributes.power);
                if (dead) {
                    return
                }
                element.timer = 1;
            } else {
                element.timer -= delta;
            }
        }

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

        this.distanceWalked += this.physics.magnitude * this.speed * delta;

        if (this.distanceWalked > 50) {
            EffectsManager.instance.emitById(Vector3.XZtoXY(
                Vector3.sum(Vector3.sum(this.transform.position, this.facingVector), new Vector3(0, 0, -20))
            ), 'SMOKE_01', 1)

            this.distanceWalked = 0;
        }

        super.update(delta)
    }

}