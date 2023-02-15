import BaseComponent from '../../core/gameObject/BaseComponent';
import BaseWeapon from './BaseWeapon';
import Eugine from '../../core/Eugine';
import Spring from '../../core/utils/Spring';
import Utils from '../../core/utils/Utils';
import WeaponAttributes from '../../data/WeaponAttributes';
import signals from 'signals';

export default class WeaponInGameView extends BaseComponent {
    constructor() {
        super();
        this.spriteList = [];

        this.currentBulletList = []

        this.offset = { x: 0, y: 0 }
    }
    enable() {
        super.enable();
    }
    setContainer(container) {
        this.container = container;
    }
    setData(weapon, parent) {
        this.parent = parent;
        this.weapon = weapon;

        let amount = weapon.ingameAmountIconOverrider >= 0 ? weapon.ingameAmountIconOverrider : weapon.weaponAttributes.amount;
        for (var i = 0; i < amount; i++) {
            let sprite = new PIXI.Sprite.from(this.weapon.ingameIcon);
            sprite.anchor.set(0.5)
            sprite.scale.set(Utils.scaleToFit(sprite, 15))
            this.container.addChild(sprite)

            let spring = new Spring()
            spring.default = sprite.scale.y;
            spring.x = sprite.scale.y;
            spring.tx = sprite.scale.y;
            sprite.visible = false;
            this.spriteList.push({ sprite, angle: 0, targetAngle: 0, spring })

        }

        this.offset.x = this.weapon.weaponViewData.baseViewData.viewOffset.x || this.weapon.weaponViewData.baseSpawnViewData.viewOffset.x
        this.offset.y = this.weapon.weaponViewData.baseViewData.viewOffset.y || this.weapon.weaponViewData.baseSpawnViewData.viewOffset.y


    }
    updateBullets(bulletList) {
        this.currentBulletList = bulletList;
        for (let index = 0; index < this.currentBulletList.length; index++) {
            if (index >= this.spriteList.length) continue;
            const element = this.currentBulletList[index];
            const spriteElement = this.spriteList[index];
            spriteElement.targetAngle = element.angle;
            spriteElement.spring.x = 0.15 * spriteElement.spring.default;
            spriteElement.spring.tx = spriteElement.spring.default;

            spriteElement.sprite.visible = true;
        }
    }
    calcAngle() {
        if (this.weapon.weaponAttributes.directionType == WeaponAttributes.DirectionType.ParentAngle) {
            const totalBullets = this.spriteList.length;
            for (let index = 0; index < totalBullets; index++) {
                let facingAng = BaseWeapon.getFacingAngle(this.weapon, this.parent, this.alternateFacing);

                let halfAngle = this.weapon.weaponAttributes.angleOffset * index - (this.weapon.weaponAttributes.angleOffset * (totalBullets - 1) / 2)

                let finalAng = facingAng + halfAngle;
                if (this.weapon.weaponAttributes.extendedBehaviour == WeaponAttributes.DirectionType.FacingBackwards) {
                    finalAng += Math.PI;
                }
                let ang = finalAng + this.weapon.weaponAttributes.angleStart;

                this.spriteList[index].targetAngle = ang;
            }
        }
    }
    update(delta) {
        delta *= Eugine.PhysicsTimeScale;
        for (let index = 0; index < this.currentBulletList.length; index++) {
            if (index >= this.spriteList.length) continue;

            const element = this.currentBulletList[index];
            const spriteElement = this.spriteList[index];
            spriteElement.targetAngle = element.angle;
        }
        this.calcAngle();
        //console.log(this.parent.shootNormal)
        this.spriteList.forEach(element => {
            element.angle = Utils.angleLerp(element.angle, element.targetAngle, 0.2);
            element.spring.update()
            if (this.weapon.inGameRotation) {
                element.sprite.rotation += delta * this.weapon.inGameRotation
            } else {
                element.sprite.rotation = element.angle + Math.PI / 2
            }
            element.sprite.scale.y = element.spring.x;
            element.sprite.scale.x = element.spring.x * 0.5 + element.spring.default * 0.5;

            element.sprite.x = Math.cos(element.angle) * 20 + this.offset.x
            element.sprite.y = Math.sin(element.angle) * 20 + this.offset.y
        });
    }
    destroy() {
        super.destroy();

        this.spriteList.forEach(element => {
            if (element.sprite.parent) {
                element.sprite.parent.removeChild(element.sprite);
            }
        });

        this.spriteList = [];
    }
}