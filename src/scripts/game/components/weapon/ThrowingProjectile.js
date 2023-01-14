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

        let facing = this.parent.gameView.view.scale.x > 0 ? 1 : -1;
        let facingAng = facing < 0 ? Math.PI : 0;

        bullet.setPosition(this.transform.position.x + this.parent.physics.velocity.x + facing * 20, 0, this.transform.position.z);
        bullet.shoot(facingAng, Math.abs(this.parent.physics.velocity.x))
        bullet.gameView.view.alpha = 1;
        bullet.gameView.view.texture = PIXI.Texture.from('knife')
        bullet.name = 'throw'

        bullet.power = 120;

    }
    update(delta) {
        super.update(delta);
    }
    destroy(){
        super.destroy();
    }
}