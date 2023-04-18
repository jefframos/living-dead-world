import * as PIXI from 'pixi.js';

import BaseButton from '../components/ui/BaseButton';
import Game from '../../Game';
import InteractableView from '../view/card/InteractableView';
import MainScreenContainer from './mainScreen/MainScreenContainer';
import Screen from '../../screenManager/Screen'
import signals from "signals";

export default class MainMenu extends Screen {
    constructor(label) {
        super(label);

        this.container = new PIXI.Container()
        this.addChild(this.container);
        
        this.mainScreenContainer = new MainScreenContainer();
        this.container.addChild(this.mainScreenContainer);
        
        
        this.onStartGame = new signals.Signal();
        
        this.startGame = new BaseButton('square_0007', 200, 50);

        const confirmText = new PIXI.Text('Start', window.LABELS.LABEL1)
        confirmText.style.strokeThickness = 0
        confirmText.style.fontSize = 32
        //confirmText.skew.set(0.1, 0)
        this.startGame.addLabelOnCenter(confirmText)
        InteractableView.addMouseUp(this.startGame, () => { 
            this.onStartGame.dispatch();             
        })
        this.container.addChild(this.startGame);

        
    }
    build(){
        super.build();
    }
    update(delta){
        //this.mainScreenContainer.update(delta)

        this.startGame.x = Game.Borders.bottomRight.x / 2 - this.startGame.width / 2
        this.startGame.y = Game.Borders.bottomRight.y / 2
    }
}