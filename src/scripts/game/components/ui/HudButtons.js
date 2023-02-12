import BaseButton from "./BaseButton";
import Game from "../../../Game";
import GameObject from "../../core/gameObject/GameObject";
import GameView from "../../core/view/GameView";
import RenderModule from "../../core/modules/RenderModule";
import UIList from "../../ui/uiElements/UIList";
import signals from "signals";

export default class HudButtons extends GameObject {
    constructor() {
        super();

        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.UILayer;
        this.gameView.view = new PIXI.Container();


        //this.gameView.view.y = Game.Screen.height / 2 - 40

        
        this.buttonsList = new UIList();
        this.buttonsList.w = 100
        this.buttonsList.h = 40
        this.gameView.view.addChild(this.buttonsList)
        
        


        this.buttonsList.x = -Game.Screen.width / 2 + 20
        this.buttonsList.y = Game.Screen.height / 2 - 60
    }

    addCallbackButton(callback, texture = 'square_0006'){
        this.openDeckButton = new BaseButton(texture,40,40);
        this.buttonsList.addElement(this.openDeckButton)
        this.openDeckButton.onButtonClicked.add(()=>{
            callback();
        })
        this.buttonsList.w =this.buttonsList.elementsList.length * 60
        this.buttonsList.updateHorizontalList();

    }
}