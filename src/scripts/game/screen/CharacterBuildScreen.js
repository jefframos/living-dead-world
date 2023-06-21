import * as PIXI from 'pixi.js';

import AchievmentsContainer from '../components/ui/achievments/AchievmentsContainer';
import BaseButton from '../components/ui/BaseButton';
import BodyPartsListScroller from '../ui/buildCharacter/BodyPartsListScroller';
import CampfireScene from './scenes/CampfireScene';
import CharacterBuildScreenCustomizationView from '../components/ui/customization/CharacterBuildScreenCustomizationView';
import CharacterCustomizationContainer from '../components/ui/customization/CharacterCustomizationContainer';
import EntityBuilder from './EntityBuilder';
import Game from '../../Game';
import GameData from '../data/GameData';
import GameStaticData from '../data/GameStaticData';
import InteractableView from '../view/card/InteractableView';
import LoadoutContainer from '../components/ui/loadout/LoadoutContainer';
import LocationContainer from '../components/ui/location/LocationContainer';
import OutGameUIProgression from '../components/ui/OutGameUIProgression';
import PlayerGameViewSpriteSheet from '../components/PlayerGameViewSpriteSheet';
import PlayerViewStructure from '../entity/PlayerViewStructure';
import Pool from '../core/utils/Pool';
import PrizeCollectContainer from '../components/ui/prizes/PrizeCollectContainer';
import PrizeManager from '../data/PrizeManager';
import RouletteContainer from '../components/ui/roulette/RouletteContainer';
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




        this.logo = new PIXI.Sprite.from('muta-logo');
        //this.container.addChild(this.logo);
        this.logo.anchor.x = 0.5;



        this.activePlayersCustomization = [];

        for (let index = 0; index < GameData.instance.totalPlayers; index++) {
            this.addCharacter(GameData.instance.getPlayer(index))
        }
        //this.addCharacter()
        //this.addCharacter()

        this.activePlayerId = Math.min(1, this.activePlayersCustomization.length - 1);
        this.charCustomizationContainer.setPlayer(this.activePlayersCustomization[this.activePlayerId].playerViewDataStructure)
        this.updateCharactersPosition();

        this.pivotOffset = { x: 0, y: 0 }

        this.sceneContainer.pivot.x = this.activePlayersCustomization[this.activePlayerId].x
        this.sceneContainer.pivot.y = this.activePlayersCustomization[this.activePlayerId].y
        this.sceneContainer.x = Game.Borders.width / 2
        this.sceneContainer.y = Game.Borders.height / 2

        this.charCustomizationContainer.hide()

        this.zoom = 1;

        this.pivotOffset.y = -50
        this.buildBottomMenu();




        this.modalList = [];
        this.loadoutContainer = new LoadoutContainer();
        this.addModal(this.loadoutContainer)
        this.shopContainer = new ShopContainer();
        this.addModal(this.shopContainer)
        this.achievmentsContainer = new AchievmentsContainer()
        this.addModal(this.achievmentsContainer)
        this.locationContainer = new LocationContainer()
        this.addModal(this.locationContainer)
        this.rouletteContainer = new RouletteContainer()
        this.addModal(this.rouletteContainer)

        this.popUpList = [];
        this.prizeCollect = new PrizeCollectContainer()
        this.addPopUp(this.prizeCollect)

        this.outgameUIProgression = new OutGameUIProgression();
        this.container.addChild(this.outgameUIProgression);

        this.buttonsList = new UIList();
        this.container.addChild(this.buttonsList);
        this.closeButton = UIUtils.getCloseButton(() => { this.backButtonAction(); })
        this.buttonsList.addElement(this.closeButton, { align: 0 })
        //this.buttonsList.addElement(UIUtils.getPrimaryButton(() => { this.randomize() }), { align: 0 })

        this.buttonsList.w = 60
        this.buttonsList.h = 60;

        this.buttonsList.updateHorizontalList();




        // setTimeout(() => {

        //     this.openModal(this.loadoutContainer);
        // }, 10);


        this.loadoutContainer.onUpdateMainWeapon.add(() => {
            this.loadoutButton.addIcon(GameData.instance.currentEquippedWeaponData.entityData.icon, 80)
        })

        GameData.instance.onUpdateEquipment.add(this.updateEquipment.bind(this));
        GameData.instance.onUpdateCompanion.add(this.updateCompanion.bind(this));

        PrizeManager.instance.onGetMetaPrize.add(this.showPrizeWindow.bind(this));

        let currentCompanion = GameData.instance.currentEquippedCompanionData;
        if (currentCompanion) {
            this.updateCompanion(currentCompanion.id)
        }

        let currentTrinket = GameData.instance.currentEquippedTrinket;
        if (currentTrinket.id) {
            this.updateEquipment('trinket', currentTrinket.id)
        }

        let currentMask = GameData.instance.currentEquippedMask;
        if (currentMask.id) {
            this.updateEquipment('mask', currentMask.id)
        }


        let currentShoe = GameData.instance.currentEquippedShoe;
        if (currentShoe.id) {
            this.updateEquipment('shoe', currentShoe.id)
        }

    }
    get playerCustomization() {
        return this.activePlayersCustomization[this.activePlayerId]
    }
    updateCompanion(id) {
        const data = EntityBuilder.instance.getCompanion(id);

        if (!data) {
            this.playerCustomization.removeCompanion()
            return
        }
        this.playerCustomization.setCompanion(data);

    }
    showPrizeWindow(data) {
        this.prizeCollect.showPrize(data)
        this.openPopUp(this.prizeCollect)
    }
    updateEquipment(area, id) {
        const data = EntityBuilder.instance.getEquipable(id);
        if (area == 'trinket') {
            this.playerCustomization.playerViewDataStructure.trinketSprite = data ? data.playerSpriteOverride : null;
        } else if (area == 'mask') {
            this.playerCustomization.playerViewDataStructure.maskSprite = data ? data.playerSpriteOverride : null;
        } else if (area == 'shoe') {
            this.playerCustomization.playerViewDataStructure.shoe = data ? data.playerSpriteReference : 0;
        }
    }
    addPopUp(popUp) {
        this.popUpList.push(popUp);
        this.container.addChild(popUp);
        popUp.onHide.add(this.onPopUpHide.bind(this))
        popUp.onShow.add(this.onPopUpShow.bind(this))
        popUp.hide()
    }
    addModal(modal) {
        this.modalList.push(modal);
        this.container.addChild(modal);
        modal.onHide.add(this.onModalHide.bind(this))
        modal.onShow.add(this.onModalShow.bind(this))
        modal.hide()
    }
    onPopUpShow(popup) {
    }
    onPopUpHide(popup) {
        
        let modalOpen = null;
        this.modalList.forEach(element => {
            if (element.isOpen) {
                modalOpen = element;
            }
        });

        if (!modalOpen) {
            this.closeCustomization();
                this.unSelectPlayer();
        }
    }
    onModalShow(modal) {
    }
    onModalHide(modal) {
    }
    openPopUp(popUp) {
        this.hideMainUI();
        this.customizationZoom()
        popUp.show();
        this.previousPopUp = popUp;
    }
    openModal(modal) {
        this.hideMainUI();
        this.customizationZoom()
        modal.show();
        this.previousModal = modal;
    }
    buildBottomMenu() {
        this.bottomMenu = new PIXI.Container()
        this.container.addChild(this.bottomMenu);
        this.bottomMenuList = new UIList();
        this.loadoutButton = UIUtils.getPrimaryShapelessButton(() => {
            this.openModal(this.loadoutContainer);
        }, 'Loadout', GameData.instance.currentEquippedWeaponData.entityData.icon)

        const bt2 = UIUtils.getPrimaryShapelessButton(() => {
            this.showCustomization();

        }, 'Customize', 'crown')

        const bt0 = UIUtils.getPrimaryShapelessButton(() => {
            PrizeManager.instance.getMetaPrize(Math.floor(Math.random() * 5), 1, 3);
        }, 'TestPopUp', 'crown')

        this.bottomMenuList.addElement(this.loadoutButton, { align: 0 })
        this.bottomMenuList.addElement(bt2, { align: 0 })
        this.bottomMenuList.addElement(bt0, { align: 0 })

        this.menuButtons = [];
        this.menuButtons.push(this.loadoutButton)
        this.menuButtons.push(bt2)
        this.menuButtons.push(bt0)

        this.bottomMenuList.updateVerticalList()

        this.bottomMenu.addChild(this.bottomMenuList)


        this.bottomMenuRight = new PIXI.Container()
        this.container.addChild(this.bottomMenuRight);

        this.bottomMenuRightList = new UIList();
        const bt3 = UIUtils.getPrimaryShapelessButton(() => {
            this.openModal(this.shopContainer)
        }, 'Shop', 'money')

        const bt4 = UIUtils.getPrimaryShapelessButton(() => {
            this.openModal(this.locationContainer);
        }, 'Location', 'map')


        const bt5 = UIUtils.getPrimaryShapelessButton(() => {
            this.openModal(this.rouletteContainer);
        }, 'Prize', 'map')

        // const bt4 = UIUtils.getPrimaryShapelessButton(() => {
        //     this.openModal(this.achievmentsContainer)

        // }, 'Achievments', 'achievment')

        this.bottomMenuRightList.addElement(bt3, { align: 0 })
        this.bottomMenuRightList.addElement(bt4, { align: 0 })
        this.bottomMenuRightList.addElement(bt5, { align: 0 })

        this.menuButtonsRight = [];
        this.menuButtonsRight.push(bt3)
        this.menuButtonsRight.push(bt4)
        this.menuButtonsRight.push(bt5)

        this.bottomMenuRightList.updateVerticalList()

        this.bottomMenuRight.addChild(this.bottomMenuRightList)


        this.playGameButton = UIUtils.getMainPlayButton(() => {
            this.screenManager.redirectToGame();
        }, 'PLAY')
        this.bottomMenuRight.addChild(this.playGameButton)
    }
    addCharacter(data) {

        let customizationView = new CharacterBuildScreenCustomizationView(data, this.activePlayersCustomization.length)
        this.sceneContainer.addChild(customizationView);

        customizationView.onUpdateCurrentPlayer.add((id) => {
            this.updateCurrentPlayer(id)
        })

        this.activePlayersCustomization.push(customizationView);
    }
    defaultZoom() {
        this.zoom = 1

        if (Game.IsPortrait) {

            this.pivotOffset.y = 20
        } else {

            this.pivotOffset.y = 0
        }
    }
    customizationZoom() {
        this.zoom = 1.25

        if (Game.IsPortrait) {
            this.pivotOffset.y = 80
        } else {

            this.pivotOffset.y = 60
        }
    }
    showCustomization() {

        this.customizationZoom();
        this.charCustomizationContainer.show()

        this.activePlayersCustomization.forEach(element => {
            element.buttonsContainer.visible = false;
        });
        this.hideMainUI()

    }
    closeCustomization() {
        this.defaultZoom();
        this.activePlayersCustomization[this.activePlayerId].buttonsContainer.visible = true;
        this.charCustomizationContainer.hide()
        //this.hideMainUI()


    }
    unSelectPlayer() {

        this.defaultZoom();
        this.activePlayersCustomization.forEach(element => {
            element.buttonsContainer.visible = true;
        });
        this.showMainUI();

    }
    hideCurrentCustomizationButton() {
        this.activePlayersCustomization[this.activePlayerId].buttonsContainer.visible = false;
    }
    updateCurrentPlayer(id) {
        if (this.charCustomizationContainer.isOpen) {
            return;
        }
        //this.customizationZoom();
        // this.tryHideModal();
        // this.showCustomization()

        this.activePlayerId = id;
        GameData.instance.changePlayer(id)
        //this.hideMainUI()

        this.hideCurrentCustomizationButton();
        this.charCustomizationContainer.setPlayer(this.playerCustomization.playerViewDataStructure)
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
        //this.outgameUIProgression.visible = false;
        this.hideCurrentCustomizationButton()
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
        let chunk = maxWidth / this.activePlayersCustomization.length
        let angChunk = (Math.PI) / (this.activePlayersCustomization.length - 1)
        angChunk = Math.min(0, angChunk)


        for (var i = 0; i < this.activePlayersCustomization.length; i++) {
            const element = this.activePlayersCustomization[i];
            element.x = Game.Borders.width / 2 + i * chunk + chunk * 0.5 - maxWidth / 2;
            element.y = Game.Borders.height / 2 + Math.sin(angChunk * (i)) * 40;
            element.playerPreviewStructure.baseScale = Math.min(1.5, Game.GlobalScale.max);
        }
        //console.log("calcular a distancia baseado na escala tb")



    }
    resize(res, newRes) {


        this.updateCharactersPosition();

        this.charCustomizationContainer.resize(res, newRes)

        this.modalList.forEach(element => {
            element.resize(res, newRes);
        });
        this.popUpList.forEach(element => {
            element.resize(res, newRes);
        });
        this.campfireScene.x = Game.Borders.width / 2;
        this.campfireScene.y = Game.Borders.height / 2 - 80;
        this.campfireScene.scale.set(Math.min(1.5, Game.GlobalScale.max));

        const listSize = Game.Borders.height / 2
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


        this.outgameUIProgression.x = Game.Borders.width / 2 - this.outgameUIProgression.width / 2;
        this.outgameUIProgression.y = 30;

        this.buttonsList.x = this.outgameUIProgression.x - this.buttonsList.width - 10;
        this.buttonsList.y = this.outgameUIProgression.y;


        this.playGameButton.x = Game.Borders.width / 2 - this.playGameButton.width / 2;
        this.playGameButton.y = Game.Borders.height - this.playGameButton.height - 20

        this.logo.x = Game.Borders.width / 2
        this.logo.y = 40

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
        this.popUpList.forEach(element => {
            element.aspectChange(isPortrait);
        });


    }
    update(delta) {

        for (var i = 0; i < this.activePlayersCustomization.length; i++) {
            const element = this.activePlayersCustomization[i];
            element.update(delta)
        }

        this.modalList.forEach(element => {
            element.update(delta)
        });
        this.popUpList.forEach(element => {
            element.update(delta)
        });
        this.sceneContainer.pivot.x = Utils.lerp(this.sceneContainer.pivot.x, this.playerCustomization.x + this.pivotOffset.x, 0.3);
        this.sceneContainer.pivot.y = Utils.lerp(this.sceneContainer.pivot.y, this.playerCustomization.y + this.pivotOffset.y, 0.3);
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
    tryHideModal() {
        this.modalList.forEach(element => {
            if (element.isOpen) {
                element.hide();
            }
        });

    }
    backButtonAction() {

        let modalOpen = null;
        let popUpOpen = null;
        this.modalList.forEach(element => {
            if (element.isOpen) {
                modalOpen = element;
            }
        });

        this.popUpList.forEach(element => {
            if (element.isOpen) {
                popUpOpen = element;
            }
        });

        if (this.charCustomizationContainer.isOpen) {
            this.closeCustomization();
            this.unSelectPlayer();
        } else if (popUpOpen) {
            popUpOpen.hide();
            if (!modalOpen) {

                this.closeCustomization();
                this.unSelectPlayer();
            }
        } else if (modalOpen) {
            modalOpen.hide();
            this.closeCustomization();
            this.unSelectPlayer();
        } else {
            this.closeCustomization();
            this.unSelectPlayer();
            this.screenManager.redirectToDebugMenu()
        }
    }
}