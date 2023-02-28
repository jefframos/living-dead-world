import signals from "signals";

export default class PlayerSessionData {
    constructor() {
        this.healthMultiplier = 1;
        this.defenseMultiplier = 1;
        this.speedMultiplier = 1;
        this.bulletSpeedMultiplier = 1;
        this.bulletFrenquencyMultiplier = 1;

        this.equipmentList = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ]

        this.equipmentUpdated = new signals.Signal();
        this.xpUpdated = new signals.Signal();
        this.onLevelUp = new signals.Signal();
    }
    reset() {
        this.healthMultiplier = 1;
        this.defenseMultiplier = 1;
        this.speedMultiplier = 1;
        this.bulletSpeedMultiplier = 1;
        this.bulletFrenquencyMultiplier = 1;

        this.equipmentList = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ]

        this.xpData = {
            xp: 0,
            currentLevel: 0,
            untilNext: 0,
            normalUntilNext: 0
        }
        this.levelBreaks = [0];
        for (var i = 0; i < 100; i++) {
            this.levelBreaks.push(10 + i * 10);
        }
    }
    updateExp(amount) {
        let nextXp = this.xpData.xp + amount;
        let nextLevel = this.xpData.currentLevel;
        for (var i = 0; i < this.levelBreaks.length - 1; i++) {
            if (nextXp >= this.levelBreaks[i] && nextXp < this.levelBreaks[i + 1]) {
                console.log(this.levelBreaks[i], this.levelBreaks[i + 1])
                nextLevel = i;                
            }
        }

        let willLevelUp = false;
        if (nextLevel != this.xpData.currentLevel) {
            this.xpData.currentLevel = nextLevel;
            willLevelUp = true;
        }

        this.xpData.xp = nextXp;

        let range = this.levelBreaks[this.xpData.currentLevel+1] - this.levelBreaks[this.xpData.currentLevel]
        let diffFrom = this.levelBreaks[this.xpData.currentLevel] ? nextXp % this.levelBreaks[this.xpData.currentLevel] : nextXp
        this.xpData.untilNext = range - diffFrom;
        this.xpData.normalUntilNext = 1 - this.xpData.untilNext / range;

        if(willLevelUp){
            this.onLevelUp.dispatch(this.xpData);
        }

    }
    addEquipment(equipment, i, j) {
        this.equipmentList[i][j] = equipment;
        this.equipmentUpdated.dispatch(this.equipmentList);
    }
    removeEquipment(i, j) {
        this.equipmentList[i][j] = null;
        this.equipmentUpdated.dispatch(this.equipmentList);
    }
    getEquipment(i, j) {
        return this.equipmentList[i][j];
    }
    findAnyEmptySlot() {
        for (var i = 0; i < this.equipmentList.length; i++) {
            for (var j = 0; j < this.equipmentList[i].length; j++) {
                if (!this.equipmentList[i][j]) {
                    return { i: i, j: j };
                }
            }
        }
        return null;
    }
    findEmptySlotAtLine(j) {
        for (var i = 0; i < this.equipmentList.length; i++) {
            if (!this.equipmentList[i][j]) {
                return { i: i, j: j };
            }
        }
        return null;
    }
    findEmptySlotAtCol(i) {
        for (var j = 0; j < this.equipmentList[i].length; j++) {

            if (!this.equipmentList[i][j]) {
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