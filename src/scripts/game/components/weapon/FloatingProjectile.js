import BaseWeapon from "./BaseWeapon";

export default class FloatingProjectile extends BaseWeapon {
    constructor() {
        super();
    }


    shoot(customWeapon, customParent) {
        let bullets = super.shoot(customWeapon, customParent);

        bullets.forEach(bullet => {
            if (bullet.weapon == this.weaponData) {
                this.interactiveProjectiles.push({ angle: bullet.ang, projectile: bullet })
                bullet.physics.velocity.x = 0
                bullet.physics.velocity.y = 0
                bullet.physics.velocity.z = 0
            }
        });

        return bullets
    }
    removeProjectile(element) {
        if (element.projectile && element.projectile.enabledAndAlive) {
            element.projectile.destroy();
        }
        this.interactiveProjectiles = this.interactiveProjectiles.filter(item => item.projectile !== element)
    }
    update(delta) {
        super.update(delta);

        for (let i = this.interactiveProjectiles.length - 1; i >= 0; i--) {
            let element = this.interactiveProjectiles[i];

            if (!element.projectile.enabledAndAlive) {
                this.removeProjectile(element.projectile)
            }else{                
                element.angle += delta * this.weaponData.weaponAttributes.bulletSpeed;
                element.projectile.x = this.transform.position.x + Math.cos(element.angle) * element.projectile.weapon.weaponAttributes.damageZone;
                element.projectile.z = this.transform.position.z + Math.sin(element.angle) * 100;
                element.projectile.angle = element.angle
            }

        }
    }

    destroyBullet(bullet) {
        super.destroyBullet(bullet)
        this.removeProjectile(bullet)
    }

    destroy() {
        super.destroy();
        this.interactiveProjectiles.forEach(element => {
            element.projectile.destroy();
        });
        this.interactiveProjectiles = []
    }
}