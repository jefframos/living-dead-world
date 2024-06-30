import * as PIXI from 'pixi.js';

import Game from '../../Game';
import Screen from '../../screenManager/Screen';
import CookieManager from '../CookieManager';
import LocalizationManager from '../LocalizationManager';
import AudioControllerView from '../components/ui/AudioControllerView';
import OutGameUIProgression from '../components/ui/OutGameUIProgression';
import PopUpGenericModal from '../components/ui/PopUpGenericModal';
import AchievmentsContainer from '../components/ui/achievments/AchievmentsContainer';
import CharacterBuildScreenCustomizationView from '../components/ui/customization/CharacterBuildScreenCustomizationView';
import CharacterCustomizationContainer from '../components/ui/customization/CharacterCustomizationContainer';
import MainScreenChest from '../components/ui/customization/MainScreenChest';
import LoadoutContainer from '../components/ui/loadout/LoadoutContainer';
import LocationContainer from '../components/ui/location/LocationContainer';
import NoMoneycontainer from '../components/ui/prizes/NoMoneycontainer';
import PrizeCollectContainer from '../components/ui/prizes/PrizeCollectContainer';
import RouletteContainer from '../components/ui/roulette/RouletteContainer';
import ShopContainer from '../components/ui/shop/ShopContainer';
import Utils from '../core/utils/Utils';
import GameData from '../data/GameData';
import PrizeManager from '../data/PrizeManager';
import RewardsManager from '../data/RewardsManager';
import TimedAction from '../data/TimedAction';
import ViewDatabase from '../data/ViewDatabase';
import UIList from '../ui/uiElements/UIList';
import UIUtils from '../utils/UIUtils';
import EntityBuilder from './EntityBuilder';
import MainScreenManager from './MainScreenManager';
import CampfireScene from './scenes/CampfireScene';

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

        this.mainChest1 = new MainScreenChest('item-chest-0001', 'ready', () => {
            this.openMainChest1()
        }, false)
        this.mainChest1.scale.set(0.85)
        this.mainChest1.x = 110
        this.mainChest1.y = -100

        this.mainChest2 = new MainScreenChest('item-chest-0002', 'ready', () => {
            this.openMainChest2()
        })
        this.mainChest2.scale.set(0.85)
        this.mainChest2.x = -200
        this.mainChest2.y = -100

        this.main1Timed = new TimedAction("MAIN_1", 300, this.mainChest1.label, LocalizationManager.instance.getLabel("OPEN"))
        this.main2Timed = new TimedAction("MAIN_2", 120, this.mainChest2.label, LocalizationManager.instance.getLabel("OPEN"))

        this.campfireScene.addChild(this.mainChest1);
        this.campfireScene.addChild(this.mainChest2);
        this.chests = [
            { timed: this.main1Timed, chest: this.mainChest1 },
            { timed: this.main2Timed, chest: this.mainChest2 }]


        this.campfireScene.buildScene();

        this.charCustomizationContainer = new CharacterCustomizationContainer();
        this.container.addChild(this.charCustomizationContainer);



        // this.logo = new PIXI.Sprite.from('muta-logo');
        // //this.container.addChild(this.logo);
        // this.logo.anchor.x = 0.5;



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

        this.locationContainer.onRedirectToGame.add((level, difficulty) => {
            this.levelRedirector(level, difficulty);
            this.locationContainer.hide()

        })
        this.popUpList = [];

        this.outgameUIProgression = new OutGameUIProgression();
        this.container.addChild(this.outgameUIProgression);



        this.buttonsList = new UIList();
        this.container.addChild(this.buttonsList);
        this.closeButton = UIUtils.getCloseButton(() => { this.backButtonAction(); })
        this.buttonsList.addElement(this.closeButton, { align: 0, fitWidth: 1 })

        this.soundButton = new AudioControllerView();
        this.container.addChild(this.soundButton)


        if (Game.Debug.debug) {
            this.giveMoneyButton = UIUtils.getPrimaryButton(() => { this.giveMoney(); })
            this.buttonsList.addElement(this.giveMoneyButton, { align: 0, fitWidth: 1 })
        }
        //this.buttonsList.addElement(UIUtils.getPrimaryButton(() => { this.randomize() }), { align: 0 })

        this.buttonsList.w = 75 * this.buttonsList.elementsList.length
        this.buttonsList.h = 75;

        this.buttonsList.updateHorizontalList();


        this.prizeCollect = new PrizeCollectContainer()
        this.addPopUp(this.prizeCollect)

        this.prizeCollect.onClothesRedirect.add(() => {

            this.modalList.forEach(element => {
                if (element.isOpen && element != this.charCustomizationContainer) {
                    element.hide();
                }
            });

            this.openModal(this.charCustomizationContainer)
        })
        this.prizeCollect.onLoadoutRedirect.add(() => {
            this.modalList.forEach(element => {
                if (element.isOpen && element != this.loadoutContainer) {
                    element.hide();
                }
            });

            this.openModal(this.loadoutContainer)
        })


        this.noMoneyContainer = new NoMoneycontainer()
        this.addPopUp(this.noMoneyContainer)

        this.genericPopUp = new PopUpGenericModal();
        this.addPopUp(this.genericPopUp)


        // setTimeout(() => {

        //     this.openModal(this.loadoutContainer);
        // }, 10);


        this.loadoutContainer.onUpdateMainWeapon.add(() => {
            this.loadoutButton.addIcon(GameData.instance.currentEquippedWeaponData.entityData.icon, 80)
        })

        GameData.instance.onUpdateEquipment.add(this.updateEquipment.bind(this));
        GameData.instance.onUpdateCompanion.add(this.updateCompanion.bind(this));
        GameData.instance.notEnoughcurrency.add(this.showNoMoney.bind(this));

        ViewDatabase.instance.onUpdateWearables.add(this.updateWearables.bind(this));

        PrizeManager.instance.onGetMetaPrize.add(this.showPrizeWindow.bind(this));

        //RewardsManager.instance.onAddBlock.add(this.showAdBlockMessage.bind(this));

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


        this.defaultZoom()
        setTimeout(() => {
            this.defaultZoom()
        }, 100);

        this.updateWearables();

        setTimeout(() => {

            this.showMainUI();
        }, 1);

        window.onEscPressed.add(() => {
            if (this.screenManager.currentScreen.label == this.label) {
                this.backButtonAction();
            }
        })

        window.onSpacePressed.add(() => {
            if (this.mainShow && this.screenManager.currentScreen.label == 'CharacterBuild') {
                this.screenManager.redirectToGame({ level: 1 });
            }
        })
    }
    openMainChest1() {
        // RewardsManager.instance.doReward(() => {
        // })
        GameData.instance.openChest("MAIN_1");
        PrizeManager.instance.getMetaPrize([0, 1, 2, 3], 1, 1);
        this.showMainUI()
    }
    openMainChest2() {
        RewardsManager.instance.doReward(() => {
            GameData.instance.openChest("MAIN_2");
            PrizeManager.instance.getMetaPrize([0, 1, 2, 3], 3, 2);
            this.showMainUI()
        })
    }
    get playerCustomization() {
        return this.activePlayersCustomization[this.activePlayerId]
    }
    startMainScreen() {
        return
        console.log('startMainScreenstartMainScreenstartMainScreen')
        this.activePlayersCustomization.forEach(element => {
            this.sceneContainer.removeChild(element);
            element.onUpdateCurrentPlayer.removeAll()
        });
        this.activePlayersCustomization = [];


        for (let index = 0; index < GameData.instance.totalPlayers; index++) {
            this.addCharacter(GameData.instance.getPlayer(index))
        }
        this.activePlayerId = Math.min(1, this.activePlayersCustomization.length - 1);
        this.charCustomizationContainer.setPlayer(this.activePlayersCustomization[this.activePlayerId].playerViewDataStructure)


    }
    addCharacter(data) {

        console.log('addCharacteraddCharacteraddCharacter', data)
        let customizationView = new CharacterBuildScreenCustomizationView(data, this.activePlayersCustomization.length)
        this.sceneContainer.addChild(customizationView);

        customizationView.onUpdateCurrentPlayer.add((id) => {
            this.updateCurrentPlayer(id)
        })

        this.activePlayersCustomization.push(customizationView);
    }
    refreshCharacter() {
        this.activePlayersCustomization[this.activePlayerId].refreshVisuals(GameData.instance.getPlayer(this.activePlayerId))
    }
    showAdBlockMessage() {
        this.genericPopUp.showInfo("You need to disable the adblock to access this")
        this.openModal(this.genericPopUp, true)
    }
    giveMoney() {
        GameData.instance.addSoftCurrency(500)
        GameData.instance.addHardCurrency(2)
        GameData.instance.addSpecialCurrency(1)
    }
    updateWearables() {

        this.customizeButton.warningIcon.visible = ViewDatabase.instance.getNewWearablesList().length > 0
        // this.customizeButton.warningIcon.y = this.customizeButton.text.y
        //this.customizeButton
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

        this.updateLoadoutNewItems()
    }

    showNoMoney(data) {
        this.noMoneyContainer.showInfo(data)
        this.openPopUp(this.noMoneyContainer)
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
        //this.container.addChild(popUp);
        Game.UIOverlayContainer.addChild(popUp);
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
        if (popup.hideCloseButton) {
            this.closeButton.visible = false;
        }
        this.hideMainUI()
    }
    onPopUpHide(popup) {

        let modalOpen = null;
        this.modalList.forEach(element => {
            if (element.isOpen) {
                modalOpen = element;
            }
        });

        if (!modalOpen) {
            this.loadoutButton.addIcon(GameData.instance.currentEquippedWeaponData.entityData.icon, 80)
            //this.closeCustomization();
            //this.unSelectPlayer();
        }
        if (popup.hideCloseButton) {
            this.closeButton.visible = true;
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
    openModal(modal, ignoreStates) {
        if (!ignoreStates) {
            this.hideMainUI();
            this.customizationZoom()
        }
        modal.show();
        SOUND_MANAGER.play('shoosh', 0.5)
        this.previousModal = modal;
    }
    buildBottomMenu() {
        this.bottomMenu = new PIXI.Container()
        this.container.addChild(this.bottomMenu);
        this.bottomMenuList = new UIList();

        this.bottomMenuRight = new PIXI.Container()
        this.container.addChild(this.bottomMenuRight);
        this.bottomMenuRightList = new UIList();

        this.loadoutButton = UIUtils.getPrimaryShapelessButton(() => {
            this.openModal(this.loadoutContainer);
        }, LocalizationManager.instance.getLabel('MAIN_LOADOUT'), GameData.instance.currentEquippedWeaponData.entityData.icon)

        this.customizeButton = UIUtils.getPrimaryShapelessButton(() => {
            this.showCustomization(true);

        }, LocalizationManager.instance.getLabel('MAIN_OUTFIT'), 'transparent')

        //this.customizeButton.icon.texture = PIXI.Texture.EMPTY;

        this.customPlayerSprite = new PIXI.Sprite();
        this.customizeButton.icon.addChild(this.customPlayerSprite)
        this.customPlayerSprite.anchor.set(0.4, 0.7)

        setTimeout(() => {
            this.activePlayersCustomization[this.activePlayerId].playerPreviewStructure.generateNewTexture();

            this.customPlayerSprite.texture = this.activePlayersCustomization[this.activePlayerId].playerPreviewStructure.staticTexture

        }, 50);

        this.customPlayerSpriteMask = new PIXI.Sprite.from('tile');
        this.customPlayerSpriteMask.anchor.set(0.5, 1)
        this.customPlayerSpriteMask.width = 150
        this.customPlayerSpriteMask.height = 280
        this.customizeButton.icon.addChild(this.customPlayerSpriteMask)
        this.customizeButton.icon.mask = this.customPlayerSpriteMask;
        this.customPlayerSprite.y = 50
        this.customPlayerSpriteMask.y = 50

        const bt0 = UIUtils.getPrimaryShapelessButton(() => {

            PrizeManager.instance.getMetaPrize([0, 1, 2, 3, 4], 3, 15);
        }, 'Get Random Items', UIUtils.getIconUIIcon('test'))

        const getCustomizables = UIUtils.getPrimaryShapelessButton(() => {


            //PrizeManager.instance.getWearable()
            PrizeManager.instance.getMetaPrize([6], 3, 2);
        }, 'Get Wareables', UIUtils.getIconUIIcon('test'))



        this.bottomMenu.addChild(this.bottomMenuList)



        this.shopButton = UIUtils.getPrimaryShapelessButton(() => {
            this.openModal(this.shopContainer)
        }, LocalizationManager.instance.getLabel('MAIN_SHOP'), UIUtils.getIconUIIcon('shop'))

        const bt4 = UIUtils.getPrimaryShapelessButton(() => {
            this.openModal(this.locationContainer);
        }, LocalizationManager.instance.getLabel('MAIN_LOCATION'), UIUtils.getIconUIIcon('map'))


        this.prizeButton = UIUtils.getPrimaryShapelessButton(() => {
            this.openModal(this.rouletteContainer);
        }, LocalizationManager.instance.getLabel('MAIN_REWARDS'), UIUtils.getIconUIIcon('prize'))

        this.achievmentsButton = UIUtils.getPrimaryShapelessButton(() => {
            this.openModal(this.achievmentsContainer)

        }, 'Achievments', 'achievment')

        this.bottomMenuRightList.removeAllElements();
        if (!window.STAND_ALONE) this.bottomMenuRightList.addElement(this.shopButton, { align: 0 })
        if (!window.STAND_ALONE) this.bottomMenuRightList.addElement(this.prizeButton, { align: 0 })
        this.bottomMenuRightList.addElement(this.achievmentsButton, { align: 0 })

        this.menuButtonsRight = [];
        this.menuButtonsRight.push(this.shopButton)
        this.menuButtonsRight.push(this.prizeButton)
        this.menuButtonsRight.push(this.achievmentsButton)

        this.bottomMenuRightList.updateVerticalList()


        this.bottomMenuList.removeAllElements();
        this.bottomMenuList.addElement(this.loadoutButton, { align: 0, vAlign: 0 })
        this.bottomMenuList.addElement(this.customizeButton, { align: 0, vAlign: 0 })

        this.menuButtons = [];
        this.menuButtons.push(this.loadoutButton)
        this.menuButtons.push(this.customizeButton)

        this.bottomMenuList.updateVerticalList()

        this.bottomMenuRight.addChild(this.bottomMenuRightList)


        this.playGameButton = UIUtils.getMainPlayButton(() => {


            this.openModal(this.locationContainer);
            //this.levelRedirector();
        }, LocalizationManager.instance.getLabel('MAIN_PLAY'), UIUtils.getIconUIIcon('battle'))
        this.bottomMenuRight.addChild(this.playGameButton)
        this.playGameButton.buttonSound = 'Pop-Musical'
    }
    levelRedirector(level, diff) {
        //return
        RewardsManager.instance.doComercial(() => {
            this.screenManager.redirectToGame({ level: level.id, difficulty: diff });
        }, {}, false)

    }

    defaultZoom() {

        this.pivotOffset.x = 0
        if (Game.IsPortrait) {

            this.zoom = 0.75
            this.pivotOffset.y = 20
        } else {

            this.zoom = 0.75
            this.pivotOffset.y = 0
        }

    }
    customizationZoom(toWardrobe) {

        this.pivotOffset.x = 0
        if (Game.IsPortrait) {
            this.zoom = 0.8
            this.pivotOffset.y = 80
        } else {
            if (toWardrobe) {
                this.zoom = 1.5
                this.pivotOffset.y = -50
                this.pivotOffset.x = 50
                this.outgameUIProgression.visible = false;

            } else {

                this.zoom = 0.9
                this.pivotOffset.y = 20
            }
        }
    }
    showCustomization(toWardrobe) {

        this.customizationZoom(toWardrobe);
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
        this.mainShow = false;
        this.bottomMenu.visible = false;
        this.bottomMenuRight.visible = false;
        this.buttonsList.visible = true;
        //this.outgameUIProgression.visible = false;
        this.hideCurrentCustomizationButton()
        if (hideBackButton) {
            this.closeButton.visible = false;
        }
    }
    showMainUI() {
        this.mainShow = true;
        this.bottomMenu.visible = true;
        this.bottomMenuRight.visible = true;
        this.outgameUIProgression.visible = true;


        if (!Game.Debug.debug) {
            this.buttonsList.visible = false;
        }

        this.activePlayersCustomization[this.activePlayerId].playerPreviewStructure.generateNewTexture();
        this.customPlayerSprite.texture = this.activePlayersCustomization[this.activePlayerId].playerPreviewStructure.staticTexture
        this.customPlayerSprite.anchor.set(0, 0.7)
        this.customPlayerSprite.x = -this.customPlayerSprite.width / 2

        //console.log(this.activePlayersCustomization)

        //this.addChild(new PIXI.Sprite(this.activePlayersCustomization[this.activePlayerId].playerPreviewStructure.staticTexture))
        this.customPlayerSprite.y = 30
        this.customPlayerSpriteMask.y = 50
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

        const listSize = Game.IsPortrait ? Game.Borders.width * 0.9 : Game.Borders.height - 120
        this.menuButtons.forEach(element => {
            element.resize(150, listSize / this.menuButtons.length)
        });

        this.menuButtonsRight.forEach(element => {
            element.resize(150, listSize / this.menuButtonsRight.length)
        });



        this.bottomMenuList.w = 150
        this.bottomMenuList.h = listSize
        this.bottomMenuList.updateVerticalList();

        if (Game.IsPortrait) {

            this.bottomMenuRightList.h = 150
            this.bottomMenuRightList.w = listSize
            this.bottomMenuRightList.updateHorizontalList();
        } else {

            this.bottomMenuRightList.w = 150
            this.bottomMenuRightList.h = listSize
            this.bottomMenuRightList.updateVerticalList();
        }


        this.outgameUIProgression.x = Game.Borders.width / 2 - this.outgameUIProgression.width / 2;
        this.outgameUIProgression.y = 30;


        this.customizeButton.warningIcon.y = this.customizeButton.text.y //- 40
        this.loadoutButton.warningIcon.y = this.loadoutButton.text.y //- 40

        if (Game.IsPortrait) {

            this.buttonsList.x = this.outgameUIProgression.x + this.outgameUIProgression.width + 20//this.outgameUIProgression.x - this.buttonsList.width - 10;
            this.soundButton.x = Game.Borders.width - this.soundButton.width - 20
        } else {

            this.buttonsList.x = Game.Borders.width - this.buttonsList.w - 20//this.outgameUIProgression.x - this.buttonsList.width - 10;
            this.soundButton.x = Game.Borders.width - this.soundButton.width - 80
        }
        this.buttonsList.y = 20;

        this.soundButton.y = 40

        this.playGameButton.x = Game.Borders.width / 2 - this.playGameButton.width / 2;
        this.playGameButton.y = Game.Borders.height - this.playGameButton.height - 60 + Math.sin(Game.Time) * 5

        // this.logo.x = Game.Borders.width / 2
        // this.logo.y = 40

    }

    aspectChange(isPortrait) {

        // if (isPortrait) {
        //     this.buttonsList.scale.set(1)
        // } else {

        //     this.buttonsList.scale.set(0.75)
        // }

        this.bottomMenuRightList.removeAllElements();
        this.bottomMenuList.removeAllElements();
        this.menuButtonsRight = [];
        this.menuButtons = [];
        if (false) {
            this.bottomMenuRightList.addElement(this.shopButton, { align: 0 })
            this.bottomMenuRightList.addElement(this.prizeButton, { align: 0 })
            this.menuButtonsRight.push(this.shopButton)
            this.menuButtonsRight.push(this.prizeButton)


            this.bottomMenuList.addElement(this.customizeButton, { align: 0, vAlign: 0 })
            this.bottomMenuList.addElement(this.loadoutButton, { align: 0, vAlign: 0 })
            this.menuButtons.push(this.loadoutButton)
            this.menuButtons.push(this.customizeButton)

        } else {
            //this.bottomMenuRightList.addElement(this.achievmentsButton, { align: 0, vAlign: 0 })
            this.bottomMenuRightList.addElement(this.loadoutButton, { align: 0, vAlign: 0 })
            this.bottomMenuRightList.addElement(this.customizeButton, { align: 0, vAlign: 0 })
            if (!window.STAND_ALONE) this.bottomMenuRightList.addElement(this.prizeButton, { align: 0, vAlign: 0 })
            this.bottomMenuRightList.addElement(this.shopButton, { align: 0, vAlign: 0 })

            //this.menuButtonsRight.push(this.achievmentsButton)
            this.menuButtonsRight.push(this.shopButton)
            if (!window.STAND_ALONE) this.menuButtonsRight.push(this.prizeButton)
            this.menuButtonsRight.push(this.loadoutButton)
            this.menuButtonsRight.push(this.customizeButton)
        }
        this.bottomMenuRightList.updateVerticalList()
        this.bottomMenuList.updateVerticalList()
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


        this.date = new Date();
        this.chests.forEach(element => {
            element.timed.updateTime(this.date.getTime())
            element.chest.setReady(element.timed.canUse)
            element.chest.update(delta)
            element.chest.updateNormal(1 - element.timed.normal)
            element.chest.visible = this.bottomMenuRight.visible


        });

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

        this.soundButton.visible = !this.buttonsList.visible;

        if (Game.IsPortrait) {
            this.bottomMenuRightList.y = Game.Borders.height - this.playGameButton.height - 150 - this.bottomMenuRightList.height;
            this.bottomMenuRightList.x = Game.Borders.width / 2 - this.bottomMenuRightList.w / 2;

        } else {

            this.bottomMenuRightList.y = 80//Game.Borders.height - this.bottomMenuList.h - 30;
            this.bottomMenuRightList.x = Game.Borders.width - this.bottomMenuList.w - 50;
        }
        this.bottomMenuList.x = 30;
        this.bottomMenuList.y = Game.Borders.height - this.bottomMenuList.h - 30;



        this.playGameButton.y = Game.Borders.height - this.playGameButton.height - 60 + Math.sin(Game.Time) * 5

        if (this.charCustomizationContainer.isOpen) {
            this.charCustomizationContainer.update(delta)
        }

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
            if (Game.Debug.debug) {
                this.screenManager.redirectToDebugMenu()
            }
        }

        this.updateLoadoutNewItems()
    }
    updateLoadoutNewItems() {

        this.loadoutButton.warningIcon.visible = GameData.instance.anyNewEquip()
    }
    transitionOut(nextScreen, params) {
        super.transitionOut(nextScreen, params ? params : { level: 1 }, MainScreenManager.Transition.timeOut);
    }
    transitionIn(params) {

        //LocalizationManager.instance.getLabel();

        //console.log(params)
        this.startMainScreen();


        this.updateLoadoutNewItems();
        SOUND_MANAGER.playLoop('FloatingCities', 0.5)
        if (this.screenManager.prevScreen == "GameScreen") {
            //console.log(params.levelEndStats.levelStruct.waves.difficulty)
            this.refreshCharacter()
            setTimeout(() => {
                if (CookieManager.instance.isFtue) {
                    PrizeManager.instance.getFtuePrize()
                    CookieManager.instance.ftueDone();
                    CookieManager.instance.setPrize('comeback1')
                } else {

                    //console.log(params)
                    if (params && !params.fromQuit) {

                        if (params.levelEndStats && params.fromWin) {

                            CookieManager.instance.saveLevelComplete(params.levelEndStats.levelStruct.views.id, params.levelEndStats.levelStruct.finalScore, params.levelEndStats.levelStruct.difficulty)
                        }
                        PrizeManager.instance.getEndOfLevelPrizes(params.levelEndStats.levelStruct.waves.difficulty, params.fromWin, params.levelEndStats.levelStruct.difficulty)

                    }

                }
                this.unSelectPlayer();
            }, 100);
            this.shopContainer.resetAllButtons();
        }
        setTimeout(() => {
            super.transitionIn();
            if (!CookieManager.instance.isFtue && !CookieManager.instance.getPrize('comeback1')) {
                PrizeManager.instance.getComebackPrize()
                CookieManager.instance.setPrize('comeback1')
                this.showMainUI()
            }
            if (Game.Debug.test) {
                setTimeout(() => {
                    this.unSelectPlayer();
                    PrizeManager.instance.getMetaPrize([0, 1, 2, 3, 6], 1, 8)
                }, 10);
            }


        }, MainScreenManager.Transition.timeIn);
    }
}