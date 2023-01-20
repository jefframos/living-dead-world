import BaseWeapon from "../components/weapon/BaseWeapon";
import EntityViewData from "./EntityViewData";
import WeaponAttributes from "./WeaponAttributes";

export default class WeaponData {
    constructor(name = 'none') {
        this.weaponAttributes = new WeaponAttributes();
        this.weaponViewData = new EntityViewData();
        this.constructor = BaseWeapon;
        this.icon = 'knife';
        this.name = name;
        this.onDestroyWeapon = null;
    }
    clone() {
        let weapon = new WeaponData();
        weapon.weaponAttributes = this.weaponAttributes.clone();
        weapon.weaponViewData = this.weaponViewData.clone();
        weapon.constructor = this.constructor;

        weapon.icon = this.icon;
        weapon.name = this.name;
        weapon.onDestroyWeapon = this.onDestroyWeapon;

        return weapon;
    }
}