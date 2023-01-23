import BaseWeapon from "../components/weapon/BaseWeapon";
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
        this.icon = 'knife';
        this.name = name;
        this.onDestroyWeapon = null;
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
        // weapon.weaponAttributes = this.weaponAttributes.clone();
        // weapon.weaponViewData = this.weaponViewData.clone();
        // weapon.customConstructor = this.customConstructor;

        // weapon.weaponType = WeaponData.WeaponType.Main;

        // weapon.icon = this.icon;
        // weapon.name = this.name;
        // weapon.onDestroyWeapon = this.onDestroyWeapon;

        return weapon;
    }
}