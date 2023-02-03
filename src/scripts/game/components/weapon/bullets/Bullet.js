import BaseEnemy from "../../../entity/BaseEnemy";
import BaseWeapon from "../BaseWeapon";
import EffectsManager from "../../../manager/EffectsManager";
import GameManager from "../../../manager/GameManager";
import GameView from "../../../core/view/GameView";
import Layer from "../../../core/Layer";
import PhysicsEntity from "../../../core/physics/PhysicsEntity";
import PhysicsModule from "../../../core/modules/PhysicsModule";
import Player from "../../../entity/Player";
import RenderModule from "../../../core/modules/RenderModule";
import Utils from "../../../core/utils/Utils";
import Vector3 from "../../../core/gameObject/Vector3";
import WeaponAttributes from "../../../data/WeaponAttributes";
import config from "../../../../config";
import signals from "signals";

export default class Bullet extends PhysicsEntity {
    constructor() {
        super();

        this.gameView = new GameView(this)
        this.gameView.view = new PIXI.Sprite()
        this.gameView.view.alpha = 1
        this.hitting = false;
        this.enemiesShot = [];

        this.onSpawn = new signals.Signal;
        this.onDestroy = new signals.Signal;
        this.onDestroyOnHit = new signals.Signal;
        this.onHit = new signals.Signal;
        //   this.setDebug(15)
    }
    build(weapon, parent) {
        super.build()
        this.weapon = weapon;

        console.log('weapon.weaponViewData.baseViewData.targetLayer',weapon.weaponViewData.baseViewData.targetLayer)
        if (weapon.weaponViewData.baseViewData.targetLayer == EffectsManager.TargetLayer.BaseLayer) {
            if (this.gameView.layer != RenderModule.RenderLayers.Default) {

                this.renderModule.swapLayer(this.gameView, RenderModule.RenderLayers.Default)
            }
        } else if (this.gameView.layer != RenderModule.RenderLayers.Gameplay) {
            this.renderModule.swapLayer(this.gameView, RenderModule.RenderLayers.Gameplay)
        }

           //this.setDebug(this.weapon.weaponAttributes.radius)
        this.spawnParent = parent;
        this.safeTimer = 10;

        this.originPosition = parent.transform.position.clone()

        this.resetEvents();

        this.buildCircle(0, 0, this.weapon.weaponAttributes.radius)

        this.hitting = false;

        this.piercing = this.weapon.weaponAttributes.piercing;
        this.forceField = this.weapon.weaponAttributes.forceField;

        this.distanceSpan = 0;
        this.enemiesShot = [];
        this.gameView.view.anchor.set(0.5)

        this.rigidBody.collisionFilter.group = 2
        this.rigidBody.collisionFilter.mask = 3

        this.speed = this.weapon.weaponAttributes.bulletSpeed
        this.power = this.weapon.weaponAttributes.power;

        this.usesTime = this.weapon.weaponAttributes.lifeRangeSpan <= 0;
        this.lifeSpan = this.weapon.weaponAttributes.lifeSpan
        this.distanceSpan = this.weapon.weaponAttributes.lifeRangeSpan;


        this.layerCategory = Layer.Bullet
        this.layerMask = Layer.BulletCollision

        this.rigidBody.isSensor = true

        this.gameView.view.rotation = 0;
        this.gameView.view.alpha = 1;
        this.gameView.view.visible = true;

        this.fromWeapon = this.spawnParent instanceof BaseWeapon

    }
    enable() {
        super.enable();
        this.gameView.view.visible = false
    }
    shoot(ang, magnitude) {
        this.enemiesShot = [];


        this.angle = ang;

        //this.speed += this.speed * magnitude * 0.5
        this.gameView.view.rotation = this.angle + Math.PI / 2


        this.physics.velocity.x = 0
        this.physics.velocity.y = 0
        this.physics.velocity.z = 0

        this.onSpawn.dispatch(this)
    }
    collisionExit(collided) {
        if (this.enemiesShot.filter(item => item.entity == collided).length <= 0) return;
        //console.log(this.enemiesShot.filter(item => item.entity == collided))
        this.enemiesShot = this.enemiesShot.filter(item => item.entity !== collided)

    }
    collisionEnter(collided) {

        if (collided.rigidBody.isSensor) {
            return;
        }
        if (this.enemiesShot.filter(item => item.entity == collided).length > 0) {
            return;
        }
        this.enemiesShot.push({ entity: collided, timer: this.weapon.weaponAttributes.damageOverTime });
        if (false && collided.rigidBody.isStatic) {
            this.destroy()

        } else {
            if (collided.die) {
                collided.damage(this.power);
                this.piercing--;
                this.onHit.dispatch(this);

                if (collided.dying) {

                    // let enemy = GameManager.instance.spawnEnemy()
                    // //this.engine.poolAtRandomPosition(BaseEnemy, true, {minX:50, maxX: config.width, minY:50, maxY:config.height})
                    // let angle = Math.PI * 2 * Math.random();
                    // enemy.x = Player.MainPlayer.transform.position.x + Math.cos(angle) * config.width / 2
                    // enemy.z = Player.MainPlayer.transform.position.z + Math.sin(angle) * config.height / 2
                } else {
                    if (collided.applyForce && this.weapon.weaponAttributes.forceFeedback) {
                        let angle = 0;
                        if (this.forceField && this.fromWeapon) {
                            angle = Math.atan2(collided.transform.position.z - this.weapon.transform.position.z, collided.transform.position.x - this.weapon.transform.position.x);
                        } else {
                            angle = Math.atan2(collided.transform.position.z, collided.transform.position.x);
                        }
                        let forceBack = { x: Math.cos(angle) * this.weapon.weaponAttributes.forceFeedback, y: Math.sin(angle) * this.weapon.weaponAttributes.forceFeedback };
                        collided.applyForce(forceBack)
                    }
                }

                if (this.piercing <= 0) {
                    this.onDestroyOnHit.dispatch(this);
                    this.destroy()
                }
                //this.destroy()
            } else {

                if(!collided.rigidBody.isStatic){

                    this.onDestroyOnHit.dispatch(this);
                    collided.destroy();
                }
            }
            //this.destroy()
        }

        //console.log(this.enemiesShot)
    }
    start() {
        this.physicsModule = this.engine.findByType(PhysicsModule)
        this.renderModule = this.engine.findByType(RenderModule)

    }

