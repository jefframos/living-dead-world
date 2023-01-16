import Bullet from "./bullets/Bullet";
import Layer from "../../core/Layer";
import PhysicsEntity from "../../core/physics/PhysicsEntity";
import Utils from "../../core/utils/Utils";
import WeaponAttributes from "../../data/WeaponAttributes";

export default class BaseWeapon extends PhysicsEntity {
    constructor() {
        super();

        this.currentProjectile = []
        this.currentEnemiesColliding = []
        this.currentShootTimer = 0;
        this.alternateFacing = 1;
        this.bulletAccum = 0;


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
        let facing = 0;
        if (this.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingPlayer) {
            facing = this.parent.facing;
        } else if (this.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingAlternated) {
            facing = this.alternateFacing;
        } else if (this.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingBackwards) {
            facing = -this.parent.facing;
        }

        return facing;
    }
    getFacingAngle() {
        let facing = 0;
        if (this.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingPlayer) {
            facing = this.parent.facingAngle;
        } else if (this.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingAlternated) {
            facing = this.alternateFacing * Math.PI;
        } else if (this.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingBackwards) {
            facing = this.parent.facingAngle + Math.PI;
        }

        return facing;
    }
    build(weaponAttributes) {
        super.build();
        if (weaponAttributes) {
            this.weaponAttributes = weaponAttributes;
        } else {
            this.weaponAttributes = new WeaponAttributes();
        }
        this.shootFrequency = this.weaponAttributes.frequency;

        this.buildCircle(0, 0, this.weaponAttributes.detectionZone)
        this.setDebug(this.weaponAttributes.detectionZone)

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


        let total = this.weaponAttributes.amount;
        let spawnedBullets = []
        for (let index = 0; index < total; index++) {
            let ang = Math.PI * 2 / total * index;

            let bullet = this.engine.poolGameObject(Bullet)
            bullet.build(this.weaponAttributes);
            bullet.ang = ang;
            let facing = this.getFacing();
            let facingAng = this.getFacingAngle();
            let halfAngle = this.weaponAttributes.angleOffset * index - (this.weaponAttributes.angleOffset * total) / 2

            if (this.weaponAttributes.directionType == WeaponAttributes.DirectionType.AngularSequence) {
                let targetAngle = this.bulletAccum * this.weaponAttributes.angleOffset
                bullet.shoot(targetAngle + Math.random() * this.weaponAttributes.angleNoise - this.weaponAttributes.angleNoise * 0.5 + halfAngle, this.physics.magnitude)
                bullet.setPosition(this.transform.position.x + this.parent.physics.velocity.x + Math.cos(targetAngle) * 20, 0, this.transform.position.z + Math.sin(targetAngle) * 20);

            } else if (this.weaponAttributes.directionType == WeaponAttributes.DirectionType.ClosestEnemy) {
                let closest = this.getClosestEnemy()
                bullet.shoot(closest.angle + Math.random() * this.weaponAttributes.angleNoise - this.weaponAttributes.angleNoise * 0.5 + halfAngle, this.physics.magnitude)
                bullet.setPosition(this.transform.position.x + this.parent.physics.velocity.x + Math.cos(closest.angle) * 20, 0, this.transform.position.z + Math.sin(closest.angle) * 20);

            } else {
                bullet.setPosition(this.transform.position.x + this.parent.physics.velocity.x + -facing * 20, 0, this.transform.position.z);
                bullet.shoot(facingAng + halfAngle, Math.abs(this.parent.physics.velocity.x))
            }
            this.bulletAccum ++;
            spawnedBullets.push(bullet)
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
            if (this.weaponAttributes.directionType == WeaponAttributes.DirectionType.ClosestEnemy) {
                if (this.currentEnemiesColliding.length <= 0) {
                    return;
                }
            }
            this.shoot();
        }
    }
}