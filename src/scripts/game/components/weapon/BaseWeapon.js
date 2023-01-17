import Bullet from "./bullets/Bullet";
import EffectsManager from "../../manager/EffectsManager";
import EntityViewData from "../../data/EntityViewData";
import Layer from "../../core/Layer";
import PhysicsEntity from "../../core/physics/PhysicsEntity";
import Utils from "../../core/utils/Utils";
import Vector3 from "../../core/gameObject/Vector3";
import WeaponAttributes from "../../data/WeaponAttributes";
import WeaponData from "../../data/WeaponData";

export default class BaseWeapon extends PhysicsEntity {
    constructor() {
        super();

        this.interactiveProjectiles = []
        this.activeProjectiles = []
        this.currentEnemiesColliding = []
        this.currentShootTimer = 0;
        this.alternateFacing = 1;
        this.bulletAccum = 0;
        this.weaponData = null;

    }
    getClosestEnemy() {

        let shootAngle = 0;
        let first = null;
        if (this.currentEnemiesColliding.length) {

            Utils.collidingDistSort(this.transform.position, this.currentEnemiesColliding)
            //let first = this.currentEnemiesColliding[Math.floor(Math.random() * this.currentEnemiesColliding.length)].transform.position
            first = this.currentEnemiesColliding[0].entity

            shootAngle = Math.atan2(first.transform.position.z - this.transform.position.z, first.transform.position.x - this.transform.position.x)
        }

        return { enemy: first, angle: shootAngle }
    }
    getFacing() {
        let facing = 1;
        if (this.weaponData.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingPlayer) {
            facing = this.parent.facing;
        } else if (this.weaponData.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingAlternated) {
            facing = this.alternateFacing;
        } else if (this.weaponData.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingBackwards) {
            facing = -this.parent.facing;
        }

        return facing;
    }
    getFacingAngle() {
        let facing = 0;
        if (this.weaponData.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingPlayer) {
            facing = this.parent.facingAngle;
        } else if (this.weaponData.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingAlternated) {
            facing = this.alternateFacing * Math.PI;
        } else if (this.weaponData.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingBackwards) {
            facing = this.parent.facingAngle + Math.PI;
        }

        return facing;
    }
    build(weaponData) {
        super.build();

        this.interactiveProjectiles = [];
        this.activeProjectiles = [];

        if (weaponData) {
            this.weaponData = weaponData;
        } else {
            this.weaponData = new WeaponData();
        }

        this.shootFrequency = this.weaponData.weaponAttributes.frequency;

        this.buildCircle(0, 0, this.weaponData.weaponAttributes.detectionZone)
        this.setDebug(this.weaponData.weaponAttributes.detectionZone)

        this.rigidBody.isSensor = true;

        this.layerCategory = Layer.Sensor
        this.layerMask = Layer.Enemy - Layer.Player// &! Layer.Environment
    }
    findInCollision(entity) {
        for (let index = 0; index < this.currentEnemiesColliding.length; index++) {
            if (this.currentEnemiesColliding[index].entity == entity) {
                return true;
            }
        }
        return false;
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
        this.currentShootTimer = 0;
        this.alternateFacing *= -1;


        let total = this.weaponData.weaponAttributes.amount;
        let spawnedBullets = []
        for (let index = 0; index < total; index++) {
            let ang = Math.PI * 2 / total * index;

            let bullet = this.engine.poolGameObject(Bullet)
            bullet.build(this.weaponData);

            bullet.onSpawn.add(this.spawnBullet.bind(this))
            bullet.onDestroy.add(this.destroyBullet.bind(this))
            bullet.onDestroyOnHit.add(this.destroyBulletOnHit.bind(this))
            bullet.onHit.add(this.hitBullet.bind(this))

            bullet.ang = ang;
            let facing = this.getFacing();
            let facingAng = this.getFacingAngle();
            let halfAngle = this.weaponData.weaponAttributes.angleOffset * index - (this.weaponData.weaponAttributes.angleOffset * total) / 2

            if (this.weaponData.weaponAttributes.directionType == WeaponAttributes.DirectionType.AngularSequence) {
                let targetAngle = this.bulletAccum * this.weaponData.weaponAttributes.angleOffset
                bullet.shoot(targetAngle + Math.random() * this.weaponData.weaponAttributes.angleNoise - this.weaponData.weaponAttributes.angleNoise * 0.5 + halfAngle, this.physics.magnitude)
                bullet.setPosition(this.transform.position.x + this.parent.physics.velocity.x + Math.cos(targetAngle) * 20, 0, this.transform.position.z + Math.sin(targetAngle) * 20);

            } else if (this.weaponData.weaponAttributes.directionType == WeaponAttributes.DirectionType.ClosestEnemy) {
                let closest = this.getClosestEnemy()
                bullet.shoot(closest.angle + Math.random() * this.weaponData.weaponAttributes.angleNoise - this.weaponData.weaponAttributes.angleNoise * 0.5 + halfAngle, this.physics.magnitude)
                bullet.setPosition(this.transform.position.x + this.parent.physics.velocity.x + Math.cos(closest.angle) * 20, 0, this.transform.position.z + Math.sin(closest.angle) * 20);

            } else {
                bullet.setPosition(this.transform.position.x + this.parent.physics.velocity.x + -facing * 20, 0, this.transform.position.z);
                bullet.shoot(facingAng + halfAngle, Math.abs(this.parent.physics.velocity.x))
            }
            this.bulletAccum++;
            spawnedBullets.push(bullet)
            this.activeProjectiles.push(bullet)
        }
        return spawnedBullets
    }

