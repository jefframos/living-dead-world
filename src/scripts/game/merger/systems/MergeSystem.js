import * as PIXI from 'pixi.js';

import ChargerTile from '../tiles/ChargerTile';
import MergeTile from '../tiles/MergeTile';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';

export default class MergeSystem {
    constructor(containers, data, dataTiles, systemID) {

        this.baseData = data;

        
        this.systemID = systemID;
        this.gameplayData = data.general;

        this.container = containers.mainContainer;
        this.uiContainer = containers.uiContainer;
        this.wrapper = containers.wrapper;
        this.topContainer = containers.topContainer;
        this.slotSize = data.slotSize;
        this.area = data.area;
        this.onGetResources = new Signals();
        this.onDealDamage = new Signals();
        this.onPopLabel = new Signals();
        this.onParticles = new Signals();
        this.onEntityMerge = new Signals();
        this.onEntityAdd = new Signals();
        this.onBoardLevelUpdate = new Signals();
        this.onNextLevel = new Signals();
        this.updateAvailableSlots = new Signals();
        this.updateMaxLevel = new Signals();
        this.specialTileReveal = new Signals();

        this.slotsContainer = new PIXI.Container();
        this.container.addChild(this.slotsContainer)

        this.dataTiles = dataTiles;
        this.matrix = utils.cloneMatrix(data.gameMap)

        this.pieceGeneratorsList = [];


        this.maxTilePlaced = 0
        this.latest = 0;

        this.mousePosition = {
            x: 0,
            y: 0
        };

        this.fixedSize = {
            width: 0,
            height: 0,
            scale: { x: 1, y: 1 }
        }

        this.fixedBottomSize = {
            width: this.wrapper.width,
            height: this.slotSize.height,
            scale: { x: 1, y: 1 }
        }

        this.currentResolution = {
            width: 0,
            height: 0
        }
        this.resources = 0;
        this.dps = 0;
        this.rps = 0;
        this.virtualSlots = [];
        this.slots = [];

        for (var i = 0; i < this.matrix.length; i++) {
            let temp = []
            let temp2 = []
            for (var j = 0; j < this.matrix[i].length; j++) {
                temp.push(0)
                temp2.push(0)
            }
            this.slots.push(temp);
            this.virtualSlots.push(temp2);
        }

        for (var i = 0; i < this.matrix.length; i++) {
            for (var j = 0; j < this.matrix[i].length; j++) {
                let slotID = this.matrix[i][j];
                this.addSlot(i, j);
                this.virtualSlots[i][j].visible = false;
                if (slotID == 0) {
                    this.virtualSlots[i][j].visible = true;
                }
            }
        }

        this.mainGenerator = this.addPieceGenerator();

        this.uiContainer.addChild(this.mainGenerator)
        this.mainGenerator.y = this.mainGenerator.height / 2 - 5
        this.adjustSlotsPosition();

        this.entityDragSprite = new PIXI.Sprite.from('');
        this.topContainer.addChild(this.entityDragSprite);
        this.entityDragSprite.visible = false;

        this.shootColor = 0x00FFFF
        //force to resize
        setTimeout(() => {
            this.resize(config, true)
        }, 1);

        this.enemySystem = null;
        this.systems = [];

        setTimeout(() => {
            this.adjustSlotsPosition()
        }, 100);

        window.gameModifyers.onUpdateModifyers.add(() => {
            this.dps = utils.findDPS(this.slots);
            this.rps = utils.findRPS(this.slots);
        })

        window.gameModifyers.onActiveBonus.add((type) => {
            if (type == 'autoMerge') {
                this.findAllAutomerges()
            }
        })

        this.highestPiece = 0;

        this.visible = true;

        this.slotSpawned = Math.floor(Math.random() * 20)
    }

