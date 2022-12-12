import Signals from 'signals';
export default class GameModifyers {
    constructor() {
        this.modifyersData = {
			version: '0.0.1',
			entities: {},
			drillSpeed: 1,
			resourcesMultiplier: 1,
			damageMultiplier: 1,
			attackSpeed: 1,
			attackSpeedValue: 1,
			autoMerge: 1,
			autoCollectResource: false,
			permanentBonusData: {
				damageBonus: 1,
				resourceBonus: 1,
				damageSpeed: 1,
				resourceSpeed: 1,
				shards: 0
			}
		}//COOKIE_MANAGER.getModifyers();
        this.onUpdateModifyers = new Signals();
        this.onActiveBonus = new Signals();

        this.defaultModifyers = {
            drillSpeed: 1,
            resourcesMultiplier: 1,
            damageMultiplier: 1,
            totalGenerators: 1,
            attackSpeed: 1,
            attackSpeedValue: 1,
            autoMerge: 1,
            autoCollectResource: false
        }

        this.bonusData = {
            damageBonus: 1,
            resourceBonus: 1,
            damageSpeed: 1,
            resourceSpeed: 1,
            generateTimerBonus : 1,
            gameSpeed: 1,
            autoMerge: 1,
            autoCollectResource: false

        }

        this.permanentBonusData = this.modifyersData.permanentBonusData


    }
    updateModifyer(name){
        this.onActiveBonus.dispatch(name);
    }
    resetModifyers(){
        // for (const key in this.defaultModifyers) {
        //     if (Object.hasOwnProperty.call(this.defaultModifyers, key)) {
        //         this.modifyersData[key] = this.defaultModifyers[key];
                
        //     }
        // }
        // this.onUpdateModifyers.dispatch();
        // COOKIE_MANAGER.updateModifyers(this.modifyersData)
    }
    addShards(value){
        // this.permanentBonusData.shards += value;
        // this.modifyersData.permanentBonusData = this.permanentBonusData
        // //console.log(this.modifyersData.permanentBonusData)
        // this.onUpdateModifyers.dispatch();
        // COOKIE_MANAGER.updateModifyers(this.modifyersData)
    }
    addResources(res) {

    }
    hasEnoughtResources(cost) {
    }

    saveModifyers(type, level, value) {
        // this.modifyersData[type] = level;
        // this.modifyersData[type + 'Value'] = value;
        // this.onUpdateModifyers.dispatch();
        // COOKIE_MANAGER.updateModifyers(this.modifyersData)
    }
    resetAll(){
        
    }
    saveBoolModifyers(type, value) {
        // this.modifyersData[type] = value;
        // this.onUpdateModifyers.dispatch();
        // COOKIE_MANAGER.updateModifyers(this.modifyersData)
    }
    getLevel(data) {
        return 1
        return (this.modifyersData[data.rawData.modifyer] || 1)
    }
    getDamageMultiplier() {        
        return 1
        let r = (this.modifyersData.damageMultiplierValue || 1) * this.permanentBonusData.damageBonus + this.permanentBonusData.shards;
        r *= this.bonusData.damageBonus;
        return r;
    }
    getResourcesMultiplier() {
        return (this.modifyersData.resourcesMultiplierValue || 1) * this.bonusData.resourceBonus * this.permanentBonusData.resourceBonus + this.permanentBonusData.shards;
    }
    getAttackSpeed() {
        return (this.modifyersData.attackSpeedValue || 1) * this.permanentBonusData.damageSpeed
    }
    getDrillSpeed() {
        return 1
        return ((this.modifyersData.drillSpeedValue || 1)) * this.bonusData.resourceSpeed * this.permanentBonusData.resourceSpeed
    }
    getTotalGenerators() {
        return 1
        return (this.modifyersData.totalGenerators || 1)
    }
}