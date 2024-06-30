import signals from "signals";
import CookieManager from "../CookieManager";
import PlayerViewStructure from "../entity/PlayerViewStructure";
import EntityBuilder from "../screen/EntityBuilder";
import EntityAttributes from "./EntityAttributes";
import GameStaticData from "./GameStaticData";
import ViewDatabase from "./ViewDatabase";

export default class GameData {
    static _instance;
    static get instance() {
        if (!GameData._instance) {
            GameData._instance = new GameData();
        }
        return GameData._instance;
    }
    constructor() {
        this.onUpdateEquipment = new signals.Signal();
        this.onUpdateCompanion = new signals.Signal();
        this.onUpdateCurrency = new signals.Signal();
        this.notEnoughcurrency = new signals.Signal();

        this.attributes = new EntityAttributes();

        this.defaultPlayerData = GameStaticData.instance.getEntityByIndex('player', 0);
    }
    get currentPlayer() {
        return CookieManager.instance.getPlayer(CookieManager.instance.currentPlayer)
    }
    get loadout() {
        return CookieManager.instance.loadout
    }
    get totalPlayers() {
        return CookieManager.instance.totalPlayers
    }
    get currentEquippedWeapon() {
        return CookieManager.instance.loadout.currentWeapon[CookieManager.instance.currentPlayer]
    }

    get currentEquippedCompanion() {
        return CookieManager.instance.loadout.currentCompanion[CookieManager.instance.currentPlayer]
    }

    get currentEquippedTrinket() {
        return CookieManager.instance.loadout.currentTrinket[CookieManager.instance.currentPlayer]
    }

    get currentEquippedMask() {
        return CookieManager.instance.loadout.currentMask[CookieManager.instance.currentPlayer]
    }

