import BaseWeapon from "../components/weapon/BaseWeapon";
import EntityViewData from "./EntityViewData";
import WeaponAttributes from "./WeaponAttributes";

export default class WeaponData {
    constructor() {
        this.weaponAttributes = new WeaponAttributes();
        this.weaponViewData = new EntityViewData();
        this.constructor = BaseWeapon;

        this.onDestroyWeapon = null;
    }
    clone() {
        let weapon = new WeaponData();
        weapon.weaponAttributes = this.weaponAttributes.clone();
        weapon.weaponViewData = this.weaponViewData.clone();
        weapon.constructor = this.constructor;

        weapon.onDestroyWeapon = this.onDestroyWeapon;

        return weapon;
    }
}