import BaseWeapon from "./BaseWeapon";
import Bullet from "./bullets/Bullet";
import EffectsManager from "../../manager/EffectsManager";
import Layer from "../../core/Layer";
import ParticleDescriptor from "../particleSystem/ParticleDescriptor";
import SpriteSheetBehaviour from "../particleSystem/particleBehaviour/SpriteSheetBehaviour";

export default class FloatingProjectile extends BaseWeapon {
    constructor() {
        super();
    }


    shoot() {
        let bullets = super.shoot();

        bullets.forEach(bullet => {
            bullet.gameView.view.texture = PIXI.Texture.from('hit-g1')
            bullet.gameView.view.scale.set(4)
            this.currentProjectile.push({ angle: bullet.ang, projectile: bullet })

        });
        // let total = this.weaponAttributes.amount;
        // for (let index = 0; index < total; index++) {
        //     let ang = Math.PI * 2 / total * index;
        //     let bullet = this.engine.poolGameObject(Bullet)
        //     bullet.build(this.weaponAttributes);

        //     bullet.name = 'floating'
        //     bullet.gameView.view.texture = PIXI.Texture.from('hit-g1')
        //     bullet.gameView.view.scale.set(4)
        //     bullet.setPosition(this.transform.position.x + this.parent.physics.velocity.x + this.parent.facing * -20, 0, this.transform.position.z);
        //     bullet.shoot(this.parent.facingAngle, Math.abs(this.parent.physics.velocity.x))
        //     bullet.gameView.view.alpha = 1;

        //     this.currentProjectile.push({ angle: ang, projectile: bullet })

        // }
    }
    removeProjectile(element) {
        this.currentProjectile = this.currentProjectile.filter(item => item.projectile !== element)
    }
    update(delta) {
        super.update(delta);

        this.currentProjectile.forEach(element => {
            element.angle += delta * Math.PI;
            element.projectile.x = this.transform.position.x + Math.cos(element.angle) * 100;
            element.projectile.z = this.transform.position.z + Math.sin(element.angle) * 100;

            if (element.projectile.destroyed) {
                this.removeProjectile(element.projectile)
            }
        });
    }
    destroy() {
        super.destroy();
        this.currentProjectile.forEach(element => {
            element.projectile.destroy();
        });
        this.currentProjectile = []
    }
}