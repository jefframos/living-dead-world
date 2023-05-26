import * as PIXI from 'pixi.js';

import AchievmentsContainer from '../components/ui/achievments/AchievmentsContainer';
import BaseButton from '../components/ui/BaseButton';
import BodyPartsListScroller from '../ui/buildCharacter/BodyPartsListScroller';
import CampfireScene from './scenes/CampfireScene';
import CharacterCustomizationContainer from '../components/ui/customization/CharacterCustomizationContainer';
import Game from '../../Game';
import GameData from '../data/GameData';
import InteractableView from '../view/card/InteractableView';
import LoadoutContainer from '../components/ui/loadout/LoadoutContainer';
import LocationContainer from '../components/ui/location/LocationContainer';
import OutGameUIProgression from '../components/ui/OutGameUIProgression';
import PlayerGameViewSpriteSheet from '../components/PlayerGameViewSpriteSheet';
import PlayerViewStructure from '../entity/PlayerViewStructure';
import Pool from '../core/utils/Pool';
import Screen from '../../screenManager/Screen';
import ShopContainer from '../components/ui/shop/ShopContainer';
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








        this.activePlayers = [];

        
        for (let index = 0; index < GameData.instance.totalPlayers; index++) {
            this.addCharacter(GameData.instance.getPlayer(index))
        }
        //this.addCharacter()
        //this.addCharacter()



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

        this.outgameUIProgression = new OutGameUIProgression();
        this.container.addChild(this.outgameUIProgression);


        this.modalList = [];
        this.loadoutContainer = new LoadoutContainer();
        this.addModal(this.loadoutContainer)
        this.shopContainer = new ShopContainer();
        this.addModal(this.shopContainer)
        this.achievmentsContainer = new AchievmentsContainer()
        this.addModal(this.achievmentsContainer)
        this.locationContainer = new LocationContainer()
        this.addModal(this.locationContainer)

        this.buttonsList = new UIList();
        this.container.addChild(this.buttonsList);
        this.closeButton = UIUtils.getCloseButton(() => { this.backButtonAction(); })
        this.buttonsList.addElement(this.closeButton, { align: 0 })
        //this.buttonsList.addElement(UIUtils.getPrimaryButton(() => { this.randomize() }), { align: 0 })

        this.buttonsList.w = 250
        this.buttonsList.h = 100;

        this.buttonsList.updateHorizontalList();


        // setTimeout(() => {
            
        //     this.openModal(this.loadoutContainer);
        // }, 10);


        this.loadoutContainer.onUpdateMainWeapon.add(()=>{
            this.loadoutButton.addIcon(GameData.instance.currentEquippedWeaponData.entityData.icon, 80)
        })    

    }
    addModal(modal) {
        this.modalList.push(modal);
        this.container.addChild(modal);

        modal.hide()
    }
    openModal(modal) {
        this.hideMainUI();
        this.customizationZoom()
        modal.show();
    }
    buildBottomMenu() {
        this.bottomMenu = new PIXI.Container()
        this.container.addChild(this.bottomMenu);
        this.bottomMenuList = new UIList();
        this.loadoutButton = UIUtils.getPrimaryShapelessButton(() => {
            this.openModal(this.loadoutContainer);
        }, 'Loadout', GameData.instance.currentEquippedWeaponData.entityData.icon)
        
        const bt2 = UIUtils.getPrimaryShapelessButton(() => {
            this.openModal(this.locationContainer);
        }, 'Location', 'map')

        this.bottomMenuList.addElement(this.loadoutButton, { align: 0 })
        this.bottomMenuList.addElement(bt2, { align: 0 })

        this.menuButtons = [];
        this.menuButtons.push(this.loadoutButton)
        this.menuButtons.push(bt2)

        this.bottomMenuList.updateVerticalList()

        this.bottomMenu.addChild(this.bottomMenuList)


        this.bottomMenuRight = new PIXI.Container()
        this.container.addChild(this.bottomMenuRight);

        this.bottomMenuRightList = new UIList();
        const bt3 = UIUtils.getPrimaryShapelessButton(() => {
            this.openModal(this.shopContainer)
        }, 'Shop', 'money')

        const bt4 = UIUtils.getPrimaryShapelessButton(() => {
            this.openModal(this.achievmentsContainer)

        }, 'Achievments', 'achievment')

        this.bottomMenuRightList.addElement(bt3, { align: 0 })
        this.bottomMenuRightList.addElement(bt4, { align: 0 })

        this.menuButtonsRight = [];
        this.menuButtonsRight.push(bt3)
        this.menuButtonsRight.push(bt4)

        this.bottomMenuRightList.updateVerticalList()

        this.bottomMenuRight.addChild(this.bottomMenuRightList)
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
            GameData.instance.savePlayer(playerPreviewData.id, playerPreviewData.playerViewDataStructure)
        })
        playerPreviewData.playerViewDataStructure.onColorUpdate.add(() => {
            GameData.instance.savePlayer(playerPreviewData.id, playerPreviewData.playerViewDataStructure)
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
            this.tryHideModal();
            this.unSelectPlayer();
        })
        buttonsUIList.addElement(cuttonClose, { fitHeight: 1 })

        const buttonCustomize = UIUtils.getPrimaryButton(() => {
            this.tryHideModal();
            this.showCustomization()

        }, '', 'icon_confirm')
        buttonsUIList.addElement(buttonCustomize, { fitHeight: 1 })
        buttonsUIList.updateHorizontalList()

        playerPreviewData.buttonsContainer.visible = false;

        this.activePlayers.push(playerPreviewData)
    }
    defaultZoom(){
        this.zoom = 1

        if (Game.IsPortrait) {

            this.pivotOffset.y = 20
        } else {

            this.pivotOffset.y = 0
        }
    }
    customizationZoom(){
        this.zoom = 1.25

        if (Game.IsPortrait) {
            this.pivotOffset.y = 80
        } else {
    
            this.pivotOffset.y = 0
        }
    }
    showCustomization() {
        this.customizationZoom();
        this.charCustomizationContainer.show()

        this.activePlayers.forEach(element => {
            element.buttonsContainer.visible = false;
        });
        this.hideMainUI()

    }
    closeCustomization() {
        this.defaultZoom();
        this.activePlayers[this.activePlayerId].buttonsContainer.visible = true;
        this.charCustomizationContainer.hide()
        //this.hideMainUI()
        
        
    }
    unSelectPlayer() {
        
        this.defaultZoom();
        this.activePlayers.forEach(element => {
            element.buttonsContainer.visible = false;
        });
        this.showMainUI();

    }
    updateCurrentPlayer(id) {
        if (this.charCustomizationContainer.isOpen) {
            return;
        }
        this.customizationZoom();

        this.activePlayerId = id;
        GameData.instance.changePlayer(id)
        //this.hideMainUI()

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
    hideMainUI(hideBackButton) {
        this.bottomMenu.visible = false;
        this.bottomMenuRight.visible = false;
        this.outgameUIProgression.visible = false;
        if (hideBackButton) {
            this.closeButton.visible = false;
        }
    }
    showMainUI() {
        this.bottomMenu.visible = true;
        this.bottomMenuRight.visible = true;
        this.outgameUIProgression.visible = true;
        this.closeButton.visible = true;

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

        this.charCustomizationContainer.resize(res, newRes)

        this.modalList.forEach(element => {
            element.resize(res, newRes);
        });

        this.campfireScene.x = Game.Borders.width / 2;
        this.campfireScene.y = Game.Borders.height / 2 - 80;
        this.campfireScene.scale.set(Math.min(1.5, Game.GlobalScale.max));

        const listSize = 300
        this.menuButtons.forEach(element => {
            element.resize(150, listSize / this.menuButtons.length)
        });

        this.menuButtonsRight.forEach(element => {
            element.resize(150, listSize / this.menuButtonsRight.length)
        });

        this.bottomMenuList.w = 150
        this.bottomMenuList.h = this.menuButtons.length * 10 + listSize
        this.bottomMenuList.updateVerticalList();


        this.bottomMenuRightList.w = 150
        this.bottomMenuRightList.h = this.menuButtonsRight.length * 10 + listSize
        this.bottomMenuRightList.updateVerticalList();


        this.outgameUIProgression.x = Game.Borders.width - this.outgameUIProgression.width - 30;
        this.outgameUIProgression.y = 30;

    }

    aspectChange(isPortrait) {

        // if (isPortrait) {
        //     this.buttonsList.scale.set(1)
        // } else {

        //     this.buttonsList.scale.set(0.75)
        // }

        this.charCustomizationContainer.aspectChange(isPortrait)
          this.modalList.forEach(element => {
            element.aspectChange(isPortrait);
        });
        

    }
    update(delta) {

        for (var i = 0; i < this.activePlayers.length; i++) {
            const element = this.activePlayers[i];

            element.playerPreviewStructure.update(delta)
        }

        this.modalList.forEach(element => {
            element.update(delta)
        });
        this.sceneContainer.pivot.x = Utils.lerp(this.sceneContainer.pivot.x, this.activePlayers[this.activePlayerId].playerPreviewSprite.x + this.pivotOffset.x, 0.3);
        this.sceneContainer.pivot.y = Utils.lerp(this.sceneContainer.pivot.y, this.activePlayers[this.activePlayerId].playerPreviewSprite.y + this.pivotOffset.y, 0.3);
        this.sceneContainer.x = Game.Borders.width / 2;
        this.sceneContainer.y = Game.Borders.height / 2;
        this.sceneContainer.scale.x = Utils.lerp(this.sceneContainer.scale.x, this.zoom, 0.3);
        this.sceneContainer.scale.y = Utils.lerp(this.sceneContainer.scale.y, this.zoom, 0.15);

        this.campfireScene.update(delta)

        this.bottomMenuList.x = 30;
        this.bottomMenuList.y = Game.Borders.height - this.bottomMenuList.h - 30;


        this.bottomMenuRightList.x = Game.Borders.width - this.bottomMenuList.w - 30;
        this.bottomMenuRightList.y = Game.Borders.height - this.bottomMenuList.h - 30;

    }
    tryHideModal(){
        this.modalList.forEach(element => {
            if (element.isOpen) {
                element.hide();
            }
        });

    }
    backButtonAction() {

        let modalOpen = null;
        this.modalList.forEach(element => {
            if (element.isOpen) {
                modalOpen = element;
            }
        });
        if (this.charCustomizationContainer.isOpen) {
            this.closeCustomization();
            this.unSelectPlayer();
        } else if (modalOpen) {
            modalOpen.hide();
            this.closeCustomization();
            this.unSelectPlayer();
        } else {
            this.closeCustomization();
            this.unSelectPlayer();
            this.screenManager.backScreen()
        }
    }
}