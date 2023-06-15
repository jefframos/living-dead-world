import * as PIXI from 'pixi.js';

import GameStaticData from '../../../data/GameStaticData';
import PrizeManager from '../../../data/PrizeManager';
import RouletteSlotView from './RouletteSlotView';
import UIUtils from '../../../core/utils/UIUtils';
import Utils from '../../../core/utils/Utils';
import signals from 'signals';

export default class RouletteView extends PIXI.Container {
    constructor(width = 800, height = 600) {
        super();

        this.container = new PIXI.Container();
        this.addChild(this.container);

        this.onPrizeFound = new signals.Signal();

        this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('slot-machine-modal'), 120, 80, 120, 80);
        this.container.addChild(this.infoBackContainer);
        this.infoBackContainer.width = width
        this.infoBackContainer.height = height

        this.slotsContainer = new PIXI.Container();
        this.container.addChild(this.slotsContainer);


        this.spinButton = UIUtils.getPrimaryLargeLabelButton(() => {
            this.spin(0.1);
        }, 'spin', 'video-icon')
        this.spinButton.updateBackTexture('modal_container0004')
        this.container.addChild(this.spinButton);
        this.slots = [];

        this.rouletteState = []

        //PrizeManager

        this.prizeList = PrizeManager.instance.metaPrizeList;
     
        for (var i = 0; i < 3; i++) {
            let square = new RouletteSlotView(i)
            this.slotsContainer.addChild(square);
            square.x = i * 200
            square.addSlotImagesList(this.prizeList)
            square.onFinishSpin.add((slotId, prizeId) => {
                this.slotFinishSpin(slotId, prizeId)
            })
            this.slots.push(square);

            this.rouletteState.push({
                spinning: false,
                prizeId: -1
            })
        }

        this.slotsContainer.x = this.infoBackContainer.width / 2 - this.slotsContainer.width / 2;
        this.slotsContainer.y = this.infoBackContainer.height / 2 - this.slotsContainer.height / 2;

        this.spinButton.x = this.infoBackContainer.width / 2 - this.spinButton.width / 2;
        this.spinButton.y = this.infoBackContainer.height / 2 - this.spinButton.height / 2 + 300;

        this.currentData = Utils.cloneArray(GameStaticData.instance.getAllCards());

        Utils.shuffle(this.currentData)

        let starters = [];


        for (let index = this.currentData.length - 1; index >= 0; index--) {
            if (this.currentData[index].starter) {
                starters.push(this.currentData[index]);
            }
            if (this.currentData[index] && !this.currentData[index].enabled) {
                this.currentData.splice(index, 1);
            }
        }

        // this.prizeMarker = new PIXI.NineSlicePlane(PIXI.Texture.from('card-border'), 20, 20, 20, 20);
        // this.container.addChild(this.prizeMarker);
        // this.prizeMarker.width = 700
        // this.prizeMarker.x = this.infoBackContainer.width / 2 - this.prizeMarker.width / 2;
        // this.prizeMarker.y = this.infoBackContainer.height / 2 - this.prizeMarker.height / 2;



    }
    calculatePrize() {
        let foundlings = [];
        for (let i = 0; i < 10; i++) {
            foundlings.push({ value: 0, id: i })
        }
        let match = 0
        for (var i = 0; i < this.rouletteState.length; i++) {
            foundlings[this.rouletteState[i].prizeId].value++;
            if (foundlings[this.rouletteState[i].prizeId].value > 1) {

                match++
            }
        }
        //console.log(foundlings, match)
        if (match <= 0) {

            this.onPrizeFound.dispatch(0)
            
        } else {
            
            let max = -999;
            let maxId = -1;
            foundlings.forEach(element => {
                if (max < element.value) {
                    max = element.value
                    maxId = element.id;
                }
            });
            this.onPrizeFound.dispatch(1, maxId, max)

        }
    }
    slotFinishSpin(slotId, prizeId) {
        this.rouletteState[slotId].spinning = false;
        this.rouletteState[slotId].prizeId = prizeId;
        this.findEnd();
    }
    findEnd() {
        for (var i = 0; i < this.rouletteState.length; i++) {
            if (this.rouletteState[i].spinning) {
                return;
            }
        }
        this.calculatePrize();

    }
    spin(speed = 1, force = -1, avoid = []) {
        this.rouletteState.forEach(element => {
            element.spinning = true;
        });
        this.slots.forEach(element => {
            element.spin(speed, force, avoid);
        });
    }
    update(delta) {
        this.slots.forEach(element => {
            element.update(delta);
        });
    }
}