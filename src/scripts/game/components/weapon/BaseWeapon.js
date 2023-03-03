import AttributeData from "../../data/AttributeData";
import Bullet from "./bullets/Bullet";
import EffectsManager from "../../manager/EffectsManager";
import EntityAttributes from "../../data/EntityAttributes";
import EntityMultipliers from "../../data/EntityMultipliers";
import EntityViewData from "../../data/EntityViewData";
import GameManager from "../../manager/GameManager";
import GameView from "../../core/view/GameView";
import Layer from "../../core/Layer";
import ParticleDescriptor from "../particleSystem/ParticleDescriptor";
import PhysicsEntity from "../../core/physics/PhysicsEntity";
import Player from "../../entity/Player";
import SpriteSheetGameView from "../SpriteSheetGameView";
import Utils from "../../core/utils/Utils";
import Vector3 from "../../core/gameObject/Vector3";
import WeaponAttributes from "../../data/WeaponAttributes";
import WeaponData from "../../data/WeaponData";
import WeaponInGameView from "./WeaponInGameView";

export default class BaseWeapon extends PhysicsEntity {
    constructor() {
        super();

        this.interactiveProjectiles = []
        this.activeProjectiles = []
        this.currentEnemiesColliding = []
        this.currentShootTimer = 0;
        this.realShootTimer = 0;
        this.alternateFacing = 1;
        this.bulletAccum = 0;
        this.weaponData = null;
        this.brustFire = { amount: 0, interval: 0 };

        this.gameView = new GameView(this);
        this.gameView.view = new PIXI.Sprite();

        this.attributesMultiplier = new EntityMultipliers();

    }
    getClosestEnemy(from, distanceLimit = 999999) {
        let target = from ? from.transform : this.transform
        let shootAngle = 0;
        let closest = GameManager.instance.findClosestEnemy(target.position) || this
        if (closest != this && Vector3.distance(closest.transform.position, this.transform.position) > distanceLimit) {
            closest = this;
        }
        shootAngle = Math.atan2(closest.transform.position.z - target.position.z, closest.transform.position.x - target.position.x)
        return { enemy: closest, angle: shootAngle }
    }
    static getFacing(currentWeapon, customTransform, alternate) {
        let facing = 1;
        if (currentWeapon.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingPlayer) {
            facing = customTransform.facing;
        } else if (currentWeapon.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingAlternated) {
            facing = alternate;
        } else if (currentWeapon.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingBackwards) {
            facing = -customTransform.facing;
        } else if (currentWeapon.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.ParentAngle) {
            facing = 1;
        }

        return facing;
    }
    static getFacingAngle(currentWeapon, customTransform, alternate) {
        let facing = customTransform.physics.angle;
        if (currentWeapon.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingPlayer) {
            facing = customTransform.facingAngle;
        } else if (currentWeapon.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingAlternated) {
            facing = alternate * Math.PI;
        } else if (currentWeapon.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.FacingBackwards) {
            facing = customTransform.facingAngle + Math.PI;
        }
        else if (currentWeapon.weaponAttributes.baseDirectionType == WeaponAttributes.DirectionType.ParentAngle) {
            if (customTransform.originWeapon) {
                facing = Vector3.atan2XZ(customTransform.transform.position, customTransform.originWeapon.transform.position);
            } else {
                if (customTransform.physics.magnitude > 0) {
                    facing = customTransform.physics.angle;
                } else {
                    facing = customTransform.facingAngle;
                }
            }
        }
        return facing;
    }
    resetBrust() {
        this.brustFire.amount = this.weaponData.weaponAttributes.brustFireAmount;
        this.brustFire.interval = this.weaponData.weaponAttributes.brustFireInterval;
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
        
        if( this.parent instanceof  Player){
            this.attributesMultiplier = this.parent.sessionData.attributesMultiplier;
        }else{
            this.attributesMultiplier.reset();
        }

        weaponData.addMultiplier(this.attributesMultiplier);

        if (this.weaponData.ingameViewDataStatic.ingameIcon) {
            //poolGameObject
            this.inGameView = this.engine.poolGameObject(WeaponInGameView);
            this.inGameView.setContainer(this.gameView.view);
            this.inGameView.setData(this.weaponData, this);
            this.addChild(this.inGameView)
        }else{
            this.inGameView = null;
        }

        this.resetBrust();
        this.shootFrequency = this.weaponData.weaponAttributes.frequency;
        console.log( this.shootFrequency)
        this.currentShootTimer = this.shootFrequency * 0.5 + 0.1;
        this.realShootTimer = this.currentShootTimer;
        this.buildCircle(0, 0, this.weaponData.weaponAttributes.detectionZone)
        //this.setDebug(this.weaponData.weaponAttributes.detectionZone)

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
    calcShootAngle() {

    }
    shoot(customWeapon, customParent) {

        let weapon = customWeapon ? customWeapon : this.weaponData
        let parentGameObject = customParent ? customParent : this
        let isMain = parentGameObject == this;

        if (!isMain && weapon.onFixedDestroyWeapon.length) {

            let temp = weapon.onFixedDestroyWeapon[0]
            temp.onDestroyWeapon = weapon.onDestroyWeapon;
            weapon = temp;
        }
        weapon.weaponAttributes.isMain = isMain;
        if (!customWeapon) {
            if (this.brustFire.amount > 0) {
                this.currentShootTimer = this.brustFire.interval;
                this.brustFire.amount--;
                if (this.brustFire.amount <= 0) {
                    this.currentShootTimer = this.shootFrequency;
                    this.resetBrust();
                }
                this.realShootTimer = 0;
            } else {
                this.currentShootTimer = this.shootFrequency;

                this.realShootTimer = this.currentShootTimer;
            }
            this.alternateFacing *= -1;
        }

        let gunDistance = weapon.weaponAttributes.spawnDistance;

        let total = weapon.weaponAttributes.amount;

        let spawnedBullets = []
        for (let index = 0; index < total; index++) {
            let ang = Math.PI * 2 / total * index;

            let bullet = this.engine.poolGameObject(weapon.bulletBehaviourComponent)
            bullet.spawnAngle = ang;
            bullet.build(weapon, parentGameObject);
            bullet.originWeapon = this;

            bullet.onSpawn.add(this.spawnBullet.bind(this))
            bullet.onDestroy.add(this.destroyBullet.bind(this))
            bullet.onDestroyOnHit.add(this.destroyBulletOnHit.bind(this))
            bullet.onHit.add(this.hitBullet.bind(this))


            bullet.spawnOrder = index;

            let facing = 0
            let halfAngle = weapon.weaponAttributes.angleOffset * index - (weapon.weaponAttributes.angleOffset * (total - 1) / 2)

            let angleNoise = Math.random() * weapon.weaponAttributes.angleNoise - weapon.weaponAttributes.angleNoise * 0.5
            if (weapon.weaponAttributes.directionType == WeaponAttributes.DirectionType.AngularSequence) {
                let targetAngle = this.bulletAccum * weapon.weaponAttributes.angleOffset

                if (!isMain) {
                    targetAngle = parentGameObject.angle;
                }

                bullet.setPosition(parentGameObject.transform.position.x + this.parent.physics.velocity.x + Math.cos(targetAngle) * gunDistance, 0, parentGameObject.transform.position.z + Math.sin(targetAngle) * gunDistance);
                bullet.shoot(targetAngle + angleNoise + halfAngle, this.physics.magnitude)

            } else if (weapon.weaponAttributes.directionType == WeaponAttributes.DirectionType.Random) {

                let rndAng = Math.random() * Math.PI * 2
                bullet.setPosition(parentGameObject.transform.position.x + Math.cos(rndAng) * gunDistance, 0, parentGameObject.transform.position.z + Math.sin(rndAng) * gunDistance);
                bullet.shoot(rndAng, 0)

            } else if (weapon.weaponAttributes.directionType == WeaponAttributes.DirectionType.ClosestEnemySnap) {
                let closestEnemy = this.getClosestEnemy(parentGameObject, weapon.weaponAttributes.detectionZone || 100)
                bullet.setPosition(closestEnemy.enemy.transform.position.x, 0, closestEnemy.enemy.transform.position.z);
                bullet.shoot(0, 0)

            } else if (weapon.weaponAttributes.directionType == WeaponAttributes.DirectionType.ClosestEnemy) {
                let closestEnemy = this.getClosestEnemy(parentGameObject)//Math.random() * Math.PI * 2//
                let angle = Math.random() * Math.PI * 2;
                if (closestEnemy.enemy) {
                    angle = closestEnemy.angle;
                }
                bullet.setPosition(parentGameObject.transform.position.x + this.parent.physics.velocity.x + Math.cos(angle) * gunDistance, 0, parentGameObject.transform.position.z + Math.sin(angle) * gunDistance);
                bullet.shoot(angle + angleNoise, this.physics.magnitude)

            } else if (weapon.weaponAttributes.extendedBehaviour == WeaponAttributes.ExtendedBehaviour.Boomerang) {
                bullet.setPosition(parentGameObject.transform.position.x + this.parent.physics.velocity.x + -facing * gunDistance, 0, parentGameObject.transform.position.z);
                let facingAng = BaseWeapon.getFacingAngle(weapon, parentGameObject, this.alternateFacing);

                if (!isMain) {
                    facingAng = parentGameObject.angle;
                }

                bullet.shoot(facingAng + halfAngle + angleNoise + weapon.weaponAttributes.angleStart, Math.abs(this.parent.physics.velocity.x))
            } else {
                bullet.setPosition(parentGameObject.transform.position.x + this.parent.physics.velocity.x + -facing * gunDistance, 0, parentGameObject.transform.position.z);
                let facingAng = BaseWeapon.getFacingAngle(weapon, parentGameObject, this.alternateFacing);

                if (!isMain) {
                    facingAng = parentGameObject.angle;
                }

                let finalAng = facingAng + angleNoise + halfAngle;
                if (weapon.weaponAttributes.extendedBehaviour == WeaponAttributes.DirectionType.FacingBackwards) {
                    finalAng += Math.PI;
                }

                if (weapon.weaponAttributes.directionType == WeaponAttributes.DirectionType.SameParentPosition) {
                    gunDistance = 0;
                }

                bullet.setPosition(parentGameObject.transform.position.x + this.parent.physics.velocity.x + -facing * gunDistance + Math.cos(finalAng) * gunDistance, 0, parentGameObject.transform.position.z + Math.sin(finalAng) * gunDistance);
                bullet.shoot(finalAng + weapon.weaponAttributes.angleStart, Math.abs(this.parent.physics.velocity.x))
            }

            if (!customParent) {
                this.bulletAccum++;
            }
            spawnedBullets.push(bullet)
            this.activeProjectiles.push(bullet)

            if (isMain && this.inGameView) {
                this.inGameView.updateBullets(spawnedBullets);
            }


        }
        return spawnedBullets
    }

    update(delta) {

        this.x = this.parent.transform.position.x
        this.z = this.parent.transform.position.z

        if (this.inGameView) {
            this.inGameView.update(delta)
        }

        if (this.debug) {
            this.debug.x = this.transform.position.x
            this.debug.y = this.transform.position.z
        }

        if (this.currentShootTimer > 0) {
            this.currentShootTimer -= delta;
        } else {
            this.shoot();
        }


        if (this.brustFire.amount == this.weaponData.weaponAttributes.brustFireAmount) {
            this.realShootTimer = this.currentShootTimer;
        }

        for (let index = this.activeProjectiles.length - 1; index >= 0; index--) {
            const bullet = this.activeProjectiles[index];
            if (!bullet || !bullet.enabledAndAlive) {
                this.activeProjectiles.splice(index, 1);
            }

        }
    }
    get shootNormal() {
        return 1 - this.realShootTimer / this.shootFrequency;
    }
    get shootNormalWithBrust() {
        return 1 - this.currentShootTimer / this.shootFrequency;
    }
    destroy() {
        super.destroy();
        this.activeProjectiles = [];

    }

    spawnBullet(bullet) {

        this.sortGraphics('baseSpawnViewData', bullet, bullet.weapon)
        this.sortGraphics('baseViewData', bullet, bullet.weapon)

    }
    destroyBullet(bullet) {
        this.sortGraphics('baseDestroyViewData', bullet, bullet.weapon)

        if (bullet.weapon.onDestroyWeapon.length) {
            for (let index = 0; index < bullet.weapon.onDestroyWeapon.length; index++) {
                const element = bullet.weapon.onDestroyWeapon[index];
                let bullets = this.shoot(element, bullet)

            }
        }

        if (bullet.weapon.onFixedDestroyWeapon.length) {
            for (let index = 0; index < bullet.weapon.onFixedDestroyWeapon.length; index++) {
                const element = bullet.weapon.onFixedDestroyWeapon[index];
                let bullets = this.shoot(element, bullet)

            }
        }

    }
    destroyBulletOnHit(bullet) {
        // console.log("destroyBulletOnHit")

    }
    hitBullet(bullet) {
        //console.log("hitBullet")
    }

    sortGraphics(type, bullet, customWeapon) {

        let weapon = customWeapon ? customWeapon : this.weaponData

        let isMain = weapon == this.weaponData;

        //TODO: ADD OPTION TO GET THE TRANSFORM ANGLE FOR THE SPRITESHEET
        let baseData = weapon.weaponViewData[type]
        if (baseData.viewType == EntityViewData.ViewType.SpriteSheet) {

            let target = bullet.transform.position
            let scale = 1;
            if (baseData.fitRadius) {
                let length = weapon.weaponAttributes.radius * 2;
                if (baseData.viewData instanceof ParticleDescriptor) {
                    scale = Math.min(length / baseData.width, length / baseData.height) * baseData.scale
                } else {
                    scale = Math.min(length / bullet.gameView.view.width * bullet.gameView.view.scale.x, length / bullet.gameView.view.height * bullet.gameView.view.scale.y)
                }
            }
            let targetAngle = baseData.lockRotation ? 0 : bullet.angle;
            if (baseData.movementType == EntityViewData.MovementType.Follow) {
                let spriteSheet = bullet.addComponent(SpriteSheetGameView);
                spriteSheet.setDescriptor(baseData.viewData, { rotation: targetAngle, scale: { x: scale, y: scale }, viewOffset: {x:baseData.viewOffset.x, y:baseData.viewOffset.y}, color: baseData.color ? baseData.color : 0xFFFFFF })
            } else {
                EffectsManager.instance.emitParticles(
                    { x: target.x + baseData.viewOffset.x, y: target.z + baseData.viewOffset.y }, baseData.viewData, 1, { rotation: targetAngle, scale: { x: scale, y: scale }, tint: baseData.color ? baseData.color : 0xFFFFFF }, baseData.targetLayer)
            }

        } else if (baseData.viewType == EntityViewData.ViewType.Sprite) {
            bullet.gameView.view.alpha = baseData.alpha;
            bullet.gameView.view.tint = baseData.color ? baseData.color : 0xFFFFFF;
            bullet.gameView.view.texture = PIXI.Texture.from(weapon.weaponViewData.viewData)
            bullet.gameView.viewOffset.y = baseData.viewOffset.y

            let maxWidth = Math.min(baseData.maxWidth, weapon.weaponAttributes.radius * baseData.scale * 2)
            let scale = Utils.scaleToFit(bullet.gameView.view, maxWidth)
            bullet.gameView.view.scale.set(scale)
        }
    }

    get facing() {
        return this.parent.facing
    }

    get facingAngle() {
        return this.parent.facingAngle
    }
}