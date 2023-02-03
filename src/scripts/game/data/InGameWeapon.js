import signals from "signals";

export default class InGameWeapon {
    constructor() {
        this.stackWeapons = [];
        this.onUpdateWeapon = new signals.Signal();
    }
    addWeaponFirst(weapon){
        let clone = weapon.clone();
        if(this.stackWeapons.length > 0){
            this.stackWeapons[this.stackWeapons.length - 1].addWeaponOnDestroy(clone);
        }
        
        this.stackWeapons.unshift(clone);

        this.onUpdateWeapon.dispatch();
    }
    addWeapon(weapon){

        let clone = weapon.clone();
        if(this.stackWeapons.length > 0){
            this.stackWeapons[this.stackWeapons.length - 1].addWeaponOnDestroy(clone);
        }
        
        this.stackWeapons.push(clone);

        this.onUpdateWeapon.dispatch();
    }
    clear(){
        this.stackWeapons = []
        this.onUpdateWeapon.dispatch();
    }
    get hasWeapon(){
        return this.stackWeapons.length > 0;
    }
    get mainWeapon(){
        return this.stackWeapons[0];
    }
}