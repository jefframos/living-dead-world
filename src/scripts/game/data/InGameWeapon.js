export default class InGameWeapon {
    constructor() {
        this.stackWeapons = [];
    }
    addWeapon(weapon){

        let clone = weapon.clone();
        //console.log(weapon, 'clone')
        if(this.stackWeapons.length > 0){
            this.stackWeapons[this.stackWeapons.length - 1].addWeaponOnDestroy(clone);
        }
        
        this.stackWeapons.push(clone);
    }
    get hasWeapon(){
        return this.stackWeapons.length > 0;
    }
    get mainWeapon(){
        return this.stackWeapons[0];
    }
}