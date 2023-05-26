import CookieManager from "../CookieManager";
import EntityBuilder from "../screen/EntityBuilder";
import signals from "signals";

export default class GameData {
    static _instance;
	static get instance() {
		if (!GameData._instance) {
			GameData._instance = new GameData();
		}
		return GameData._instance;
	}
    constructor() {        
    }
    get currentPlayer(){
        return CookieManager.instance.getPlayer(CookieManager.instance.currentPlayer)
    }
    get totalPlayers(){
        return CookieManager.instance.totalPlayers
    }
    get currentEquippedWeapon(){
        return CookieManager.instance.loadout.currentWeapon[CookieManager.instance.currentPlayer]
    }

    get currentEquippedCompanion(){
        return CookieManager.instance.loadout.currentCompanion[CookieManager.instance.currentPlayer]
    }

    get currentEquippedTrinket(){
        return CookieManager.instance.loadout.currentTrinket[CookieManager.instance.currentPlayer]
    }

    get currentEquippedMask(){
        return CookieManager.instance.loadout.currentMask[CookieManager.instance.currentPlayer]
    }
    get currentEquippedWeaponData(){
        return EntityBuilder.instance.getWeapon(this.currentEquippedWeapon.id)
    }
    get currentEquippedCompanionData(){
        return EntityBuilder.instance.getCompanion(this.currentEquippedCompanion.id) 
    }
    getPlayer(id){
        return CookieManager.instance.getPlayer(id)
    }
    savePlayer(id, structure){
        CookieManager.instance.savePlayer(id, structure)
    }
    changePlayer(id){
        CookieManager.instance.changePlayer(id)
    }
    changeMainWeapon(id){
        CookieManager.instance.saveEquipment('currentWeapon', id)
    }
    changeCompanion(id){
        CookieManager.instance.saveEquipment('currentCompanion', id)
    }
}