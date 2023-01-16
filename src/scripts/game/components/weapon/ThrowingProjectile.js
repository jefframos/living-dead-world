import BaseWeapon from "./BaseWeapon";
import Bullet from "./bullets/Bullet";
import WeaponAttributes from "../../data/WeaponAttributes";

export default class ThrowingProjectile extends BaseWeapon {
    constructor() {
        super();

    }
  
    shoot() {
        let bullets = super.shoot();


        bullets.forEach(bullet => {            
            bullet.gameView.view.alpha = 1;
            bullet.gameView.view.texture = PIXI.Texture.from('knife')
            bullet.name = 'throw'

            bullet.gameView.view.scale.set(5 / bullet.gameView.view.width * bullet.gameView.view.scale.x)

        });

    }
    update(delta) {
        super.update(delta);
    }
    destroy(){
        super.destroy();
    }
}