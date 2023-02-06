import BaseWeapon from "../components/weapon/BaseWeapon";
import Bullet from "../components/weapon/bullets/Bullet";
import EntityViewData from "./EntityViewData";
import WeaponAttributes from "./WeaponAttributes";

export default class WeaponData {
    static WeaponType = {
        Physical:'Physical',
        Magical:'Magical'
    }
    constructor(name = 'none') {
        this.weaponAttributes = new WeaponAttributes();
        this.weaponViewData = new EntityViewData();
        this.customConstructor = BaseWeapon;
        this.weaponType = WeaponData.WeaponType.Physical;
        this.bulletComponent = Bullet;
        this.icon = 'knife';
        this.onDestroyId = null;
        this.isMain = true;
        this.name = name;
        this.onDestroyWeapon = [];
        this.onFixedDestroyWeapon = [];
    }
    get bulletBehaviourComponent(){
        if(this.weaponAttributes.isMain){
            return this.bulletComponent;
        }else{
            return this.weaponAttributes.overrider.bulletComponent;
        }
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