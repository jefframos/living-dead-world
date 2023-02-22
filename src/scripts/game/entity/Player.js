import Companion from "./Companion";
import EffectsManager from "../manager/EffectsManager";
import EntityLifebar from "../components/ui/progressBar/EntityLifebar";
import FlashOnDamage from "../components/view/FlashOnDamage";
import GameAgent from "../core/entity/GameAgent";
import GameStaticData from "../data/GameStaticData";
import GameViewSpriteSheet from "../components/GameViewSpriteSheet";
import InGameWeapon from "../data/InGameWeapon";
import InputModule from "../core/modules/InputModule";
import Layer from "../core/Layer";
import PhysicsModule from "../core/modules/PhysicsModule";
import RenderModule from "../core/modules/RenderModule";
import Sensor from "../core/utils/Sensor";
import Shaders from "../shader/Shaders";
import Shadow from "../components/view/Shadow";
import SpriteFacing from "../components/SpriteFacing";
import SpriteJump from "../components/SpriteJump";
import Utils from "../core/utils/Utils";
import Vector3 from "../core/gameObject/Vector3";
import WeaponBuilder from "../screen/WeaponBuilder";
import WeaponLoadingBar from "../components/ui/progressBar/WeaponLoadingBar";
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
    build(playerData) {

        if (!playerData) {
            playerData = GameStaticData.instance.getEntityByIndex('player', Math.floor(Math.random() * 7))
        }


        this.staticData = playerData;
        this.attributes = playerData.attributes;
        this.viewData = playerData.view;
        Player.MainPlayer = this;
        super.build()

        this.distanceWalked = 0;

        this.activeWeapons = [];
        this.weaponsGameObject = [];
        
        this.health.setNewHealth(this.attributes.hp)

        this.currentEnemiesColliding = []
        this.weaponLoadingBars = [];

        this.sensor = this.engine.poolGameObject(Sensor)
        this.sensor.build(250)
        this.sensor.onTrigger.add(this.onSensorTrigger.bind(this))
        this.addChild(this.sensor)
        this.buildCircle(0, 0, 15);


        this.lifeBar = this.engine.poolGameObject(EntityLifebar)
        this.addChild(this.lifeBar)

        this.lifeBar.build(20, 3, 1);
        this.lifeBar.updateView({ x: 0, y: -60 }, 0x8636f0, 0xFF0000);


        this.speed = this.attributes.speed


        this.addChild(this.engine.poolGameObject(Shadow))

        this.transform.angle = -Math.PI / 2
        this.layerCategory = Layer.Player
        this.layerMask = Layer.PlayerCollision


        this.framesAfterStart = 0;

        // let spriteSheet = this.addComponent(GameViewSpriteSheet);

        // let animData1 = {} 
        // let run = GameStaticData.instance.getSharedDataById('animation', this.staticData.animationData.run);
        // if (run) {
        //     animData1[GameViewSpriteSheet.AnimationType.Running] = run.animationData;
        // } else {
        //     animData1[GameViewSpriteSheet.AnimationType.Running] = animData1[GameViewSpriteSheet.AnimationType.Idle];
        // }
        // animData1[GameViewSpriteSheet.AnimationType.Idle] = GameStaticData.instance.getSharedDataById('animation', this.staticData.animationData.idle).animationData

        // spriteSheet.setData(animData1);
        // spriteSheet.update(0.1);

        this.makeAnimations(this.staticData)

        if (this.viewData.anchor) {
            this.gameView.view.anchor.set(this.viewData.anchor.x, this.viewData.anchor.y)
        } else {
            this.gameView.view.anchor.set(0.5, 1)
        }

        let scale = this.viewData.scale ? this.viewData.scale : 1
        this.gameView.view.scale.set(Utils.scaleToFit(this.gameView.view, this.attributes.radius * 2 * scale));
        this.gameView.view.scale.y = Math.abs(this.gameView.view.scale.y);
        this.gameView.view.scale.x = Math.abs(this.gameView.view.scale.x);
        this.gameView.applyScale();
        this.anchorOffset = 0

        //this.addComponent(FlashOnDamage)
        this.addComponent(SpriteJump).jumpHight = 5
        let spriteFacing = this.addComponent(SpriteFacing);
        spriteFacing.lerp = 1
        spriteFacing.startScaleX = -1

        this.addWeaponData(WeaponBuilder.instance.weaponsData[playerData.weapon.id])



for (let index = 0; index < 2; index++) {
    let companion = this.engine.poolGameObject(Companion)
    companion.build(GameStaticData.instance.getEntityByIndex('companions', index));
    this.addChild(companion)
    companion.x = Math.cos(Math.random()) * 100
    companion.z = Math.sin(Math.random()) * 100
    
}
    }

    clearWeapon() {
        for (let index = this.weaponsGameObject.length - 1; index >= 0; index--) {
            if (!this.weaponsGameObject[index].destroyed) {

                this.weaponsGameObject[index].destroy();
            }
        }
        for (let index = this.weaponLoadingBars.length - 1; index >= 0; index--) {
            if (!this.weaponLoadingBars[index].destroyed) {

                this.weaponLoadingBars[index].destroy();
            }
        }
        this.weaponLoadingBars = [];
        this.weaponsGameObject = [];
        this.activeWeapons = [];
        this.refreshEquipment();
    }
    addWeaponData(weaponData, slotID = 0) {

        if (this.activeWeapons.length < slotID + 1) {
            let mainWeapon = new InGameWeapon();
            mainWeapon.addWeapon(weaponData)
            this.addWeapon(mainWeapon)
        } else {
            this.activeWeapons[slotID].addWeapon(weaponData);
        }
    }
    addWeapon(inGameWeapon) {
        if (!inGameWeapon.hasWeapon) {
            return;
        }
        let weaponData = inGameWeapon.mainWeapon

        let weapon = this.engine.poolGameObject(weaponData.customConstructor)
        this.addChild(weapon)
        this.weaponsGameObject.push(weapon);
        weapon.build(weaponData)
        inGameWeapon.onUpdateWeapon.add(() => {
            this.refreshEquipment();
        })
        this.activeWeapons.push(inGameWeapon)
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
    damage(value) {
        super.damage(value);
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
                Vector3.sum(Vector3.sum(this.transform.position, this.facingVector), new Vector3(0, 0, 0))
            ), 'SMOKE_01', 1)

            this.distanceWalked = 0;
        }

        super.update(delta)
    }

}