    update(delta, unscaleDelta) {
        super.update(delta)
        this.physics.velocity.x = Math.cos(this.angle) * this.speed * delta
        this.physics.velocity.z = Math.sin(this.angle) * this.speed * delta

        this.gameView.view.x = this.transform.position.x
        this.gameView.view.y = this.transform.position.z + this.viewOffset.y


        this.enemiesShot.forEach(element => {
            if (element.entity.enabledAndAlive) {

                if (element.timer <= 0 && element.entity.damage) {
                    element.entity.damage(this.power);
                    element.timer = this.weapon.weaponAttributes.damageOverTime;
                } else {
                    element.timer -= delta;
                }
            }
        });


        if (this.weapon.weaponAttributes.directionType == WeaponAttributes.DirectionType.Hoaming) {
            let closest = GameManager.instance.findClosestEnemy(this.transform.position)
            if (closest) {
                this.smoothAngle(Vector3.atan2XZ(closest.transform.position, this.transform.position), delta)
            }
        }


        if (this.weapon.weaponViewData.baseViewData.rotationSpeed) {
            this.gameView.view.rotation += this.weapon.weaponViewData.baseViewData.rotationSpeed * delta + this.weapon.weaponViewData.baseViewData.angleOffset;
        } else {
            this.gameView.view.rotation = this.transform.angle + Math.PI / 2 + this.weapon.weaponViewData.baseViewData.angleOffset;
        }
        this.gameView.view.visible = true;
        if (!this.usesTime) {

            this.distanceSpan -= this.speed * delta;

            if (this.distanceSpan <= 0) {
                if (this.weapon.weaponAttributes.extendedBehaviour == WeaponAttributes.ExtendedBehaviour.Boomerang) {

                    let targetPosition = this.originPosition

                    if (this.fromWeapon) {
                        targetPosition = this.spawnParent.transform.position;
                    }


                    this.smoothAngle(Vector3.atan2XZ(targetPosition, this.transform.position), delta)


                    this.safeTimer -= delta;
                    if (Vector3.distance(targetPosition, this.transform.position) < this.weapon.weaponAttributes.radius * 2 || this.safeTimer <= 0) {
                        this.destroy()
                    }

                } else {
                    this.destroy()
                }
            }

        } else {
            this.lifeSpan -= delta
            if (this.lifeSpan <= 0) {
                this.destroy()
            }
        }
    }
    smoothAngle(target, delta) {
        let ang = target

        let scale = 1 / 60 / delta;
        scale *= 0.05;
        scale = Math.max(scale, 0.05)
        scale = Math.min(scale, 0.95)
        this.angle = Utils.angleLerp(this.angle, ang, scale);
    }
    destroy() {
        this.onDestroy.dispatch(this);
        super.destroy();
    }
    resetEvents() {
        this.onSpawn.removeAll();
        this.onDestroy.removeAll();
        this.onDestroyOnHit.removeAll();
        this.onHit.removeAll();
    }
}