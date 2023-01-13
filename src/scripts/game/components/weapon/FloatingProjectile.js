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
    build() {
        super.build();
        this.shootFrequency = 15;
        this.currentProjectile = []
    }

    shoot() {
        super.shoot();

        let total = 5;
        for (let index = 0; index < total; index++) {
            let ang = Math.PI * 2 / total * index;
            let bullet = this.engine.poolGameObject(Bullet)
            bullet.build(15, 250, 0, 5);
    
            bullet.gameView.view.texture = PIXI.Texture.from('hit-g1')
            bullet.gameView.view.scale.set(4)
            bullet.setPosition(this.transform.position.x + this.parent.physics.velocity.x + this.parent.facing * -20, 0, this.transform.position.z);
            bullet.shoot(this.parent.facingAngle, Math.abs(this.parent.physics.velocity.x))
            bullet.gameView.view.alpha = 1;
            bullet.power = 20
    
            this.currentProjectile.push({ angle:ang, projectile: bullet })
            
        }
    }
    removeProjectile(element) {
        this.currentProjectile = this.currentProjectile.filter(item => item.projectile !== element)
    }
    update(delta) {
        super.update(delta);
        this.currentProjectile.forEach(element => {
            element.angle += delta;
            element.projectile.x = this.transform.position.x + Math.cos(element.angle) * 100;
            element.projectile.z = this.transform.position.z + Math.sin(element.angle) * 100;
        });
    }
    destroy(){
        super.destroy();
        this.currentProjectile.forEach(element => {
            element.projectile.destroy();
        });
        this.currentProjectile = []
    }
}