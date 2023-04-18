import * as PIXI from 'pixi.js';

import BaseButton from '../components/ui/BaseButton';
import Game from '../../Game';
import InteractableView from '../view/card/InteractableView';
import Screen from '../../screenManager/Screen';
import UIList from '../ui/uiElements/UIList';
import signals from "signals";

export default class CharacterBuildScreen extends Screen {
    constructor(label) {
        super(label);

        this.container = new PIXI.Container()
        this.addChild(this.container);
        
        this.buttonSize = 50
        this.buttonsList = new UIList();
        this.container.addChild(this.buttonsList);
        
        this.openDeckButton = new BaseButton('gameSlot1', 200, 50);
        InteractableView.addMouseEnter(this.openDeckButton, () => { console.log("lll"); })
        this.buttonsList.addElement(this.openDeckButton)
        
        this.buttonsList.w = 50
        this.buttonsList.h = 50;
        this.buttonsList.updateHorizontalList();
        
        
        // this.zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0,0,50)
        // this.container.addChild(this.zero);

        this.buttonsList.x = 200
        this.buttonsList.y = 500
        
        this.onPlayerReady = new signals.Signal();


    }
    build() {

    }
    update(delta){
        
        this.buttonsList.x = Game.Borders.bottomRight.x / 2
        this.buttonsList.y = Game.Borders.bottomRight.y / 2
    }
}