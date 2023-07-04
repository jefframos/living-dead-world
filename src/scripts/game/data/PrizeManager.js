import CookieManager from "../CookieManager";
import EntityBuilder from "../screen/EntityBuilder";
import GameData from "./GameData";
import GameStaticData from "./GameStaticData";
import ViewDatabase from "./ViewDatabase";
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
        // this.prizeList.push({
        //     icon: 'head-0004',
        //     type: PrizeManager.PrizeType.Wearable,
        // })
        this.prizeList.push({
            icon: 'coin3l',
            type: PrizeManager.PrizeType.Coin,
        })
        this.prizeList.push({
            icon: 'active_engine',
            type: PrizeManager.PrizeType.Key
        })
    }
    get metaPrizeList() {
        return this.prizeList;
    }
    getMetaLowerPrize() {
        this.onGetMetaPrize.dispatch({ type: [PrizeManager.PrizeType.Coin], value: [Math.round((30 + Math.random() * 30))] })
    }
    getWearable() {
        const prize = this.getItemPrize(PrizeManager.PrizeType.Wearable)
        this.onGetMetaPrize.dispatch(prize)
        ViewDatabase.instance.saveWardrobePiece(prize.value[0].area, prize.value[0].id)
    }
    getMetaPrize(prizeId, maxLevel, total = 1, dispatch = true) {

        const itemPrizeList = []

        for (let index = 0; index < total; index++) {
            let id = prizeId[Math.floor(Math.random() * prizeId.length)]
            if (id < 0) {
                id = Math.floor(Math.random() * this.prizeList.length);
            }
            itemPrizeList.push(this.getItemPrize(this.prizeList[id].type, maxLevel))
        }
        //console.log(itemPrizeList)
        const types = [];
        itemPrizeList.forEach(element => {
            if (element.type == PrizeManager.PrizeType.Coin) {
                GameData.instance.addSoftCurrency(element.value)

            } else if (element.type == PrizeManager.PrizeType.Key) {
                GameData.instance.addHardCurrency(element.value)

            } else if (element.type == PrizeManager.PrizeType.MasterKey) {
                GameData.instance.addSpecialCurrency(element.value)

            } else if (element.type == PrizeManager.PrizeType.Wearable) {
                console.log(element)
                // GameData.instance.addSpecialCurrency(element.value)
            }
            else {
                GameData.instance.addToInventory(element.type, element)
            }
            types.push(element.type)
        });

        const prizeData = { type: types, value: itemPrizeList }
        if (dispatch) {
            this.onGetMetaPrize.dispatch(prizeData)
        }
        return prizeData;
    }
    updateItem(type, item, level) {
        const prize = { id: item.id, level }
        GameData.instance.addToInventory(type, prize)
        this.onGetMetaPrize.dispatch({ type: [type], value: [prize] })
    }
    updateItems(types, items, levels) {

        const collectedPrize = []
        for (let index = 0; index < items.length; index++) {
            const element = items[index];

            const prize = { id: element.id, level: levels[index] }
            GameData.instance.addToInventory(types[index], prize)

            collectedPrize.push(prize)
        }
        this.onGetMetaPrize.dispatch({ type: types, value: collectedPrize })
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
            case PrizeManager.PrizeType.Wearable:
                const wearable = ViewDatabase.instance.findAvailablePiece();
                if (wearable.area) {
                    return { type: [PrizeManager.PrizeType.Wearable], value: [wearable] }
                }
                break;
        }

        const equipPrize = allEquip[Math.floor(Math.random() * allEquip.length)]
        const itemPrize = { id: equipPrize.id, level: Math.floor(maxLevel * Math.random()), type }
        return itemPrize;
    }
}