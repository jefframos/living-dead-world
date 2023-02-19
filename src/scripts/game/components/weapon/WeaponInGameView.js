import BaseBarView from '../ui/progressBar/BaseBarView';
import BaseComponent from '../../core/gameObject/BaseComponent';
import BaseWeapon from './BaseWeapon';
import Eugine from '../../core/Eugine';
import GameObject from '../../core/gameObject/GameObject';
import GameView from '../../core/view/GameView';
import Spring from '../../core/utils/Spring';
import Utils from '../../core/utils/Utils';
import WeaponAttributes from '../../data/WeaponAttributes';
import signals from 'signals';

export default class WeaponInGameView extends GameObject {
    constructor() {
        super();
        this.spriteList = [];

        this.gameView = new GameView(this)
        this.gameView.view = new PIXI.Container()
        this.currentBulletList = []

        this.offset = { x: 0, y: 0 }
        this.viewOffset = { x: 0, y: 0 }
    }
    enable() {
        super.enable();
    }
    setContainer(container) {
        this.container = this.gameView.view//container;
    }
    setData(weapon, parent) {
        this.parent = parent;
        this.weapon = weapon;

        let amount = weapon.ingameViewDataStatic.ingameAmountIconOverrider >= 0 ? weapon.ingameViewDataStatic.ingameAmountIconOverrider : weapon.weaponAttributes.amount;

        this.loadBars = [];

        for (var i = 0; i < amount; i++) {
            let sprite = new PIXI.Sprite.from(weapon.ingameViewDataStatic.ingameIcon);
            sprite.anchor.x = weapon.ingameViewDataStatic.anchor.x || 0.5;
            sprite.anchor.y = weapon.ingameViewDataStatic.anchor.y || 0.1;
            sprite.scale.set(Utils.scaleToFit(sprite, weapon.ingameViewDataStatic.ingameBaseWidth || 30))
            this.container.addChild(sprite)
            
            let spring = new Spring()
            spring.default = sprite.scale.y;
            spring.x = sprite.scale.y;
            spring.tx = sprite.scale.y;
            sprite.visible = false;
            this.spriteList.push({ sprite, angle: 0, targetAngle: 0, spring })
            
            let bar = new BaseBarView();
            sprite.addChild(bar)
            bar.build(8,2,0)
            bar.rotation = Math.PI / 2
            bar.y = 0//30//sprite.anchor.y * sprite.height
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
            spriteElement.spring.x = 0.5 * spriteElement.spring.default;
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
            if (this.weapon.ingameViewDataStatic.inGameRotation) {
                element.sprite.rotation += delta * this.weapon.ingameViewDataStatic.inGameRotation
            } else {
                element.sprite.rotation = element.angle + Math.PI / 2
            }

            
            let yScale = element.sprite.rotation < 0 ? -1 : 1
            element.sprite.scale.y = element.spring.x// * yScale;
            element.sprite.scale.x = (element.spring.x * 0.2 + element.spring.default * 0.8) * yScale;
            
            element.sprite.x = Math.cos(element.angle) * 40 + this.offset.x
            element.sprite.y = Math.sin(element.angle) * 40 + this.offset.y
            let radToAng = ((element.sprite.rotation) * 180 / Math.PI) % 360;
            
            if(radToAng < 270 && radToAng > 90){
                this.z = this.parent.transform.position.z + 3;
            }else{
                this.z = this.parent.transform.position.z - 3;

            }
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