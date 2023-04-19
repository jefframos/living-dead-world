import * as PIXI from 'pixi.js';

import BaseButton from '../components/ui/BaseButton';
import Game from '../../Game';
import InteractableView from '../view/card/InteractableView';
import PlayerGameViewSpriteSheet from '../components/PlayerGameViewSpriteSheet';
import PlayerViewStructure from '../entity/PlayerViewStructure';
import Screen from '../../screenManager/Screen';
import UIList from '../ui/uiElements/UIList';
import Utils from '../core/utils/Utils';
import signals from "signals";

export default class CharacterBuildScreen extends Screen {
    constructor(label, targetContainer) {
        super(label, targetContainer);


        this.container = new PIXI.Container()
        this.addChild(this.container);

        this.buttonsList = new UIList();
        this.container.addChild(this.buttonsList);


        this.buttonsList.addElement(Utils.getCloseButton(() => { this.screenManager.backScreen() }), { align: 0 })
        this.buttonsList.addElement(Utils.getPrimaryButton(() => { }), { align: 0 })

        this.buttonsList.w = 250
        this.buttonsList.h = 100;

        this.buttonsList.updateHorizontalList();


        this.playerPreview = new PIXI.Sprite();
        this.playerPreviewStructure = new PlayerGameViewSpriteSheet();

        this.playerPreviewStructure.enable();
        this.playerPreviewStructure.baseScale = 1
        this.playerPreviewStructure.sinSpeed = 2

        //super.enable()
        // this.frame = 0;
        // this.maxFrame = 8;
        // this.currentFrame = 0;
        // this.time = 0.08;
        // this.currentTime = 0;
        // this.offsetSin = 0;
        // this.sinSpeed = 1
        // this.direction = 1
        // this.baseScale = 0.375

        this.playerPreviewStructure.view = this.playerPreview
        this.playerPreviewStructure.setData({})

        this.playerViewStructure = new PlayerViewStructure();
        this.playerPreviewStructure.buildSpritesheet(this.playerViewStructure)
        this.container.addChild(this.playerPreview);

        this.playerViewStructure.onStructureUpdate.add(this.structureUpdate.bind(this))

        setTimeout(() => {
            this.playerViewStructure.face = Math.ceil(Math.random() * 10)
            this.playerViewStructure.chest = Math.ceil(Math.random() * 10)
            this.playerViewStructure.frontFace = Math.ceil(Math.random() * 5)
            this.playerViewStructure.hat = Math.ceil(Math.random() * 5)
            this.playerViewStructure.sleevesColor = 0xFFFFFF * Math.random();
            this.playerViewStructure.botomColor = 0xFFFFFF * Math.random();
            this.playerViewStructure.topClothColor = 0xFFFFFF * Math.random();
            this.playerViewStructure.shoeColor = 0xFFFFFF * Math.random();
            this.playerViewStructure.faceHairColor = 0xFFFFFF * Math.random();
        }, 1000);
    }
    build() {

    }
    structureUpdate(region, value) {

    }

    update(delta) {
        this.buttonsList.x = 20;
        this.buttonsList.y = 20;

        this.playerPreview.x = Game.Borders.width / 2;
        this.playerPreview.y = Game.Borders.height / 2;
        
        var min = Game.GlobalScale.max;
        this.playerPreviewStructure.baseScale = Math.min(1.5, min);

        this.playerPreviewStructure.update(delta)
    }
}