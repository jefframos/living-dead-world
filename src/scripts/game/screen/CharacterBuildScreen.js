import * as PIXI from 'pixi.js';

import BaseButton from '../components/ui/BaseButton';
import BodyPartsListScroller from '../ui/buildCharacter/BodyPartsListScroller';
import CampfireScene from './scenes/CampfireScene';
import CharacterCustomizationContainer from '../components/ui/customization/CharacterCustomizationContainer';
import Game from '../../Game';
import InteractableView from '../view/card/InteractableView';
import PlayerGameViewSpriteSheet from '../components/PlayerGameViewSpriteSheet';
import PlayerViewStructure from '../entity/PlayerViewStructure';
import Pool from '../core/utils/Pool';
import Screen from '../../screenManager/Screen';
import UIList from '../ui/uiElements/UIList';
import UIUtils from '../core/utils/UIUtils';
import Utils from '../core/utils/Utils';
import signals from "signals";

export default class CharacterBuildScreen extends Screen {
    static makeAssetSetup(data) {
        let obj = {
            src: '',
            anchor: { x: 0.5, y: 0.5 },
            scale: { x: 1, y: 1 },
            position: { x: 0, y: 0 },
            animation: {
                enabled: false,
                start: 0,
                end: 0
            }
        }

        for (const key in obj) {
            if (data[key] !== undefined) {
                obj[key] = data[key]
            }
        }
        return obj
    }
    constructor(label, targetContainer) {
        super(label, targetContainer);


        this.container = new PIXI.Container()
        this.addChild(this.container);

        this.sceneContainer = new PIXI.Container()
        this.container.addChild(this.sceneContainer);

        this.campfireScene = new CampfireScene();
        this.sceneContainer.addChild(this.campfireScene);

        this.campfireScene.buildScene();

        this.charCustomizationContainer = new CharacterCustomizationContainer();
        this.container.addChild(this.charCustomizationContainer);


        this.buttonsList = new UIList();
        this.container.addChild(this.buttonsList);


        this.buttonsList.addElement(UIUtils.getCloseButton(() => { this.screenManager.backScreen() }), { align: 0 })
        this.buttonsList.addElement(UIUtils.getPrimaryButton(() => { this.randomize() }), { align: 0 })

        this.buttonsList.w = 250
        this.buttonsList.h = 100;

        this.buttonsList.updateHorizontalList();

        this.activePlayers = [];


        this.addCharacter()
        this.addCharacter()
        this.addCharacter()
        
        
        
        this.activePlayerId = 1;
        this.charCustomizationContainer.setPlayer(this.activePlayers[this.activePlayerId].playerViewDataStructure)
        this.updateCharactersPosition();
        this.sceneContainer.pivot.x =  Game.Borders.width / 2
        this.sceneContainer.pivot.y =  Game.Borders.height / 2
    }
    addCharacter() {

        let playerPreviewData = {}
        playerPreviewData.playerPreviewSprite = new PIXI.Sprite();


        playerPreviewData.playerPreviewStructure = new PlayerGameViewSpriteSheet();
        playerPreviewData.playerPreviewStructure.enable();
        playerPreviewData.playerPreviewStructure.baseScale = 1
        playerPreviewData.playerPreviewStructure.sinSpeed = 2
        playerPreviewData.playerPreviewStructure.view = playerPreviewData.playerPreviewSprite
        playerPreviewData.playerPreviewStructure.setData({})

        playerPreviewData.playerViewDataStructure = new PlayerViewStructure();
        playerPreviewData.playerPreviewStructure.buildSpritesheet(playerPreviewData.playerViewDataStructure)

        this.sceneContainer.addChild(playerPreviewData.playerPreviewSprite);

        InteractableView.addMouseDown(playerPreviewData.playerPreviewSprite, () => {
            this.updateCurrentPlayer(playerPreviewData.id);
        })
        playerPreviewData.id = this.activePlayers.length;
        this.activePlayers.push(playerPreviewData)
    }
    updateCurrentPlayer(id) {
        this.activePlayerId = id;

        this.charCustomizationContainer.setPlayer(this.activePlayers[this.activePlayerId].playerViewDataStructure)
    }
    randomize() {

        this.activePlayers.forEach(element => {
            
            element.head = Math.ceil(Math.random() * 10)
            element.chest = Math.ceil(Math.random() * 10)
            element.frontFace = Math.ceil(Math.random() * 5)
            element.hat = Math.ceil(Math.random() * 5)
        });

    }
    build() {

    }

    structureUpdate(region, value) {

    }
    updateCharactersPosition() {

        let maxWidth = Math.min(Game.Borders.width, 650)
        let chunk = maxWidth / this.activePlayers.length
        let angChunk = (Math.PI) / (this.activePlayers.length - 1)
        //console.log("calcular a distancia baseado na escala tb")
        for (var i = 0; i < this.activePlayers.length; i++) {
            const element = this.activePlayers[i];
            element.playerPreviewSprite.x = Game.Borders.width / 2 + i * chunk + chunk * 0.5 - maxWidth / 2;
            element.playerPreviewSprite.y = Game.Borders.height / 2 + Math.sin(angChunk * (i)) * 40;
            element.playerPreviewStructure.baseScale = Math.min(1.5, Game.GlobalScale.max);
        }
    }
    resize(res, newRes) {
        this.buttonsList.x = 20;
        this.buttonsList.y = 20;

        this.updateCharactersPosition();

        this.charCustomizationContainer.resize(isPortrait)



        this.campfireScene.x = Game.Borders.width / 2;
        this.campfireScene.y = Game.Borders.height / 2 - 80;
        this.campfireScene.scale.set(Math.min(1.5, Game.GlobalScale.max));


    }

    aspectChange(isPortrait) {

        if (isPortrait) {
            this.buttonsList.scale.set(1)
        } else {

            this.buttonsList.scale.set(0.75)
        }

        this.charCustomizationContainer.aspectChange(isPortrait)
    }
    update(delta) {

        for (var i = 0; i < this.activePlayers.length; i++) {
            const element = this.activePlayers[i];

            element.playerPreviewStructure.update(delta)
        }

        this.sceneContainer.pivot.x = Utils.lerp(this.sceneContainer.pivot.x, this.activePlayers[this.activePlayerId].playerPreviewSprite.x - Game.Borders.width / 2, 0.3);
        this.sceneContainer.pivot.y = Utils.lerp(this.sceneContainer.pivot.y, this.activePlayers[this.activePlayerId].playerPreviewSprite.y - Game.Borders.height / 2, 0.3);

        this.campfireScene.update(delta)
    }
}