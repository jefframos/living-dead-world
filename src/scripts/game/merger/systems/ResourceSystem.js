import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import ResourceTile from '../tiles/ResourceTile';

export default class ResourceSystem {
    constructor(containers, data, dataTiles) {

        this.dataTiles = dataTiles;
        this.gameplayData = data.general;

        this.slotSize = data.slotSize;
        this.resourceSlotSize = data.slotSize;
        this.area = data.area;

        this.container = containers.mainContainer;
        this.wrapper = containers.wrapper;

        this.onGetResources = new Signals();
        this.onParticles = new Signals();
        this.onPopLabel = new Signals();
        this.onStandardPopUp = new Signals();

        this.slotsContainer = new PIXI.Container();
        this.container.addChild(this.slotsContainer)

        this.currentResolution = {
            width: 0,
            height: 0
        }

        this.fixedSize = {
            width: 0,
            height: 0,
            scale: { x: 1, y: 1 }
        }
        this.mousePosition = { x: 0, y: 0 }
        this.resourceSlots = []

        this.savedResources = COOKIE_MANAGER.getResources();



        this.sumStart = 0;
        this.loadData();

        this.timestamp = (Date.now() / 1000 | 0);

        setTimeout(() => {
            this.resize(config, true)
        }, 1);

        this.rps = 0;
    }
    resetSystem() {
        this.resourceSlots.forEach(element => {
            element.resetTile();
        })
    }
    loadData() {
        this.dataTiles.forEach(element => {
            if (this.savedResources.entities[element.rawData.nameID]) {
                let saved = this.savedResources.entities[element.rawData.nameID];
                let time = saved.latestResourceAdd - saved.latestResourceCollect
                this.addResourceSlot(element, this.savedResources.entities[element.rawData.nameID]);
                this.sumStart += time * element.getRPS();

            } else {
                this.addResourceSlot();
            }
        });
    }
    collectStartAmount(mult = 1) {
        gameEconomy.addResources(this.sumStart * mult)
        COOKIE_MANAGER.resetAllCollects();
        this.sumStart = 0;
    }
    collectCustomStartAmount(sumStart) {
        gameEconomy.addResources(sumStart)
        COOKIE_MANAGER.resetAllCollects();
        this.sumStart = 0;
    }
    update(delta) {
        this.timestamp = (Date.now() / 1000 | 0)

        if (window.gameModifyers.bonusData.resourceSpeed < 1) {
            delta *= 10;
        }
        this.resourceSlots.forEach(element => {
            element.update(delta, this.timestamp)
        });

        this.rps = utils.findRPS2(this.resourceSlots)
    }
    purchaseSlot(slot) {
        if (!slot.tileData) {
            if (window.gameEconomy.hasEnoughtResources(slot.initialCost)) {
                window.gameEconomy.useResources(slot.initialCost)
                slot.addEntity(this.dataTiles[slot.id])
                COOKIE_MANAGER.buyResource(this.dataTiles[slot.id])

            }
            return;
        }
    }
    addResourceSlot(dataToAdd, savedStats) {
        let piece = new ResourceTile(0, 0, this.resourceSlotSize.width, 'coin', this.gameplayData.entityGeneratorBaseTime);
        let targetScale = config.height * 0.2 / piece.height
        piece.scale.set(Math.min(targetScale, 1))

        piece.onHold.add((slot) => {
            if (!slot.tileData) {
                return;
            }
        });
        piece.onEndHold.add((slot) => {
            if (!slot.tileData) {
                return;
            }
        });
        piece.onUp.add((slot) => {
            this.purchaseSlot(slot);
        });
        piece.onShowParticles.add((slot) => {
            let customData = {}
            customData.texture = 'coin'
            customData.scale = 0.01
            customData.alphaDecress = 0.5
            customData.gravity = 0
            let ang = Math.random() * 3.14 * 2;
            customData.forceX = Math.cos(ang) * 25
            customData.forceY = Math.sin(ang) * 25

            this.onParticles.dispatch(slot.resourceSource.getGlobalPosition(), customData, 1)
        })
        piece.onGenerateResource.add((slot, data, totalResources, quant, skipParticles) => {
            let customData = {}
            customData.texture = 'coin'
            customData.scale = 0.01
            customData.alphaDecress = 0.1

            COOKIE_MANAGER.pickResource(data)

            let targetPos = slot.tileSprite.getGlobalPosition()


            this.onGetResources.dispatch(targetPos, customData, totalResources, quant, skipParticles)

        });
        this.container.addChild(piece);

        piece.id = this.resourceSlots.length;

        piece.setTargetData(this.dataTiles[piece.id])
        if (this.dataTiles[piece.id].rawData.isFirst) {
            piece.forcePriceToZero();
        }
        this.resourceSlots.push(piece)


        if (dataToAdd) {
            piece.addEntity(dataToAdd);
            piece.updateSavedStats(savedStats);
        }


        let vertical = this.resourceSlots.length
        let horizontal = 1
        this.fixedSize.width = this.resourceSlotSize.width
        this.fixedSize.height = vertical * this.resourceSlotSize.height + (this.resourceSlotSize.distance * (vertical - 1))

    }
    resize(resolution, force) {

        if (!force && this.currentResolution.width == resolution.width && this.currentResolution.height == resolution.height) {
            //return;
        }
        this.currentResolution.width = resolution.width;
        this.currentResolution.height = resolution.height;

        if (window.isPortrait) {

            this.resourceSlots.forEach(piece => {

                let targetScale = config.height * 0.2 / 60
                piece.scale.set(Math.min(targetScale, 1))
            });
        } else {
            this.resourceSlots.forEach(piece => {

                let targetScale = config.height * 0.3 / 60
                piece.scale.set(Math.min(targetScale, 1.2))
            });
        }


        this.updateGridPosition();

    }
    findUpgrade(item) {
        this.resourceSlots.forEach(element => {
            if (element.tileData && element.tileData.id == element.id) {
                element.tileData.setLevel(item.currentLevel)
            }
        });
    }
    updateGridPosition() {


        utils.resizeToFitARCap(this.wrapper, this.container, this.fixedSize)

        this.container.x = this.wrapper.x//this.wrapper.x + this.wrapper.width / 2 - (this.fixedSize.width * this.container.scale.x) / 2 + this.slotSize.distance * this.container.scale.x;;
        this.container.y = this.wrapper.y + this.wrapper.height / 2 - (this.fixedSize.height * this.container.scale.x) / 2 + this.slotSize.distanceResources * this.container.scale.y;


        for (let index = this.resourceSlots.length - 1; index >= 0; index--) {
            const element = this.resourceSlots[this.resourceSlots.length - 1 - index];
            element.y = (this.slotSize.height + this.slotSize.distanceResources) * index
        }

    }

    updateMouse(e) {
        if (e) {
            this.mousePosition = e.data.global;

            //if (window.isMobile) {

            this.resourceSlots.forEach(element => {
                let globalPosition = element.getCenterPosition();
                if (element.tileData) {
                    let dist = utils.distance(globalPosition.x, globalPosition.y, this.mousePosition.x, this.mousePosition.y)
                    let scaled = (this.resourceSlotSize.height * this.container.scale.x) / 2
                    if (dist < scaled) {
                        element.onMouseMoveOver(true);
                    } else {
                        element.outState()
                    }
                }
            });
        }
        //}

    }
}