import BaseWeapon from "./BaseWeapon";
import Bullet from "./bullets/Bullet";

export default class ThrowingProjectile extends BaseWeapon {
    constructor() {
        super();

    }
    build() {
        super.build();
        this.shootFrequency = 5;
        this.currentProjectile = []
    }

    shoot() {
        super.shoot();
        let bullet = this.engine.poolGameObject(Bullet)
        bullet.build(15, 250, 0, 5);
        bullet.setPosition(this.transform.position.x + this.parent.physics.velocity.x + this.parent.facing * 20, 0, this.transform.position.z);
        bullet.shoot(this.parent.facingAngleBack, Math.abs(this.parent.physics.velocity.x))
        bullet.gameView.view.alpha = 1;

    }
    update(delta) {
        super.update(delta);
    }
    destroy(){
        super.destroy();
    }
}