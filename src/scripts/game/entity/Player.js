import Companion from "./Companion";
import EffectsManager from "../manager/EffectsManager";
import EntityAttributes from "../data/EntityAttributes";
import EntityBuilder from "../screen/EntityBuilder";
import EntityData from "../data/EntityData";
import EntityLifebar from "../components/ui/progressBar/EntityLifebar";
import FlashOnDamage from "../components/view/FlashOnDamage";
import GameAgent from "../core/entity/GameAgent";
import GameStaticData from "../data/GameStaticData";
import GameViewSpriteSheet from "../components/GameViewSpriteSheet";
import GameplayItem from "../data/GameplayItem";
import InGameWeapon from "../data/InGameWeapon";
import InputModule from "../core/modules/InputModule";
import Layer from "../core/Layer";
import PhysicsModule from "../core/modules/PhysicsModule";
import PlayerGameViewSpriteSheet from "../components/PlayerGameViewSpriteSheet";
import RenderModule from "../core/modules/RenderModule";
import Sensor from "../core/utils/Sensor";
import Shaders from "../shader/Shaders";
import Shadow from "../components/view/Shadow";
import SpriteFacing from "../components/SpriteFacing";
import SpriteJump from "../components/SpriteJump";
import SpriteSheetGameView from "../components/SpriteSheetGameView";
import StatsModifier from "../components/StatsModifier";
import Utils from "../core/utils/Utils";
import Vector3 from "../core/gameObject/Vector3";
import WeaponBuilder from "../screen/EntityBuilder";
import WeaponData from "../data/WeaponData";
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
        this.gameView.view = new PIXI.Sprite();
        //this.setDebug(15)        
        this.playerStats = {
            health: 0,
            deaths: 0
        }
        window.GUI.add(this.playerStats, 'health').listen();
        window.GUI.add(this.playerStats, 'deaths').listen();

        this.isPlayer = true;

        this.currentSessionData = null;


    }
    get collectRadius() {
        return this.attributes.collectionRadius;
    }
    get sessionData() {
        return this.currentSessionData
    }
    set sessionData(value) {
        this.currentSessionData = value;
        this.currentSessionData.equipmentUpdated.removeAll();
        this.currentSessionData.equipmentUpdated.add(this.rebuildWeaponGrid.bind(this))
        this.currentSessionData.addEquipmentNEW(WeaponBuilder.instance.weaponsData[this.staticData.weapon.id])
    }
    makeAnimations(data) {
        this.playerView = this.addComponent(PlayerGameViewSpriteSheet);
        this.playerView.setData(data);
        this.playerView.update(1);
    }

    build(playerData) {
        console.log(playerData)
        if (!playerData) {
            playerData = GameStaticData.instance.getEntityByIndex('player', Math.floor(Math.random() * 7))
        }
        this.staticData = playerData;
        this.attributes.reset(playerData.attributes);
        this.viewData = playerData.view;
        Player.MainPlayer = this;
        super.build()

        this.distanceWalked = 0;

        this.activeAttachments = [];
        this.activeWeapons = [];
        this.activeCompanions = [];
        this.weaponsGameObject = [];
        this.activeStatsEffect = [];

        this.health.setNewHealth(this.attributes.health)

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
        this.lifeBar.updateView({ x: 0, y: -70 }, 0x8636f0, 0xFF0000);


        this.speed = this.attributes.speed


        this.addChild(this.engine.poolGameObject(Shadow))

        let jumpy = this.addComponent(SpriteJump)

        jumpy.jumpHight = 10
        jumpy.sinSpeed = 3

        this.transform.angle = -Math.PI / 2
        this.layerCategory = Layer.Player
        this.layerMask = Layer.PlayerCollision


        this.framesAfterStart = 0;
        this.makeAnimations(this.staticData)

        if (this.viewData.anchor) {
            this.gameView.view.anchor.set(this.viewData.anchor.x, this.viewData.anchor.y)
        } else {
            this.gameView.view.anchor.set(0.5, 1)
        }

        this.anchorOffset = 0;
        this.cleanStats();


    }
    afterBuild() {
        super.afterBuild()
    }
    addCompanion(companionID) {
        let companion = this.engine.poolGameObject(Companion)

        //console.log(EntityBuilder.instance.getCompanion(companionID), companionID)
        companion.build(EntityBuilder.instance.getCompanion(companionID));
        this.addChild(companion)
        let ang = Math.random() * Math.PI * 2
        companion.x = this.transform.position.x + Math.cos(ang) * 100
        companion.z = this.transform.position.z + Math.sin(ang) * 100

        this.activeCompanions.push(companion)
    }
    rebuildWeaponGrid(equipmentGrid) {
        this.clearWeapon();
        this.cleanStats();
        for (let i = 0; i < equipmentGrid.length; i++) {
            const element = equipmentGrid[i];
            if (!element || !element.item) continue;
            switch (element.item.entityData.type) {
                case EntityData.EntityDataType.Weapon:
                    if (element.item.isAttachment) {
                        this.activeAttachments.push(element.item);
                    } else {
                        this.addWeaponData(element, i)
                    }
                    break;
                case EntityData.EntityDataType.Companion:
                    this.addCompanion(element.item.staticData.id)
                    break;
                case EntityData.EntityDataType.Acessory:
                    this.addStatsModifier(element.item.effectId, element.level)
                    this.activeAcessories.push(element);
                    break;
            }

        }

        if (this.activeAttachments.length) {
            this.activeAttachments.forEach(attachmentData => {
                this.activeWeapons.forEach(weapon => {
                    console.log('THIS',attachmentData, weapon)
                    weapon.addWeaponFromData(attachmentData)
                });
            });
        }
        this.refreshEquipment();

    }
    clearWeapon() {
        for (let index = this.weaponsGameObject.length - 1; index >= 0; index--) {
            if (!this.weaponsGameObject[index].destroyed) {

                this.weaponsGameObject[index].destroy();
            }
        }
        for (let index = this.activeCompanions.length - 1; index >= 0; index--) {
            if (!this.activeCompanions[index].destroyed) {

                this.activeCompanions[index].destroy();
            }
        }
        for (let index = this.weaponLoadingBars.length - 1; index >= 0; index--) {
            if (!this.weaponLoadingBars[index].destroyed) {

                this.weaponLoadingBars[index].destroy();
            }
        }

        this.activeAttachments = [];
        this.weaponLoadingBars = [];
        this.weaponsGameObject = [];
        this.activeCompanions = [];
        this.activeWeapons = [];
        this.refreshEquipment();
    }

    addWeaponData(weaponIngameData, slotID = 0) {
        if (!this.activeWeapons[slotID]) {
            let mainWeapon = new InGameWeapon();
            mainWeapon.addWeapon(weaponIngameData)
            this.addWeapon(mainWeapon, slotID)
        } else {
            this.activeWeapons[slotID].addWeapon(weaponIngameData);
        }
    }
    addWeapon(inGameWeapon, slotID = 0) {
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
        this.activeWeapons[slotID] = inGameWeapon
        this.refreshEquipment();
    }
    refreshEquipment() {

        if (this.sessionData) {
            //find all attributes and add the multipliers here
            this.attributes.multipliers = this.sessionData.attributesMultiplier;
            let normal = this.health.normal;
            this.health.updateMaxHealth(this.attributes.health)
            this.health.health = Math.round(normal * this.attributes.health);

            this.speed = this.attributes.speed;

        }
        this.onUpdateEquipment.dispatch(this);

    }
    onSensorTrigger(element) {
    }
    die() {
        super.die();
        Player.Deaths++;
    }
    damage(value) {
        let def = value - this.attributes.defense;
        def = Math.floor(Math.max(def, 1));
        super.damage(def);
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