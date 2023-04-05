import EntityAttributes from "./EntityAttributes";
import EntityData from "./EntityData";
import EntityMultipliers from "./EntityMultipliers";
import GameplayItem from "./GameplayItem";
import Utils from "../core/utils/Utils";
import signals from "signals";

export default class PlayerSessionData {
    constructor() {

        this.equipmentList = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ]

        this.equipmentUpdated = new signals.Signal();
        this.xpUpdated = new signals.Signal();
        this.onLevelUp = new signals.Signal();
        this.attributesMultiplier = new EntityMultipliers();
    }
    reset() {
        this.healthMultiplier = 1;
        this.defenseMultiplier = 1;
        this.speedMultiplier = 1;
        this.bulletSpeedMultiplier = 1;
        this.bulletFrenquencyMultiplier = 1;
        this.attributesMultiplier.reset();

        this.equipmentList = [
            [new GameplayItem(), new GameplayItem(), new GameplayItem()],
            [new GameplayItem(), new GameplayItem(), new GameplayItem()],
            [new GameplayItem(), new GameplayItem(), new GameplayItem()]
        ]

        this.xpData = {
            xp: 0,
            currentLevel: 0,
            untilNext: 0,
            normalUntilNext: 0,
            nextLevelXP: 0,
            currentLevelXP: 0,
            levelsXpDiff: 0
        }
        this.levelBreaks = [0];
        for (var i = 0; i < 100; i++) {
            this.levelBreaks.push(10 + (i * (10 + i)));
        }
    }
    updateExp(amount) {
        let nextXp = this.xpData.xp + amount;
        let nextLevel = this.xpData.currentLevel;
        for (var i = 0; i < this.levelBreaks.length - 1; i++) {
            if (nextXp >= this.levelBreaks[i] && nextXp < this.levelBreaks[i + 1]) {
                nextLevel = i;
                this.xpData.currentLevelXP = this.levelBreaks[i];
                this.xpData.nextLevelXP = this.levelBreaks[i + 1];
                this.xpData.levelsXpDiff = this.levelBreaks[i + 1] - this.levelBreaks[i];
                break;
            }
        }

        let willLevelUp = false;
        if (nextLevel != this.xpData.currentLevel) {
            this.xpData.currentLevel = nextLevel;
            willLevelUp = true;
        }

        this.xpData.xp = nextXp;

        let range = this.levelBreaks[this.xpData.currentLevel + 1] - this.levelBreaks[this.xpData.currentLevel]
        let diffFrom = this.levelBreaks[this.xpData.currentLevel] ? nextXp % this.levelBreaks[this.xpData.currentLevel] : nextXp
        this.xpData.untilNext = range - diffFrom;
        this.xpData.normalUntilNext = 1 - this.xpData.untilNext / range;

        if (willLevelUp) {
            this.onLevelUp.dispatch(this.xpData);
        }

    }
    equipmentUpdate() {
        this.findAttributes()
        this.equipmentUpdated.dispatch(this.equipmentList);
    }
    addEquipment(equipment, i, j) {
        if(this.equipmentList[i][j].item == equipment.item){
            this.equipmentList[i][j].level += (equipment.level + 1);
        }else{
            if(this.equipmentList[i][j].item){
                this.equipmentList[i][j].level = equipment.level;
            }
        }

        this.equipmentList[i][j].item = equipment.item
        this.equipmentList[i][j].item.level = 2
        this.equipmentList[i][j].item.ingameData = this.equipmentList[i][j];

        this.equipmentUpdate();
    }
    removeEquipment(i, j) {
        if(this.equipmentList[i][j].item){
            this.equipmentList[i][j].item.ingameData = null;
        }
        this.equipmentList[i][j].level = 0;
        this.equipmentList[i][j].item = null;
        this.equipmentUpdate();
    }
    getEquipment(i, j) {
        const copy = new GameplayItem(this.equipmentList[i][j].item);
        copy.level = this.equipmentList[i][j].level;
        return copy;
    }
    findAttributes() {
        this.attributesMultiplier.reset();
        for (var i = 0; i < this.equipmentList.length; i++) {
            for (var j = 0; j < this.equipmentList[i].length; j++) {
                let ingameData = this.equipmentList[i][j];
                if (!ingameData || !ingameData.item) {
                    continue;
                }
                if (ingameData.item.entityData.type == EntityData.EntityDataType.Attribute) {
                    this.attributesMultiplier.addMultiplyer(ingameData.item.attributeEffect, Utils.findValueByLevel(ingameData.item.modifierValue, ingameData.level));
                }
            }
        }
    }
    findAnyEmptySlot() {
        for (var i = 0; i < this.equipmentList.length; i++) {
            for (var j = 0; j < this.equipmentList[i].length; j++) {
                if (!this.equipmentList[i][j].item) {
                    return { i: i, j: j };
                }
            }
        }
        return null;
    }
    findEmptySlotAtLine(j) {
        for (var i = 0; i < this.equipmentList.length; i++) {
            if (!this.equipmentList[i][j].item) {
                return { i: i, j: j };
            }
        }
        return null;
    }
    findEmptySlotAtCol(i) {
        for (var j = 0; j < this.equipmentList[i].length; j++) {

            if (!this.equipmentList[i][j].item) {
                return { i: i, j: j };
            }
        }

        return null;
    }
    addXp(amount) {
        this.updateExp(amount)
        this.xpUpdated.dispatch(this.xpData);
    }
}