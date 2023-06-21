import CookieManager from "../CookieManager";
import EntityBuilder from "../screen/EntityBuilder";
import GameData from "./GameData";
import GameStaticData from "./GameStaticData";
import signals from "signals";

export default class PrizeManager {
    static PrizeType = {
        Coin: 'coin',
        Key: 'key',
        MasterKey: 'MasterKey',
        Shoe: 'shoes',
        Trinket: 'trinkets',
        Companion: 'companions',
        Weapon: 'weapons',
        Wearable: 'wearable',
        Equippable: 'equippable',
    }
    static _instance;
    static get instance() {
        if (!PrizeManager._instance) {
            PrizeManager._instance = new PrizeManager();
        }
        return PrizeManager._instance;
    }
    constructor() {
        this.onGetMetaPrize = new signals.Signal();
        this.onUpdateCompanion = new signals.Signal();

        this.prizePool = [
            [
                { type: PrizeManager.PrizeType.Coin, value: [20, 50] },
                { type: PrizeManager.PrizeType.Key, value: 1 },
                { type: PrizeManager.PrizeType.Wearable, value: 1 },
            ]
        ]
        this.prizeList = [];
        this.prizeList.push({
            icon: 'pistol1-icon',
            type: PrizeManager.PrizeType.Weapon,
        })
        this.prizeList.push({
            icon: 'coin3l',
            type: PrizeManager.PrizeType.Coin,
        })
        this.prizeList.push({
            icon: 'active_engine',
            type: PrizeManager.PrizeType.Key
        })
        this.prizeList.push({
            icon: 'pet-dog-10001',
            type: PrizeManager.PrizeType.Companion
        })
        this.prizeList.push({
            icon: 'dynamic-shoe-icon0001',
            type: PrizeManager.PrizeType.Shoe
        })
        this.prizeList.push({
            icon: 'trinket-icon0001',
            type: PrizeManager.PrizeType.Trinket
        })
    }
    get metaPrizeList() {
        return this.prizeList;
    }
    getMetaLowerPrize() {
        this.onGetMetaPrize.dispatch({ type: [PrizeManager.PrizeType.Coin], value: [Math.round((30 + Math.random() * 30))] })
    }
    getMetaPrize(maxId, maxLevel, total = 1, dispatch = true) {

        const itemPrizeList = []

        for (let index = 0; index < total; index++) {
            if (maxId < 0) {
                maxId = Math.floor(Math.random() * this.prizeList.length);
            }

            itemPrizeList.push(this.getItemPrize(this.prizeList[maxId].type, maxLevel))
        }

        const types = [];
        itemPrizeList.forEach(element => {
            console.log(element.type, element)
            GameData.instance.addToInventory(element.type, element)
            types.push(element.type)

        });

        const prizeData = { type: types, value: itemPrizeList }
        if (dispatch) {
            this.onGetMetaPrize.dispatch(prizeData)
        }
        return prizeData;
    }
    updateItem(type, item, level){

        const prize =  { id: item.id, level}
        GameData.instance.addToInventory(type,prize)
        this.onGetMetaPrize.dispatch( { type: [type], value: [prize] })
    }
    getItemPrize(type, maxLevel) {
        let allEquip = [];

        switch (type) {
            case PrizeManager.PrizeType.Coin:
                return { type: PrizeManager.PrizeType.Coin, value: Math.round((50 + Math.random() * 5) * (maxLevel * maxLevel)) }

            case PrizeManager.PrizeType.Key:
                if (maxLevel == 2) {
                    return { type: PrizeManager.PrizeType.Key, value: 1 }
                } else {
                    return { type: PrizeManager.PrizeType.MasterKey, value: 1 }
                }
                return;
            case PrizeManager.PrizeType.Shoe:
                allEquip = EntityBuilder.instance.getAllShoes();
                break;

            case PrizeManager.PrizeType.Companion:
                allEquip = EntityBuilder.instance.getAllCompanion();
                break;

            case PrizeManager.PrizeType.Trinket:
                allEquip = EntityBuilder.instance.getAllTrinket();
                break;

            case PrizeManager.PrizeType.Weapon:
                allEquip = EntityBuilder.instance.getAllStarterWeapon();
                break;
        }

        const equipPrize = allEquip[Math.floor(Math.random() * allEquip.length)]
        const itemPrize = { id: equipPrize.id, level: Math.floor(maxLevel * Math.random()), type }
        return itemPrize;
    }
}