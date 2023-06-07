import * as PIXI from 'pixi.js';

import GameStaticData from '../../../data/GameStaticData';
import RouletteSlotView from './RouletteSlotView';
import UIUtils from '../../../core/utils/UIUtils';
import Utils from '../../../core/utils/Utils';

export default class RouletteView extends PIXI.Container {
    constructor() {
        super();

        this.container = new PIXI.Container();
        this.addChild(this.container);


        this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('card-shape-1'), 20, 20, 20, 20);
        this.container.addChild(this.infoBackContainer);
        this.infoBackContainer.tint = 0x2A292F;
        this.infoBackContainer.width = 800
        this.infoBackContainer.height = 600

        this.slotsContainer = new PIXI.Container();
        this.container.addChild(this.slotsContainer);
        
        
        this.spinButton = UIUtils.getPrimaryLabelButton(()=>{
            this.spin();
        }, 'spin', 'video-icon')
        this.container.addChild(this.spinButton);
        this.slots = [];



        for (var i = 0; i < 3; i++){
            let square = new RouletteSlotView()
            this.slotsContainer.addChild(square);
            square.x = i * 200
            this.slots.push(square);
        }
        
        this.slotsContainer.x = this.infoBackContainer.width / 2 - this.slotsContainer.width / 2;
        this.slotsContainer.y = this.infoBackContainer.height / 2 - this.slotsContainer.height / 2;

        this.spinButton.x = this.infoBackContainer.width / 2 - this.spinButton.width / 2;
        this.spinButton.y = this.infoBackContainer.height / 2 - this.spinButton.height / 2 + 250;

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
        console.log(this.currentData)

        this.prizeMarker = new PIXI.NineSlicePlane(PIXI.Texture.from('card-border'), 20, 20, 20, 20);
        this.container.addChild(this.prizeMarker);
        this.prizeMarker.width = 700
        this.prizeMarker.x = this.infoBackContainer.width / 2 - this.prizeMarker.width / 2;
        this.prizeMarker.y = this.infoBackContainer.height / 2 - this.prizeMarker.height / 2;

    }
    spin(){
        this.slots.forEach(element => {
            element.spin();
        });
    }
    update(delta){
        this.slots.forEach(element => {
            element.update(delta);
        });
    }
}