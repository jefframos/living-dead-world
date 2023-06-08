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
        Mask: 'masks',
        Trinket: 'trinkets',
        Companion: 'companions',
        Weapon: 'weapons',
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
            icon: 'fly-drone_icon',
            type: PrizeManager.PrizeType.Companion
        })
        this.prizeList.push({
            icon: 'mask-icon0001',
            type: PrizeManager.PrizeType.Mask
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
    getMetaPrize(maxId, max) {
        let allEquip = [];

        switch (this.prizeList[maxId].type) {
            case PrizeManager.PrizeType.Coin:
                this.onGetMetaPrize.dispatch({ type: [PrizeManager.PrizeType.Coin], value: [Math.round((50 + Math.random() * 5) * (max * max))] })

                return;
            case PrizeManager.PrizeType.Key:
                if (max == 2) {
                    this.onGetMetaPrize.dispatch({ type: [PrizeManager.PrizeType.Key], value: [1] })
                } else {
                    this.onGetMetaPrize.dispatch({ type: [PrizeManager.PrizeType.Key, PrizeManager.PrizeType.MasterKey], value: [1, 1] })
                }
                return;
            case PrizeManager.PrizeType.Mask:
                allEquip = EntityBuilder.instance.getAllMask();
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
        const itemPrize = { id: equipPrize.id, level: Math.floor(max * Math.random()) }
        GameData.instance.addToInventory(this.prizeList[maxId].type, itemPrize)

        this.onGetMetaPrize.dispatch({ type: [this.prizeList[maxId].type], value: [itemPrize] })

    }
}