    resetSystem() {
        for (let index = 0; index < this.virtualSlots.length; index++) {
            for (let j = 0; j < this.virtualSlots[index].length; j++) {
                const element = this.virtualSlots[index][j];
                if (element && !element.isEmpty()) {
                    element.removeEntity();
                }
            }
        }


        this.updateTotalGenerators();

        COOKIE_MANAGER.resetBoard(this.systemID)

        this.loadData();

        this.boardLevel = 0;
        this.highestPiece = 0;
        this.latest = 0;
        this.maxTilePlaced = 0;

        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if (this.slots[i][j]) {
                    let slot = this.slots[i][j];
                    if (window.baseConfigGame.gameMap[i][j] <= this.boardLevel) {
                        slot.visible = true;
                    } else {
                        slot.visible = false;
                    }
                    this.virtualSlots[i][j].visible = slot.visible;
                }
            }
        }
        this.updateAllData();
    }
    loadData() {
        this.isInitialized = false;
        this.isLoaded = true;
        this.savedProgression = COOKIE_MANAGER.getBoard(this.systemID);
        this.isInitialized = COOKIE_MANAGER.isInitialized(this.systemID);
        this.savedGifts = COOKIE_MANAGER.getGifts(this.systemID);

        this.boardProgression = this.savedProgression.boardLevel;
        this.boardLevel = 1
        this.levelUp(this.savedProgression.currentBoardLevel, true)



        for (const key in this.savedProgression.entities) {
            const element = this.savedProgression.entities[key];
            if (element) {
                let split = key.split(";")


                let found = this.findEntityByID(element.nameID)
                if (found) {

                    this.virtualSlots[split[0]][split[1]].addEntity(found)

                    if (found.rawData.id > this.highestPiece) {
                        this.highestPiece = found.rawData.id;
                    }

                    this.virtualSlots[split[0]][split[1]].visible = true;
                }
            }
        }

        for (const key in this.savedProgression.dataProgression) {
            const element = this.savedProgression.dataProgression[key];
            if (element) {

                let found = this.findEntityByID(key)
                if (found) {
                    found.setLevel(element.currentLevel)
                }
            }
        }


        for (const key in this.savedGifts.entities) {
            const element = this.savedGifts.entities[key];
            if (element) {
                let split = key.split(";")

                if (element && element > 0 && !this.virtualSlots[split[0]][split[1]].tileData) {
                    if (element == 1) {
                        var slot = this.virtualSlots[split[0]][split[1]]
                        slot.addEntity(this.dataTiles[this.calcNormalNextCard()])
                        slot.giftState();
                        COOKIE_MANAGER.addMergePiece(null, slot.id.i, slot.id.j, this.systemID, 1)
                    } else if (element == 2) {
                        var slot = this.virtualSlots[split[0]][split[1]]
                        slot.addEntity(this.dataTiles[this.calcNormalNextCard()])
                        slot.specialState();
                        COOKIE_MANAGER.addMergePiece(null, slot.id.i, slot.id.j, this.systemID, 2)
                    }
                }
            }
        }



        this.checkMax();
        this.boardLevel = -1
        this.levelUp(this.highestPiece - 3, true)
        this.updateAllData();

        setTimeout(() => {
            this.onBoardLevelUpdate.dispatch(this.boardProgression)
            this.updateAvailableSlots.dispatch(this.totalAvailable())
            this.checkMax();
            this.updateMaxLevel.dispatch(this.highestPiece, true);
        }, 1);
    }
    activeSystem() {
        this.onBoardLevelUpdate.dispatch(this.boardProgression)
        this.updateAvailableSlots.dispatch(this.totalAvailable())
        this.checkMax();
        this.updateMaxLevel.dispatch(this.highestPiece, true);

        let latest = COOKIE_MANAGER.getEconomy(this.systemID);
        let timeDiff = (Date.now() / 1000) - latest.lastOpen

        let totalToSpawn = Math.min(Math.floor(timeDiff % 5) - 1, this.totalAvailable())

        

        setTimeout(() => {
            this.updateAllData();
            for (let index = 0; index < totalToSpawn; index++) {
                this.mainGenerator.addEntity(this.dataTiles[this.calcNormalNextCard()]);
                this.sortAutoMerge(this.mainGenerator)
            }
        }, 1);

        COOKIE_MANAGER.openSystem(this.systemID);
    }
    checkMax() {
        for (var i = 0; i < this.virtualSlots.length; i++) {
            for (var j = 0; j < this.virtualSlots[i].length; j++) {
                if (this.virtualSlots[i][j] && this.virtualSlots[i][j].tileData && this.virtualSlots[i][j].visible) {
                    if (this.virtualSlots[i][j].tileData.rawData.id > this.highestPiece) {
                        this.highestPiece = this.virtualSlots[i][j].tileData.rawData.id;
                    }
                }

            }
        }
        //alert(this.highestPiece)
    }
    findUpgrade(item) {

        this.dps = utils.findDPS(this.slots);
    }
    findEntityByID(id) {
        for (let index = 0; index < this.dataTiles.length; index++) {
            const element = this.dataTiles[index];
            if (element.rawData.nameID == id) {
                return element
            }
        }
    }
    addSystem(system) {
        this.systems.push(system);
    }
    addPieceGenerator() {
        let piece = new ChargerTile(0, 0, this.slotSize.width * 0.85, 'coin', this.gameplayData.entityGeneratorBaseTime, this.baseData.visuals);
        piece.systemID = this.systemID;
        piece.isGenerator = true;
        piece.onShowParticles.add(() => {
            let customData = {}
            customData.forceX = 0
            customData.forceY = 100
            customData.gravity = 0
            customData.scale = 0.05
            customData.alphaDecress = 1
            customData.texture = 'smallButton'

            let pos = piece.tileSprite.getGlobalPosition()
            pos.x += Math.random() * 40 //- 20
            pos.y -= Math.random() * 40
            this.onParticles.dispatch(pos, customData, 1)
        })
        let targetScale = config.height * 0.25 / piece.height
        piece.scale.set(Math.min(targetScale, 1.5))
        piece.onCompleteCharge.add((slot) => {
            let id = 0;
            if (this.boardLevel > 4) {
                id = Math.min(Math.floor(Math.random() * this.boardLevel / 3), 5);
            }

            if (id > 0) {
                id = Math.min(Math.floor(Math.random() * this.boardLevel / 3), 5);
            }
            if (id > 0) {
                id = Math.min(Math.floor(Math.random() * this.boardLevel / 3), 5);
            }

            id = Math.min(this.dataTiles.length - 1, id)
            piece.addEntity(this.dataTiles[id]);
            this.sortAutoMerge(piece)

            //piece.startCharging()
        });
        this.pieceGeneratorsList.push(piece);
        if (this.pieceGeneratorsList.length > 1) {
            //piece.visible = false;
        }

        return piece;
    }
    calcNormalNextCard() {
        let id = 0;
        if (this.boardLevel > 4) {
            id = Math.min(Math.floor(Math.random() * this.boardLevel / 3), 5);
        }

        if (id > 0) {
            id = Math.min(Math.floor(Math.random() * this.boardLevel / 3), 5);
        }
        if (id > 0) {
            id = Math.min(Math.floor(Math.random() * this.boardLevel / 3), 5);
        }

        id = Math.min(this.dataTiles.length - 1, id)

        return id
    }
    findAllAutomerges() {
        // if (window.gameModifyers.modifyersData.autoMerge > 1 || window.gameModifyers.bonusData.autoMerge > 1) {
        //     this.pieceGeneratorsList.forEach(element => {
        //         if (element.isCharged) {
        //             this.sortAutoMerge(element);
        //         }
        //     });
        // }
    }
    buyEntity(data) {

        COOKIE_MANAGER.addAchievment(this.systemID, 'buy', 1)
        let allAvailables = []
        let firstAvailable = null;
        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if (this.slots[i][j] && !this.slots[i][j].tileData && this.slots[i][j].visible) {
                    allAvailables.push(this.slots[i][j])
                }

            }
        }

        let slot = allAvailables[Math.floor(Math.random() * allAvailables.length)]
        slot.addEntity(data)
        this.releaseEntity(slot)

        if (slot) {
            slot.giftState()
        }

        if (window.gameModifyers.modifyersData.autoMerge == 2) {

            this.autoMerge();
        }

        this.updateAvailableSlots.dispatch(this.totalAvailable())
    }
    sortAutoMerge(piece) {
        if (!piece.tileData) return;

        this.autoPlace(piece);
        // if (window.gameModifyers.modifyersData.autoMerge > 1 || window.gameModifyers.bonusData.autoMerge > 1) {
        //     this.autoMerge()
        // }
    }
    updateMouseSystems(e) {
        if (!this.visible) return
        this.updateMouse(e);

        this.systems.forEach(element => {
            element.updateMouse(e);
        });
    }
    updateMouse(e) {
        if (!this.visible) return
        if (e) {
            this.mousePosition = e.data.global;
        }
        if (!this.draggingEntity || !this.currentDragSlot) {
            this.entityDragSprite.visible = false
            return;
        }

        if (this.entityDragSprite.visible) {
            let toLocal = this.entityDragSprite.parent.toLocal(this.mousePosition)
            this.entityDragSprite.x = toLocal.x;
            this.entityDragSprite.y = toLocal.y;
        }
    }
    adjustSlotsPosition() {
        this.updateAllData()
    }
    levelUp(nextLevel, ignoreSave = false) {
        this.currentDragSlot = null
        if (this.boardLevel != nextLevel) {
            this.boardLevel = nextLevel;
            if (!ignoreSave) {
                COOKIE_MANAGER.saveBoardLevel(this.boardLevel, this.systemID)
            }
        } else {
            return;
        }

        for (let index = 0; index < window.baseConfigGame.gameMap.length; index++) {
            for (let j = 0; j < window.baseConfigGame.gameMap[index].length; j++) {
                if (window.baseConfigGame.gameMap[index][j] <= this.boardLevel) {
                    this.virtualSlots[index][j].visible = true;
                    if (this.virtualSlots[index][j] == 0) {
                        //this.addSlot(index, j);
                        this.latest++;
                    }
                }
            }
        }


    }
    updateSystems(delta) {

        this.slotsContainer.visible = this.visible;
        this.mainGenerator.visible = this.visible;
        if (!this.visible) return
        this.update(delta);

        this.systems.forEach(element => {
            element.update(delta);
        });
    }
    update(delta) {

        
        this.pieceGeneratorsList.forEach(piece => {
            if (this.totalAvailable() > 0) {
                piece.standardState();
            } else {
                piece.blockState();
            }
            if (piece.visible) {
                piece.update(delta * window.gameModifyers.bonusData.generateTimerBonus);
            }
        });

        this.systems.forEach(element => {
            element.update(delta);
        });
        this.timestamp = (Date.now() / 1000 | 0);
        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if (this.slots[i][j]) {

                    let slot = this.slots[i][j];

                    if (this.enemySystem) {
                        slot.lookAt(this.enemySystem.getEnemy());
                    }
                    slot.update(delta, this.timestamp, true);
                }
            }
        }

        this.updateBottomPosition();
    }
    addDataTo(slot, id) {
        slot.removeEntity()
        slot.addEntity(this.dataTiles[id]);
        slot.reveal()
    }
    addSlot(i, j) {
        let slot = new MergeTile(i, j, this.slotSize.width, 'coin', this.baseData.visuals);
        this.slots[i][j] = slot;

        slot.x = (this.slotSize.width + this.slotSize.distance) * j - this.slotSize.distance
        slot.y = (this.slotSize.height + this.slotSize.distance) * i - this.slotSize.distance
        slot.onClick.add((slot) => {
        });
        slot.onHold.add((slot) => {
            this.startDrag(slot)
        });
        slot.onReveal.add((slot) => {

            COOKIE_MANAGER.addMergePiece(slot.tileData, slot.id.i, slot.id.j, this.systemID, 0)
            COOKIE_MANAGER.addAchievment(this.systemID, 'reveal', 1)

            SOUND_MANAGER.play('Pop-Tone', 0.3)

            this.updateAllData();
        });


        slot.onEndHold.add((slot) => {
            this.endDrag(slot)

        });
        slot.onUp.add((slot) => {
            this.releaseEntity(slot)

            this.currentDragSlot = null;
            this.draggingEntity = false;

            this.entityDragSprite.visible = false
        });
        slot.onSpecialReveal.add((slot) => {
            this.checkMax();

            var gift = this.highestPiece - 3;
            gift = Math.max(gift, 0);
            let target = Math.round(gift * Math.random());

            COOKIE_MANAGER.addAchievment(this.systemID, 'revealMystery', 1)
            this.specialTileReveal.dispatch(slot, target);
        })
        slot.onGenerateResource.add((slot, data) => {
            this.resources += data.resources

            let customData = {}
            customData.texture = this.baseData.visuals.coin
            customData.scale = 0.03
            customData.forceX = 0
            customData.forceY = 50
            customData.alphaDecress = 1
            let targetPos = slot.tileSprite.getGlobalPosition()
            //this.onGetResources.dispatch(targetPos, customData, data.getDamage(), 1)
            this.onGetResources.dispatch(targetPos, customData, Math.pow(2, data.rawData.id + 1), 1)

        });
        slot.onGenerateDamage.add((slot, data) => {
            // let customData = {}
            // customData.texture = 'shoot'
            // customData.scale = 0.002
            // customData.topLimit = this.enemySystem.getEnemy().getGlobalPosition().y

            // customData.gravity = 0
            // customData.alphaDecress = 0
            // if (this.enemySystem) {
            //     let globalEnemy = this.enemySystem.getEnemy().getGlobalPosition()
            //     customData.target = { x: globalEnemy.x, y: globalEnemy.y, timer: 0, speed: 700 }
            // }
            // customData.forceX = 0
            // customData.forceY = 300
            // customData.tint = this.shootColor
            // customData.callback = this.finishDamage.bind(this, data)
            // let targetPos = slot.tileSprite.getGlobalPosition()
            // this.onDealDamage.dispatch(targetPos, customData, data.getDamage(), 1)

            
            //this.posShootingParticles(targetPos)

        });

        this.slotsContainer.addChild(slot);

        this.virtualSlots[i][j] = slot;

        this.adjustSlotsPosition()
    }
    posShootingParticles(targetPos) {
        let customData = {}
        customData.texture = 'spark2'
        customData.scale = 0.002
        customData.alphaDecress = 0.5
        customData.gravity = 0
        customData.tint = this.shootColor

        for (let index = 0; index < 5; index++) {
            let particleAng = Math.random() * 3.14;
            customData.forceX = Math.cos(particleAng) * 50
            customData.forceY = Math.sin(particleAng) * 50
            this.onParticles.dispatch(targetPos, customData, 1)
        }
    }
    finishDamage(data) {
        if (this.enemySystem) {

            this.enemySystem.damageEnemy(data.getDamage())
        }
    }
    startDrag(slot) {
        if (!this.visible) return
        this.draggingEntity = true;
        let tex = slot.hideSprite();
        this.currentDragSlot = slot;

        SOUND_MANAGER.play('pop2',0.5, Math.random() * 0.1 + 0.9)

        this.entityDragSprite.texture = tex;
        this.entityDragSprite.visible = true;
        this.entityDragSprite.scale.set(slot.tileSprite.scale.y * 1.25);
        if (window.isMobile) {
            this.entityDragSprite.anchor.set(0.5, 0.5);
        } else {
            this.entityDragSprite.anchor.set(0.5, 0.5);
        }
        this.entityDragSprite.alpha = 0.85
        this.updateMouse();
    }
    endDrag(slot) {
        if (!this.visible) return

        if (!this.draggingEntity) {

        }

        this.draggingEntity = false;
        this.entityDragSprite.visible = false;
        slot.showSprite();

        this.updateAllData();
    }
    removeEntity(slot) {
        if (!this.visible) return
        if (this.currentDragSlot) {
            //return
            //SOUND_MANAGER.play('place2')

            this.currentDragSlot.removeEntity();
            slot = this.currentDragSlot
        } else {
            slot.removeEntity();
        }

        this.updateAllData();


    }
    addShipBasedOnMax(value = 2) {
        let slot = this.findFirstAvailable();
        if (!slot) {
            return;
        }
        let max = Math.max(1, utils.findMax(this.slots) - value)
        let data = this.dataTiles[max]

        //slot.removeEntity();
        slot.addEntity(data);
        //slot.giftState();
        //slot.specialState();
        //COOKIE_MANAGER.addMergePiece(null, slot.id.i, slot.id.j, this.systemID, 2)

        let customData = {}
        customData.forceX = 0
        customData.forceY = 100
        customData.gravity = 0
        customData.scale = 0.05
        customData.alphaDecress = 1
        customData.texture = 'shipPrize'
        this.onParticles.dispatch(slot.tileSprite.getGlobalPosition(), customData, 1)

        // this.updateAllData();

        //COOKIE_MANAGER.addMergePiece(data, slot.id.i, slot.id.j, this.systemID, 0)

        return slot;
    }
    findFirstAvailable() {
        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if (this.slots[i][j] && this.slots[i][j].visible && !this.slots[i][j].tileData) {
                    let slot = this.slots[i][j];
                    return slot;
                }

            }
        }
    }
    findMergeInBoard(piece, diff) {
        if (piece.tileData.isDirty) {
            return
        }
        let firstAvailable = null;
        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if (diff.i != i || diff.j != j) {

                    if (this.slots[i][j] && this.slots[i][j].tileData && !this.slots[i][j].tileData.isDirty) {
                        let slot = this.slots[i][j];
                        if (slot.tileData.getValue() == piece.tileData.getValue()) {
                            firstAvailable = this.slots[i][j];
                            piece.tileData.isDirty = true;
                            slot.tileData.isDirty = true;
                            break;

                        }
                    }
                }
            }
        }

        if (firstAvailable) {
            this.currentDragSlot = piece;
            this.releaseEntity(firstAvailable)
        }
    }
    autoMerge() {

        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if (this.slots[i][j] && this.slots[i][j].tileData) {
                    this.slots[i][j].tileData.isDirty = false;
                }
            }
        }
        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if (this.slots[i][j] && this.slots[i][j].tileData && !this.slots[i][j].tileData.isDirty) {
                    this.findMergeInBoard(this.slots[i][j], { i, j });
                }
            }
        }
    }
    totalAvailable() {
        let av = 0
        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if (this.slots[i][j] && !this.slots[i][j].tileData && this.slots[i][j].visible) {
                    av++
                }

            }
        }

        return av
    }
    autoPlace(piece) {
        
        let allAvailables = []
        let firstAvailable = null;
        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if (this.slots[i][j] && !this.slots[i][j].tileData && this.slots[i][j].visible) {
                    allAvailables.push(this.slots[i][j])
                }

            }
        }

        //this.currentDragSlot = piece;

        // if (piece.isGenerator) {


        //     this.endDrag(piece)
        //     setTimeout(() => {
        //         if (!piece.tileData) {
        //             piece.startCharging()
        //         }
        //     }, 10);
        // }

        if (firstAvailable && firstAvailable.tileData) {

        }

        let slot = allAvailables[Math.floor(Math.random() * allAvailables.length)]
        this.releaseEntity(slot, piece, false)

        if (slot) {
            //slot.giftState()
            if (this.boardLevel > 3) {
                this.slotSpawned--
            } else {
                this.slotSpawned = 3
            }

            if (this.slotSpawned <= 0) {
                this.slotSpawned += Math.floor(Math.random() * 10 + 8)
                slot.specialState()
                COOKIE_MANAGER.addMergePiece(null, slot.id.i, slot.id.j, this.systemID, 2)
            } else {
                slot.giftState()
                COOKIE_MANAGER.addMergePiece(null, slot.id.i, slot.id.j, this.systemID, 1)
            }
        }

        
        if (this.totalAvailable() > 0) {
            piece.startCharging()
        }

        if (window.gameModifyers.modifyersData.autoMerge == 2) {

            this.autoMerge();
        }
    }
    updateProgression(addId) {
        let target = getLevels(this.boardProgression.currentLevel)
        this.boardProgression.progress += addId
        if (target <= this.boardProgression.progress) {
            this.boardProgression.progress = this.boardProgression.progress % target
            this.boardProgression.currentLevel++

            this.onNextLevel.dispatch(this.boardProgression)
        }
        this.boardProgression.percent = this.boardProgression.progress / getLevels(this.boardProgression.currentLevel)
        this.onBoardLevelUpdate.dispatch(this.boardProgression)


        COOKIE_MANAGER.saveBoardProgress(this.boardProgression, this.systemID)
    }
    addSpecialPiece() {
        let slot = this.addShipBasedOnMax();
        slot.giftState()
        slot.specialState()
        COOKIE_MANAGER.addMergePiece(null, slot.id.i, slot.id.j, this.systemID, 2)
        this.updateAvailableSlots.dispatch(this.totalAvailable())
    }
    releaseEntity(slot, customDrag, update = true) {
        if (!this.visible) return
        if ((!this.currentDragSlot && !customDrag) || !slot) {
            return;
        }
        let currentDrag = customDrag ? customDrag : this.currentDragSlot
        let copyData = currentDrag.tileData
        let copyDataTargetSlot = null;
        if (slot.tileData) {
            copyDataTargetSlot = slot.tileData;
        }

        if (copyDataTargetSlot) {
            let target = copyDataTargetSlot
            if (copyDataTargetSlot.getValue() == copyData.getValue()) {
                //only remove if they will merge
                currentDrag.removeEntity();
                COOKIE_MANAGER.addMergePiece(null, currentDrag.id.i, currentDrag.id.j, this.systemID, 0)
                target = this.dataTiles[Math.min(this.dataTiles.length - 1, copyDataTargetSlot.getID() + 1)]
                slot.removeEntity();

                slot.addEntity(target);
                COOKIE_MANAGER.addMergePiece(target, slot.id.i, slot.id.j, this.systemID, 0)
                this.updateProgression(target.rawData.id + 1)

                this.onEntityMerge.dispatch()

                SOUND_MANAGER.play('pop', 0.4, Math.random() * 0.1 + 0.9)
                COOKIE_MANAGER.addAchievment(this.systemID, 'merge', 1)


            } else {

                if (!currentDrag.isGenerator) {
                    //swap
                    currentDrag.removeEntity();
                    currentDrag.addEntity(copyDataTargetSlot);
                    slot.removeEntity();
                    slot.addEntity(copyData);
                    COOKIE_MANAGER.addMergePiece(copyData, slot.id.i, slot.id.j, this.systemID, 0)
                } else {
                    //doesnt do anything coz is coming from the generator
                    //currentDrag.addEntity(copyDataTargetSlot); 
                    this.onEntityAdd.dispatch()

                }
            }
        } else {
            currentDrag.removeEntity();
            COOKIE_MANAGER.addMergePiece(null, currentDrag.id.i, currentDrag.id.j, this.systemID, 0)
            slot.addEntity(copyData);
            COOKIE_MANAGER.addMergePiece(copyData, slot.id.i, slot.id.j, this.systemID, 0)
            this.onEntityAdd.dispatch()



        }


        if (update) {
            let tempMaxTiledPlaced = utils.findMax(this.slots);
            if (tempMaxTiledPlaced > this.highestPiece) {
                this.highestPiece = tempMaxTiledPlaced;

                this.updateMaxLevel.dispatch(this.highestPiece);
            }

            if (tempMaxTiledPlaced > this.maxTilePlaced) {
                this.maxTilePlaced = tempMaxTiledPlaced;
                let nextLevel = Math.max(0, this.maxTilePlaced - 3);
                this.levelUp(nextLevel)
            }
            this.draggingEntity = false;
            this.currentDragSlot = null;
        }
        //this.levelUp()

        setTimeout(() => {
            this.updateAllData();
            //this.rps = utils.findRPS3(this.slots);
        }, 1);

        this.updateAvailableSlots.dispatch(this.totalAvailable())
        if (this.totalAvailable() > 0) {
            if (this.mainGenerator.isCharged)
                this.mainGenerator.startCharging()
        }


    }
    updateTotalGenerators() {

        for (let index = 0; index < this.pieceGeneratorsList.length; index++) {
            var piece = this.pieceGeneratorsList[index]
            piece.visible = index < window.gameModifyers.getTotalGenerators();
        }

    }
    updateAllData() {
        this.dps = utils.findDPS(this.slots);
        this.rps = utils.findRPS3(this.slots);



        let clone = utils.cloneMatrix(this.slots)

        let trimmed = utils.trimMatrix2(clone);
        let sides = trimmed.left + trimmed.right
        let ups = trimmed.top + trimmed.bottom;

        let horizontal = (this.slots[0].length - sides)
        let vertical = (this.slots.length - ups)

        this.fixedSize.width = horizontal * this.slotSize.width + (this.slotSize.distance * (horizontal - 1) + this.slotSize.distance * 2)
        this.fixedSize.height = vertical * this.slotSize.height + (this.slotSize.distance * (vertical - 1))

        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if (this.slots[i][j]) {
                    let slot = this.slots[i][j];

                    slot.y = ((this.slotSize.height + this.slotSize.distance)) * i

                    let scale = ((slot.y + this.slotSize.distance) / this.fixedSize.height) * this.area.perspective + (1 - this.area.perspective)
                    slot.scale.set(scale)
                    slot.x = ((this.slotSize.width + this.slotSize.distance) * scale) * j + (horizontal * this.slotSize.width * (1 - scale)) / 2 //- this.slotSize.distance
                    slot.y = ((this.slotSize.height + this.slotSize.distance) * scale) * i + (this.slotSize.distance * scale) * vertical - this.slotSize.distance * 2
                }
            }
        }

        this.updateTotalGenerators();
        if (this.wrapper) {
            this.updateGridPosition();
        }

    }
    resize(resolution, force) {
        if (!this.visible) return
        if (!force && this.currentResolution.width == resolution.width && this.currentResolution.height == resolution.height) {
            //return;
        }

        this.currentResolution.width = resolution.width;
        this.currentResolution.height = resolution.height;

        this.updateGridPosition();
        this.updateBottomPosition();

    }
    updateGridPosition() {

        utils.resizeToFitARCap(this.wrapper, this.container, this.fixedSize)



        this.container.x = this.wrapper.x + this.wrapper.width / 2 - (this.fixedSize.width * this.container.scale.x) / 2 + this.slotSize.distance * this.container.scale.x;;
        this.container.y = this.wrapper.y + this.wrapper.height / 2 - (this.fixedSize.height * this.container.scale.x) / 2 + this.slotSize.distance * this.container.scale.y;

    }
    updateBottomPosition() {
        let accumPiece = 0;
        let maxPos = 0
        this.pieceGeneratorsList.forEach(piece => {
            if (piece.visible) {
                piece.x = (piece.backShape.width + this.slotSize.distance) * accumPiece
                accumPiece++
                maxPos = piece.x + piece.backShape.width * piece.scale.x
            }
        });
        let bottomWrapperDiff = this.wrapper.y + this.wrapper.height
        let bottomDiff = config.height - bottomWrapperDiff
        let targetScale = bottomDiff / this.slotSize.height * 0.55
        targetScale = Math.min(1, targetScale)
        this.uiContainer.scale.set(targetScale)
        this.uiContainer.y = bottomWrapperDiff + (bottomDiff) / 2 - (this.slotSize.height * this.uiContainer.scale.y) / 2 - 45// - this.wrapper.y + this.wrapper.height //- (this.slotSize.height * this.uiContainer.scale.y) - config.height * 0.05
        this.uiContainer.x = this.wrapper.x + this.wrapper.width / 2 - (maxPos * this.uiContainer.scale.x) / 2
        if (!window.isPortrait) {
            this.uiContainer.y -= this.slotSize.height * 1.5
            this.uiContainer.scale.set(1)
            this.uiContainer.x = this.wrapper.x + this.wrapper.width
        }


        // this.mainGenerator.y = this.container.height + 
    }

}
