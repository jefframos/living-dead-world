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
            this.interactiveProjectiles.push({ angle: bullet.ang, projectile: bullet })
        });
    }
    removeProjectile(element) {
        this.interactiveProjectiles = this.interactiveProjectiles.filter(item => item.projectile !== element)
    }
    update(delta) {
        super.update(delta);

        this.interactiveProjectiles.forEach(element => {
            element.angle += delta * Math.PI;
            element.projectile.x = this.transform.position.x + Math.cos(element.angle) * 100;
            element.projectile.z = this.transform.position.z + Math.sin(element.angle) * 100;

            if (!element.projectile.enabledAndAlive) {
                this.removeProjectile(element.projectile)
            }
        });
    }
    destroy() {
        super.destroy();
        this.interactiveProjectiles.forEach(element => {
            element.projectile.destroy();
        });
        this.interactiveProjectiles = []
    }
}