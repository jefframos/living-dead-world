import BaseWeapon from "../components/weapon/BaseWeapon";
import Bullet from "../components/weapon/bullets/Bullet";
import EntityViewData from "./EntityViewData";
import WeaponAttributes from "./WeaponAttributes";

export default class WeaponData {
    static WeaponType = {
        Main:1,
        Magic:2
    }
    constructor(name = 'none') {
        this.weaponAttributes = new WeaponAttributes();
        this.weaponViewData = new EntityViewData();
        this.customConstructor = BaseWeapon;
        this.weaponType = WeaponData.WeaponType.Main;
        this.bulletComponent = Bullet;
        this.icon = 'knife';
        this.name = name;
        this.onDestroyWeapon = [];
        this.onFixedDestroyWeapon = [];
    }
    addFixedDestroyedWeapon(weapon){
        this.onFixedDestroyWeapon.push(weapon);
    }
    addWeaponOnDestroy(weapon){
        this.onDestroyWeapon.push(weapon);
    }
    clone() {
        let weapon = new WeaponData();

        for (const key in this) {
            if(this[key] && this[key].clone){
                weapon[key] = this[key].clone();
            }else{
                weapon[key] = this[key];
            }
                
        }
        weapon.onDestroyWeapon = [];
        return weapon;
    }
}