    get currentEquippedShoe() {
        return CookieManager.instance.loadout.currentShoe[CookieManager.instance.currentPlayer]
    }
    get currentEquippedWeaponData() {
        return EntityBuilder.instance.getWeapon(this.currentEquippedWeapon.id)
    }
    get currentEquippedCompanionData() {
        return EntityBuilder.instance.getCompanion(this.currentEquippedCompanion.id)
    }
    get inventory() {
        return CookieManager.instance.inventory;
    }
    get resources() {
        return CookieManager.instance.resources;
    }
    get softCurrency() {
        return CookieManager.instance.resources.softCurrency;
    }
    get hardCurrency() {
        return CookieManager.instance.resources.hardCurrency;
    }
    get specialCurrency() {
        return CookieManager.instance.resources.specialCurrency;
    }
    addSoftCurrency(value) {
        const result = CookieManager.instance.addSoftCurrency(value);
        this.onUpdateCurrency.dispatch(this.resources)
        return result;
    }
    addHardCurrency(value) {
        const result = CookieManager.instance.addHardCurrency(value);
        this.onUpdateCurrency.dispatch(this.resources)
        return result;
    }
    addSpecialCurrency(value) {
        const result = CookieManager.instance.addSpecialCurrency(value);
        this.onUpdateCurrency.dispatch(this.resources)
        return result;
    }
    showCantBuy(data) {
        this.notEnoughcurrency.dispatch(data)
    }
    getAttributesFromEquipabble(equip, level) {
        this.addAttributes = new EntityAttributes()
        this.addAttributes.resetAll();
        this.addAttributes.addMultiplyer(equip.attribute, equip.value[level])
        if (equip.secAttribute) {
            this.addAttributes.addMultiplyer(equip.secAttribute, equip.secValue[level])
        }
        return this.addAttributes;
    }
    getPlayer(id) {
        return CookieManager.instance.getPlayer(id)
    }
    savePlayer3() {
        const playerViewDataStructure = this.getPlayer3Preview()

        ViewDatabase.instance.saveWardrobePiece('head', playerViewDataStructure.head)
        ViewDatabase.instance.saveWardrobePiece('chest', playerViewDataStructure.chest)
        ViewDatabase.instance.saveWardrobePiece('hair', playerViewDataStructure.topHead)
        ViewDatabase.instance.saveWardrobePiece('face', playerViewDataStructure.face)
        ViewDatabase.instance.saveWardrobePiece('legs', playerViewDataStructure.leg)
        ViewDatabase.instance.saveWardrobePiece('sleeves', playerViewDataStructure.sleeves)
        ViewDatabase.instance.saveWardrobePiece('hat', playerViewDataStructure.hat)

        //PLAYER_MULTISHOT
        this.addToInventory('weapons', { id: 'SHOTGUN_01', level: 1, type: 'weapons' })
        this.addToInventory('companions', { id: 'CAT-1', level: 1, type: 'companions' })
        this.changeMainWeapon('SHOTGUN_01', 1)
        this.changeCompanion('CAT-1', 1)

        CookieManager.instance.savePlayer(0, playerViewDataStructure)
    }
    savePlayer2() {
        const playerViewDataStructure = this.getPlayer2Preview()

        ViewDatabase.instance.saveWardrobePiece('head', playerViewDataStructure.head)
        ViewDatabase.instance.saveWardrobePiece('chest', playerViewDataStructure.chest)
        ViewDatabase.instance.saveWardrobePiece('hair', playerViewDataStructure.topHead)
        ViewDatabase.instance.saveWardrobePiece('face', playerViewDataStructure.face)
        ViewDatabase.instance.saveWardrobePiece('frontFace', playerViewDataStructure.frontFace)
        ViewDatabase.instance.saveWardrobePiece('legs', playerViewDataStructure.leg)
        ViewDatabase.instance.saveWardrobePiece('sleeves', playerViewDataStructure.sleeves)
        ViewDatabase.instance.saveWardrobePiece('ears', playerViewDataStructure.ears)
        ViewDatabase.instance.saveWardrobePiece('mouth', playerViewDataStructure.mouth)
        ViewDatabase.instance.saveWardrobePiece('hairColor', playerViewDataStructure.hairColor)
        ViewDatabase.instance.saveWardrobePiece('skinColor', playerViewDataStructure.skinColor)
        ViewDatabase.instance.saveWardrobePiece('eyes', playerViewDataStructure.eyes)
        ViewDatabase.instance.saveWardrobePiece('hat', playerViewDataStructure.hat)

        this.addToInventory('weapons', { id: 'SUB_MACHINE_GUN_01', level: 1, type: 'weapons' })
        this.addToInventory('companions', { id: 'FISH-1', level: 1, type: 'companions' })
        this.changeMainWeapon('SUB_MACHINE_GUN_01', 1)
        this.changeCompanion('FISH-1', 1)

        CookieManager.instance.savePlayer(0, playerViewDataStructure)
    }
    savePlayer1() {
        const playerViewDataStructure = this.getPlayer1Preview();
        ViewDatabase.instance.saveWardrobePiece('head', playerViewDataStructure.head)
        ViewDatabase.instance.saveWardrobePiece('chest', playerViewDataStructure.chest)
        ViewDatabase.instance.saveWardrobePiece('hair', playerViewDataStructure.topHead)
        ViewDatabase.instance.saveWardrobePiece('face', playerViewDataStructure.face)
        ViewDatabase.instance.saveWardrobePiece('frontFace', playerViewDataStructure.frontFace)
        ViewDatabase.instance.saveWardrobePiece('legs', playerViewDataStructure.leg)
        ViewDatabase.instance.saveWardrobePiece('hat', playerViewDataStructure.hat)
        ViewDatabase.instance.saveWardrobePiece('sleeves', playerViewDataStructure.sleeves)
        ViewDatabase.instance.saveWardrobePiece('ears', playerViewDataStructure.ears)
        ViewDatabase.instance.saveWardrobePiece('eyes', playerViewDataStructure.eyes)
        ViewDatabase.instance.saveWardrobePiece('mouth', playerViewDataStructure.mouth)
        ViewDatabase.instance.saveWardrobePiece('hairColor', playerViewDataStructure.hairColor)
        ViewDatabase.instance.saveWardrobePiece('skinColor', playerViewDataStructure.skinColor)
        ViewDatabase.instance.saveWardrobePiece('faceHairColor', playerViewDataStructure.faceHairColor)

        this.addToInventory('weapons', { id: 'PISTOL_01', level: 1, type: 'weapons' })
        this.addToInventory('companions', { id: 'DOG-1', level: 1, type: 'companions' })
        this.changeMainWeapon('PISTOL_01', 1)
        this.changeCompanion('DOG-1', 1)

        CookieManager.instance.savePlayer(0, playerViewDataStructure)

        return playerViewDataStructure
    }
    getPlayer3Preview() {
        const playerViewDataStructure = new PlayerViewStructure();
        playerViewDataStructure.head = 4
        playerViewDataStructure.chest = 11
        playerViewDataStructure.topHead = 10
        playerViewDataStructure.face = 1
        playerViewDataStructure.leg = 5
        playerViewDataStructure.sleeves = 11
        return playerViewDataStructure
    }
    getPlayer2Preview() {
        const playerViewDataStructure = new PlayerViewStructure();
        playerViewDataStructure.head = 5
        playerViewDataStructure.chest = 20
        playerViewDataStructure.topHead = 20
        playerViewDataStructure.face = 1
        playerViewDataStructure.frontFace = 5
        playerViewDataStructure.leg = 11
        playerViewDataStructure.sleeves = 20
        playerViewDataStructure.ears = 2
        playerViewDataStructure.mouth = 5
        playerViewDataStructure.hairColor = 15473250
        playerViewDataStructure.skinColor = 6143977
        playerViewDataStructure.eyes = 12
        return playerViewDataStructure
    }
    getPlayer1Preview() {
        const playerViewDataStructure = new PlayerViewStructure();
        playerViewDataStructure.head = 1
        playerViewDataStructure.chest = 21
        playerViewDataStructure.topHead = 20
        playerViewDataStructure.face = 1
        playerViewDataStructure.frontFace = 1
        playerViewDataStructure.leg = 4
        playerViewDataStructure.hat = 9
        playerViewDataStructure.sleeves = 21
        playerViewDataStructure.ears = 2
        playerViewDataStructure.eyes = 14
        playerViewDataStructure.mouth = 1
        playerViewDataStructure.hairColor = 15473250
        playerViewDataStructure.skinColor = 12287850
        playerViewDataStructure.faceHairColor = 3947580
        return playerViewDataStructure
    }
    savePlayer(id, structure) {
        CookieManager.instance.savePlayer(id, structure)
    }
    changePlayer(id) {
        CookieManager.instance.changePlayer(id)
    }
    changeMainWeapon(id, level) {
        CookieManager.instance.saveEquipment('currentWeapon', id, level)
    }
    changeCompanion(id, level) {
        CookieManager.instance.saveEquipment('currentCompanion', id, level)
        this.onUpdateCompanion.dispatch(id, level)
    }
    changeMask(id, level) {
        CookieManager.instance.saveEquipment('currentMask', id, level)
        this.onUpdateEquipment.dispatch('mask', id, level)
    }
    changeShoe(id, level) {
        CookieManager.instance.saveEquipment('currentShoe', id, level)
        this.onUpdateEquipment.dispatch('shoe', id, level)
    }
    changeTrinket(id, level) {
        CookieManager.instance.saveEquipment('currentTrinket', id, level)
        this.onUpdateEquipment.dispatch('trinket', id, level)
    }
    addToInventory(type, item) {
        //console.log('\naddToInventory', type, item, '\n')

        CookieManager.instance.saveEquipsPiece(type, item.id)
        CookieManager.instance.addToInventory(type, item)

    }
    anyNewEquip() {
        return CookieManager.instance.allNewEquipsDiscover().length > 0;
    }
    getEquipsNewPerArea(area) {
        return CookieManager.instance.getEquipsNewPerArea(area);
    }
    removeFromInventory(type, item, quant) {
        CookieManager.instance.removeFromInventory(type, item, quant)
    }
    getLoadoutAttributes() {
        const addAttributes = new EntityAttributes()
        addAttributes.resetAll()
        addAttributes.reset(this.defaultPlayerData.attributes);
        const equippedShoe = this.currentEquippedShoe
        if (equippedShoe.id) {
            const shoeAttribute = this.getAttributesFromEquipabble(EntityBuilder.instance.getEquipable(equippedShoe.id), equippedShoe.level);
            addAttributes.sumAttributes(shoeAttribute)
        }



        const equippedTrinket = this.currentEquippedTrinket
        if (equippedTrinket.id) {
            const trinketAttribute = this.getAttributesFromEquipabble(EntityBuilder.instance.getEquipable(equippedTrinket.id), equippedTrinket.level);
            addAttributes.sumAttributes(trinketAttribute)

        }

        return addAttributes;
    }
    lastOpened(id) {
        return CookieManager.instance.lastOpened(id)
    }
    openChest(id) {
        CookieManager.instance.openChest(id)
    }

    dailyAvailable(id) {
        return CookieManager.instance.dailyAvailable(id)
    }
    getDaily(id) {
        CookieManager.instance.getDaily(id)
    }
}