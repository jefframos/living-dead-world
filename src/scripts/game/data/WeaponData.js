import EntityViewData from "./EntityViewData";
import WeaponAttributes from "./WeaponAttributes";

export default class WeaponData {
    constructor() {
        this.weaponAttributes = new WeaponAttributes();
        this.weaponViewData = new EntityViewData();
    }
}