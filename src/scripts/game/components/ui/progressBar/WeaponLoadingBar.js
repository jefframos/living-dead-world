import BaseFillBar from "./BaseFillBar";

export default class WeaponLoadingBar extends BaseFillBar {
    constructor() {
        super();
    }
    setWeapon(weapon){
        this.weapon = weapon;
    }
    update(delta, unscaled){
        super.update(delta, unscaled);
        this.normal = this.weapon.shootNormal;
    }
}
