import * as PIXI from 'pixi.js';

import BaseButton from '../components/ui/BaseButton';
import BodyPartsListScroller from '../ui/buildCharacter/BodyPartsListScroller';
import CampfireScene from './scenes/CampfireScene';
import CharacterCustomizationContainer from '../components/ui/customization/CharacterCustomizationContainer';
import CookieManager from '../CookieManager';
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


        this.buttonsList.addElement(UIUtils.getCloseButton(() => { this.backButtonAction(); }), { align: 0 })
        //this.buttonsList.addElement(UIUtils.getPrimaryButton(() => { this.randomize() }), { align: 0 })

        this.buttonsList.w = 250
        this.buttonsList.h = 100;

        this.buttonsList.updateHorizontalList();

        this.activePlayers = [];

        const firstPlayer = CookieManager.instance.getPlayer(0)

        for (let index = 0; index < CookieManager.instance.totalPlayers; index++) {
            this.addCharacter(CookieManager.instance.getPlayer(index))
        }
        // this.addCharacter()
        //  this.addCharacter()



        this.activePlayerId = Math.min(1, this.activePlayers.length - 1);
        this.charCustomizationContainer.setPlayer(this.activePlayers[this.activePlayerId].playerViewDataStructure)
        this.updateCharactersPosition();

        this.pivotOffset = { x: 0, y: 0 }

        this.sceneContainer.pivot.x = this.activePlayers[this.activePlayerId].playerPreviewSprite.x
        this.sceneContainer.pivot.y = this.activePlayers[this.activePlayerId].playerPreviewSprite.y
        this.sceneContainer.x = Game.Borders.width / 2
        this.sceneContainer.y = Game.Borders.height / 2

        this.charCustomizationContainer.hide()

        this.zoom = 1;

        this.pivotOffset.y = -50
        this.buildBottomMenu();
    }
    buildBottomMenu() {
        this.bottomMenu = new PIXI.Container()
        this.container.addChild(this.bottomMenu);

        this.menuButtons = [];

        this.bottomMenuList = new UIList();

        const bt1 = UIUtils.getPrimaryButton(() => {
            this.showCustomization()

        }, '', 'sizzling-sausage')

        const bt2 = UIUtils.getPrimaryButton(() => {
            this.showCustomization()

        }, '', 'icon_confirm')

        this.bottomMenuList.addElement(bt1, { align: 0 })
        this.bottomMenuList.addElement(bt2, { align: 0 })

        this.menuButtons.push(bt1)
        this.menuButtons.push(bt2)

        this.bottomMenuList.updateVerticalList()

        this.bottomMenu.addChild(this.bottomMenuList)
    }
    addCharacter(data) {

        let playerPreviewData = {}
        playerPreviewData.playerPreviewSprite = new PIXI.Sprite();



        playerPreviewData.playerPreviewStructure = new PlayerGameViewSpriteSheet();
        playerPreviewData.playerPreviewStructure.enable();
        playerPreviewData.playerPreviewStructure.baseScale = 1
        playerPreviewData.playerPreviewStructure.sinSpeed = 2
        playerPreviewData.playerPreviewStructure.view = playerPreviewData.playerPreviewSprite
        playerPreviewData.playerPreviewStructure.setData({})

        playerPreviewData.playerViewDataStructure = new PlayerViewStructure();
        if (data) {
            playerPreviewData.playerViewDataStructure.parse(data)
        }
        playerPreviewData.playerPreviewStructure.buildSpritesheet(playerPreviewData.playerViewDataStructure)

        playerPreviewData.playerViewDataStructure.onStructureUpdate.add(() => {
            CookieManager.instance.savePlayer(playerPreviewData.id, playerPreviewData.playerViewDataStructure)
        })
        playerPreviewData.playerViewDataStructure.onColorUpdate.add(() => {
            CookieManager.instance.savePlayer(playerPreviewData.id, playerPreviewData.playerViewDataStructure)
        })

        this.sceneContainer.addChild(playerPreviewData.playerPreviewSprite);

        InteractableView.addMouseDown(playerPreviewData.playerPreviewSprite, () => {
            this.updateCurrentPlayer(playerPreviewData.id);
        })
        playerPreviewData.id = this.activePlayers.length;

        playerPreviewData.buttonsContainer = new PIXI.Container();
        playerPreviewData.playerPreviewStructure.view.addChild(playerPreviewData.buttonsContainer);

        const buttonsUIList = new UIList();
        buttonsUIList.w = 200
        buttonsUIList.h = 50
        buttonsUIList.x = -buttonsUIList.w / 2
        buttonsUIList.y = buttonsUIList.h / 2
        playerPreviewData.buttonsContainer.addChild(buttonsUIList)

        const cuttonClose = UIUtils.getCloseButton(() => {
            this.unSelectPlayer();
        })
        buttonsUIList.addElement(cuttonClose, { fitHeight: 1 })

        const buttonCustomize = UIUtils.getPrimaryButton(() => {
            this.showCustomization()

        }, '', 'icon_confirm')
        buttonsUIList.addElement(buttonCustomize, { fitHeight: 1 })
        buttonsUIList.updateHorizontalList()

        playerPreviewData.buttonsContainer.visible = false;

        this.activePlayers.push(playerPreviewData)
    }
    showCustomization() {
        this.pivotOffset.y = 0
        this.charCustomizationContainer.show()
        this.activePlayers[this.activePlayerId].buttonsContainer.visible = false;
        this.bottomMenu.visible = false;

    }
    closeCustomization() {
        this.pivotOffset.y = -50
        this.activePlayers[this.activePlayerId].buttonsContainer.visible = true;
        this.charCustomizationContainer.hide()
        this.bottomMenu.visible = false;

    }
    unSelectPlayer() {
        this.pivotOffset.y = 0;
        this.zoom = 1
        this.activePlayers[this.activePlayerId].buttonsContainer.visible = false;
        this.bottomMenu.visible = true;

    }
    updateCurrentPlayer(id) {
        this.activePlayerId = id;
        this.zoom = 1.5
        CookieManager.instance.changePlayer(id)
        this.bottomMenu.visible = false;
        this.activePlayers[this.activePlayerId].buttonsContainer.visible = true;
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
        angChunk = Math.min(0, angChunk)
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

        const listSize = 300
        this.menuButtons.forEach(element => {
            element.resize(150, listSize / this.menuButtons.length)
        });

        this.bottomMenuList.w = 150
        this.bottomMenuList.h = this.menuButtons.length * 10 + listSize
        this.bottomMenuList.updateVerticalList();

        this.bottomMenu.y = Game.Borders.height - this.bottomMenuList.h;

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

        this.sceneContainer.pivot.x = Utils.lerp(this.sceneContainer.pivot.x, this.activePlayers[this.activePlayerId].playerPreviewSprite.x + this.pivotOffset.x, 0.3);
        this.sceneContainer.pivot.y = Utils.lerp(this.sceneContainer.pivot.y, this.activePlayers[this.activePlayerId].playerPreviewSprite.y + this.pivotOffset.y, 0.3);
        this.sceneContainer.x = Game.Borders.width / 2;
        this.sceneContainer.y = Game.Borders.height / 2;
        this.sceneContainer.scale.x = Utils.lerp(this.sceneContainer.scale.x, this.zoom, 0.3);
        this.sceneContainer.scale.y = Utils.lerp(this.sceneContainer.scale.y, this.zoom, 0.15);

        this.campfireScene.update(delta)

        this.bottomMenu.x = 30;
        this.bottomMenu.y = Game.Borders.height - this.bottomMenuList.h - 30;

    }
    backButtonAction() {
        if (this.charCustomizationContainer.isOpen) {
            this.closeCustomization();
        } else {
            this.closeCustomization();
            this.unSelectPlayer();
            this.screenManager.backScreen()
        }
    }
}