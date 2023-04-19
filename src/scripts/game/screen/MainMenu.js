import * as PIXI from 'pixi.js';

import BaseButton from '../components/ui/BaseButton';
import Game from '../../Game';
import InteractableView from '../view/card/InteractableView';
import MainScreenContainer from './mainScreen/MainScreenContainer';
import MainScreenManager from './MainScreenManager';
import Screen from '../../screenManager/Screen'
import signals from "signals";

export default class MainMenu extends Screen {
    constructor(label, targetContainer) {
        super(label, targetContainer);

        this.container = new PIXI.Container()
        this.addChild(this.container);
        
        this.mainScreenContainer = new MainScreenContainer();
        this.container.addChild(this.mainScreenContainer);
        
        
        this.onStartGame = new signals.Signal();
        
        this.startGame = new BaseButton('square_0007', 200, 50);
        const confirmText = new PIXI.Text('Start', window.LABELS.LABEL1)
        confirmText.style.strokeThickness = 0
        confirmText.style.fontSize = 32
        this.startGame.addLabelOnCenter(confirmText)
        InteractableView.addMouseUp(this.startGame, () => { 
            this.onStartGame.dispatch();             
        })
        this.container.addChild(this.startGame);

        this.charcatrBuilder = new BaseButton('square_0007', 200, 50);
        const charBuilder = new PIXI.Text('Build', window.LABELS.LABEL1)
        charBuilder.style.strokeThickness = 0
        charBuilder.style.fontSize = 32
        this.charcatrBuilder.addLabelOnCenter(charBuilder)
        InteractableView.addMouseUp(this.charcatrBuilder, () => { 
            this.screenManager.change(MainScreenManager.Screens.CharacterBuild)
        })
        
        this.container.addChild(this.charcatrBuilder);
    }
    build(){
        super.build();
    }
    update(delta){

        this.charcatrBuilder.x =  Game.Borders.width / 2- this.charcatrBuilder.width / 2
        this.charcatrBuilder.y =  Game.Borders.height / 2 - 50

        this.startGame.x =  Game.Borders.width / 2 - this.startGame.width / 2
        this.startGame.y =  Game.Borders.height / 2 + 50
    }
}