import Signals from 'signals';

export default class GameEconomy {
    constructor() {
        //this.economyData = COOKIE_MANAGER.getEconomy();
        if(!this.economyData){
            this.currentResources = 0
        }else{
            this.currentResources = this.economyData.resources
        }
        this.onMoneySpent = new Signals();

        this.currentSystemID = null
    }
    updateBoard(id){
        if(id){
            this.currentSystemID = id
        }
        this.economyData = COOKIE_MANAGER.getEconomy(this.currentSystemID);
        if(!this.economyData){
            this.currentResources = 0
        }else{
            this.currentResources = this.economyData.resources
        }
    }
    resetAll(){
        this.currentResources = 0;
        this.saveResources()
    }
    addResources(res, id) {
        if(id){
            this.currentSystemID = id
        }
        this.currentResources += res;
        this.saveResources(this.currentSystemID)
        this.onMoneySpent.dispatch(-res);

    }
    hasEnoughtResources(cost) {

        return Math.ceil(cost) <= Math.floor(this.currentResources)
    }

    useResources(cost, id) {
        if(id){
            this.currentSystemID = id
        }
        this.currentResources -= cost
        this.currentResources = Math.max(this.currentResources, 0)
        this.saveResources(this.currentSystemID)

        this.onMoneySpent.dispatch(cost);
    }

    saveResources(id) {   
        if(id){
            this.currentSystemID = id
        }     
        COOKIE_MANAGER.updateResources(this.currentResources, id)
    }
}