    update(delta) {

        this.x = this.parent.transform.position.x
        this.z = this.parent.transform.position.z

        this.debug.x = this.transform.position.x
        this.debug.y = this.transform.position.z

        if (this.currentShootTimer < this.shootFrequency) {
            this.currentShootTimer += delta;
        } else {
            if (this.weaponData.weaponAttributes.directionType == WeaponAttributes.DirectionType.ClosestEnemy) {
                if (this.currentEnemiesColliding.length <= 0) {
                    return;
                }
            }
            this.shoot();
        }


        for (let index = this.activeProjectiles.length - 1; index >= 0; index--) {
            const bullet = this.activeProjectiles[index];
            if (!bullet || !bullet.enabledAndAlive) {
                this.activeProjectiles.splice(index, 1);
            }

        }
    }
    destroy() {
        super.destroy();
        this.activeProjectiles = [];
    }

    spawnBullet(bullet) {

        this.sortGraphics('baseSpawnViewData', bullet)
        this.sortGraphics('baseViewData', bullet)

    }
    destroyBullet(bullet) {
        //console.log("destroyBullet")
        this.sortGraphics('baseDestroyViewData', bullet)

    }
    destroyBulletOnHit(bullet) {
        // console.log("destroyBulletOnHit")

    }
    hitBullet(bullet) {
        //console.log("hitBullet")
    }

    sortGraphics(type, bullet) {

        //ADD OPTION TO GET THE TRANSFORM ANGLE FOR THE SPRITESHEET
        let baseData = this.weaponData.weaponViewData[type]
        if (baseData.viewType == EntityViewData.ViewType.SpriteSheet) {

            let facing = this.getFacing();
            let targetScale = baseData.faceOrientation ? { x: -facing, y: 1 } : { x: 1, y: 1 }
            let target = Vector3.sum(bullet.transform.position, Vector3.mult(baseData.offset, new Vector3(-facing, 1, 1)));
           
            EffectsManager.instance.emitParticles(
                { x: target.x, y: target.z }, baseData.viewData, 1, { scale: targetScale })

        }else if (baseData.viewType == EntityViewData.ViewType.Sprite) {
            bullet.gameView.view.alpha = baseData.alpha;
            bullet.gameView.view.texture = PIXI.Texture.from(this.weaponData.weaponViewData.viewData)
            bullet.gameView.viewOffset.y = baseData.offset.y     
            
            let scale = Math.min(this.weaponData.weaponAttributes.radius / bullet.gameView.view.width, this.weaponData.weaponAttributes.radius / bullet.gameView.view.height)
            bullet.gameView.view.scale.set(scale * bullet.gameView.view.scale.x * baseData.scale)
        }
    }
}