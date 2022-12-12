import * as PIXI from 'pixi.js';

import AchievmentsWindow from '../shop/AchievmentsWindow';
import FairyBackground from '../backgrounds/fairy/FairyBackground';
import HumanBackground from '../backgrounds/human/HumanBackground';
import GameEconomy from '../GameEconomy';
import GameModifyers from '../GameModifyers';
import LevelMeter from '../ui/shop/LevelMeter';
import MergeItemsShop from '../shop/MergeItemsShop';
import MergeSystem from '../systems/MergeSystem';
import MergerData from '../data/MergerData';
import MonsterBackground from '../backgrounds/monster/MonsterBackground';
import NotificationPanel from '../../popup/NotificationPanel';
import ParticleSystem from '../../effects/ParticleSystem';
import Screen from '../../../screenManager/Screen';
import StandardPop from '../../popup/StandardPop';
import TextBox from '../../ui/TextBox';
import TweenMax from 'gsap';
import UIButton1 from '../../ui/UIButton1';
import UIList from '../../ui/uiElements/UIList';
import config from '../../../config';
import utils from '../../../utils';

export default class MergeScreen extends Screen {
    constructor(label) {
        super(label);

        window.baseConfigGame = PIXI.loader.resources['baseGameConfigMonster'].data.baseGame;
        window.baseConfigGameFairy = PIXI.loader.resources['baseGameConfigFairy'].data.baseGame;
        window.baseConfigGameHumans = PIXI.loader.resources['baseGameConfigHumans'].data.baseGame;
        window.baseMonsters = PIXI.loader.resources['monsters'].data;
        window.baseFairies = PIXI.loader.resources['fairies'].data;
        window.baseHumans = PIXI.loader.resources['humans'].data;
        window.baseAchievments = PIXI.loader.resources['achievments'].data;
        window.gameEconomy = new GameEconomy()
        window.gameModifyers = new GameModifyers()

        this.systemsList = [];

        this.areaConfig = window.baseConfigGame.area;
        if (!this.areaConfig.bottomArea) {
            this.areaConfig.bottomArea = 0.2
        }
        if (!this.areaConfig.topArea) {
            this.areaConfig.topArea = 0.2
        }
        if (!this.areaConfig.gameArea) {
            this.areaConfig.gameArea = { w: 0.5, h: 0.5 }
        }
        if (!this.areaConfig.resourcesArea) {
            this.areaConfig.resourcesArea = { w: 0.5, h: 0.5 }
        }

        // setTimeout(() => {
        //     this.activeMergeSystem.interactiveBackground = new FairyBackground();
        //     this.addChildAt(this.activeMergeSystem.interactiveBackground, 0);
        // }, 10);
        this.container = new PIXI.Container()
        this.addChild(this.container);


        this.notificationContainer = new PIXI.Container()
        this.addChild(this.notificationContainer);

        this.notificationPanel = new NotificationPanel();
        this.notificationContainer.addChild(this.notificationPanel)


        this.frontLayer = new PIXI.Container()
        this.addChild(this.frontLayer);
        this.particleSystem = new ParticleSystem();
        this.frontLayer.addChild(this.particleSystem)


        this.uiLayer = new PIXI.Container()
        this.addChild(this.uiLayer);




        this.popUpLayer = new PIXI.Container()
        this.addChild(this.popUpLayer);



        this.gridWrapper = new PIXI.Graphics().lineStyle(10, 0x132215).drawRect(0, 0, config.width * this.areaConfig.gameArea.w, config.height * this.areaConfig.gameArea.h);
        this.container.addChild(this.gridWrapper);
        this.gridWrapper.visible = false;
        //this.gridWrapper.alpha = 0.5;

        this.mergeSystemContainer = new PIXI.Container()
        this.container.addChild(this.mergeSystemContainer);

        this.prizeContainer = new PIXI.Container()
        this.container.addChild(this.prizeContainer);

        this.uiContainer = new PIXI.Container()
        this.container.addChild(this.uiContainer);

        this.topContainer = new PIXI.Container()
        this.container.addChild(this.topContainer);


        this.dataTiles = []
        this.dataResourcesTiles = []
        this.allMergeData = [];
        this.uiPanels = []
        this.mergeSystemsList = []


        let containers = {
            mainContainer: this.mergeSystemContainer,
            uiContainer: this.uiContainer,
            wrapper: this.gridWrapper,
            topContainer: this.topContainer
        }



        this.systemButtonList = new UIList()
        this.systemButtonList.w = 100
        this.systemButtonList.h = 80
        this.container.addChild(this.systemButtonList)


        this.soundButton = new UIButton1(0x002299, 'soundon', 0xFFFFFF, 60, 60, config.assets.box.squareWarning)
        this.soundButton.updateIconScale(0.6)
        this.soundButton.onClick.add(() => {
            
            if (COOKIE_MANAGER.getSettings().isMute) {
                SOUND_MANAGER.unmute()
            } else {
                SOUND_MANAGER.mute()
            }
            COOKIE_MANAGER.setSettings('isMute', SOUND_MANAGER.isMute);

            this.soundButton.icon.texture =  PIXI.Texture.from(SOUND_MANAGER.isMute ? 'soundoff' : 'soundon')
        })
        this.soundButton.icon.texture = PIXI.Texture.from(COOKIE_MANAGER.getSettings().isMute ? 'soundoff' : 'soundon')
        this.container.addChild(this.soundButton)


        this.bonusesList = new UIList()
        this.bonusesList.w = 80
        this.bonusesList.h = this.bonusesList.w * 2 + 20
        this.container.addChild(this.bonusesList)


        this.registerSystem(containers, window.baseConfigGame, window.baseMonsters, 'monsters', true, new MonsterBackground())
        this.registerSystem(containers, window.baseConfigGameFairy, window.baseFairies, 'fairies', false, new FairyBackground())
        this.registerSystem(containers, window.baseConfigGameHumans, window.baseHumans, 'humans', false, new HumanBackground())

        this.activeMergeSystemID = 0
        this.activeMergeSystem = this.mergeSystemsList[this.activeMergeSystemID]

        this.extraMoneyBonus = new UIButton1(0x002299, this.activeMergeSystem.baseData.visuals.coin, 0xFFFFFF, this.bonusesList.w, this.bonusesList.w, config.assets.button.extraSquare)
        this.extraMoneyBonus.updateIconScale(0.6)
        this.extraMoneyBonus.addBadge('plusBadge')
        this.extraMoneyBonus.onClick.add(() => {
            this.openHourCoinPopUp();
            //this.showSystem(this.extraMoneyBonus.systemArrayID)
        })

        this.bonusesList.addElement(this.extraMoneyBonus);

        this.openAchievments = new UIButton1(0x002299, 'achievment', 0xFFFFFF, this.bonusesList.w, this.bonusesList.w, config.assets.button.extraSquare)
        this.openAchievments.updateIconScale(0.75)
        this.openAchievments.newItem = new PIXI.Sprite.from('new_item')
        this.openAchievments.newItem.scale.set(0.6)
        this.openAchievments.newItem.anchor.set(0)
        this.openAchievments.newItem.position.set(-buttonSize / 2)
        this.openAchievments.newItem.visible = false;
        this.openAchievments.addChild(this.openAchievments.newItem)
        this.bonusesList.addElement(this.openAchievments)
        this.openAchievments.onClick.add(() => {
            this.openPopUp(this.activeMergeSystem.achievments)
        })

        this.bonusesList.updateVerticalList();

        this.entityDragSprite = new PIXI.Sprite.from('');
        this.addChild(this.entityDragSprite);
        this.entityDragSprite.visible = false;

        this.mousePosition = {
            x: 0,
            y: 0
        };

        this.interactive = true;
        this.on('mousemove', this.onMouseMove.bind(this)).on('touchmove', this.onMouseMove.bind(this));

        this.statsList = new UIList()
        this.statsList.w = 80
        this.statsList.h = 80
        this.container.addChild(this.statsList)

        this.totalCoinsContainer = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.from(config.assets.box.squareSmall), 20, 20, 20, 20)
        config.addPaddingBoxSmall(this.totalCoinsContainer)
        this.totalCoinsContainer.width = this.statsList.w
        this.totalCoinsContainer.height = 35

        this.totalCoins = new PIXI.Text('', LABELS.LABEL2);
        this.totalCoins.style.fontSize = 14
        this.totalCoins.style.stroke = 0
        this.totalCoins.style.strokeThickness = 3
        this.totalCoinsContainer.addChild(this.totalCoins)
        this.statsList.addElement(this.totalCoinsContainer)

        this.resourcesTexture = new PIXI.Sprite.from('coin')
        this.resourcesTexture.scale.set(this.totalCoinsContainer.height / this.resourcesTexture.height * 0.5)
        this.resourcesTexture.x = -20
        this.resourcesTexture.y = -3
        this.totalCoins.addChild(this.resourcesTexture)


        this.coinsPerSecondCounter = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.from(config.assets.box.squareSmall), 20, 20, 20, 20)
        config.addPaddingBoxSmall(this.coinsPerSecondCounter)
        this.coinsPerSecondCounter.width = this.statsList.w
        this.coinsPerSecondCounter.height = 35

        this.coisPerSecond = new PIXI.Text('0', LABELS.LABEL2);
        this.coisPerSecond.style.fontSize = 14
        this.coisPerSecond.style.stroke = 0
        this.coisPerSecond.style.strokeThickness = 3
        this.coinsPerSecondCounter.addChild(this.coisPerSecond)
        this.statsList.addElement(this.coinsPerSecondCounter)

        this.shardsTexture = new PIXI.Sprite.from('coin')
        this.coisPerSecond.addChild(this.shardsTexture)
        this.shardsTexture.scale.set(this.coinsPerSecondCounter.height / this.shardsTexture.height * 0.5)
        this.shardsTexture.x = -20
        this.shardsTexture.y = -3


        this.statsList.updateVerticalList();



        this.levelMeter = new LevelMeter();
        this.container.addChild(this.levelMeter)

        this.addHelpers();

        let buttonSize = 80
        this.shopButtonsList = new UIList();
        this.shopButtonsList.w = buttonSize;
        this.shopButtonsList.h = buttonSize * 2.5;
        this.container.addChild(this.shopButtonsList)

        this.currentOpenPopUp = null;


        this.shopsLabel = new PIXI.Text(window.localizationManager.getLabel('shops'), LABELS.LABEL1);
        this.container.addChild(this.shopsLabel)
        this.shopsLabel.style.fontSize = 24
        this.shopsLabel.style.stroke = 0
        this.shopsLabel.style.strokeThickness = 6
        this.shopsLabel.anchor.set(0.5)

        this.openMergeShop = new UIButton1(0x002299, 'vampire', 0xFFFFFF, buttonSize, buttonSize, config.assets.button.secondarySquare)
        this.openMergeShop.updateIconScale(0.75)
        this.openMergeShop.newItem = new PIXI.Sprite.from('new_item')
        this.openMergeShop.newItem.scale.set(0.7)
        this.openMergeShop.newItem.anchor.set(0)
        this.openMergeShop.newItem.position.set(-buttonSize / 2)
        this.openMergeShop.newItem.visible = false;
        this.openMergeShop.addChild(this.openMergeShop.newItem)
        this.shopButtonsList.addElement(this.openMergeShop)
        this.openMergeShop.onClick.add(() => {
            this.openPopUp(this.activeMergeSystem.shop)
        })




        this.shopButtonsList.updateVerticalList();

        window.TIME_SCALE = 1

        this.standardPopUp = new StandardPop('any', this.screenManager)
        this.popUpLayer.addChild(this.standardPopUp)

        this.standardPopUp.onHide.add(() => {
            if (this.pendingNotification) {
                this.pendingNotification()
                this.pendingNotification = null;
            }
        })

        // this.bonusPopUp = new BonusConfirmation('bonus', this.screenManager)
        // this.popUpLayer.addChild(this.bonusPopUp)


        this.uiPanels.push(this.standardPopUp)


        this.sumStart = 0;
        //this.savedResources = COOKIE_MANAGER.getResources('monster');



        this.shopButtonsList.updateVerticalList();

        let now = Date.now() / 1000 | 0
        let diff = 0;//now - this.savedEconomy.lastChanged

        if (this.tutorialStep > 1 && diff > 60 && this.sumStart > 10) {
            let params = {
                label: window.localizationManager.getLabel('offline-money'),
                value1: utils.formatPointsLabel(this.sumStart),
                value2: utils.formatPointsLabel(this.sumStart * 2),
                onConfirm: this.collectStartAmountDouble.bind(this),
                onCancel: this.collectStartAmount.bind(this)
            }
            this.standardPopUpShow(params)
        }

        this.forcePauseSystemsTimer = 0.05;


        this.resetWhiteShape = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(-config.width * 4, -config.height * 4, config.width * 8, config.height * 8);
        this.addChild(this.resetWhiteShape);
        this.resetWhiteShape.visible = false;
        //this.mergeItemsShop.show()

        //this.tutorialStep = window.COOKIE_MANAGER.getStats().tutorialStep;


        // this.gameTutorial = new GameTutorial(this)
        // if (this.tutorialStep == 0) {
        //     if (window.gameEconomy.currentResources > 10) {
        //         COOKIE_MANAGER.endTutorial(2);
        //     } else {

        //         this.startTutorial();
        //         this.addChild(this.gameTutorial);
        //     }
        // }

        // this.mergeSystemsList.push(this.mergeSystemFairies)

        this.refreshSystemVisuals();

        this.popUpLayer.visible = true;

        COOKIE_MANAGER.initBoard(this.activeMergeSystem.systemID)


        this.particleSystemFront = new ParticleSystem();
        this.addChild(this.particleSystemFront)

    }

    registerSystem(containers, baseData, baseMergeData, slug, visible = true, interactiveBackground = null) {

        this.addChildAt(interactiveBackground, 0);
        interactiveBackground.visible = visible;
        COOKIE_MANAGER.sortCookie(slug)
        let rawMergeDataList = []
        for (let index = 0; index < baseMergeData.mergeEntities.list.length; index++) {
            let mergeData = new MergerData(baseMergeData.mergeEntities.list[index], index)
            mergeData.type = baseMergeData.mergeEntities.list[index].type
            rawMergeDataList.push(mergeData)
            this.allMergeData.push(mergeData)
        }

        let mergeSystem = new MergeSystem(containers, baseData,
            rawMergeDataList,
            slug);
        this.addSystem(mergeSystem)
        mergeSystem.enemySystem = this.enemiesSystem;
        mergeSystem.soundtrack = baseData.soundtrack;
        mergeSystem.onParticles.add(this.addParticles.bind(this));
        mergeSystem.onDealDamage.add(this.addDamageParticles.bind(this));
        mergeSystem.onPopLabel.add(this.popLabel.bind(this));
        mergeSystem.onGetResources.add(this.addResourceParticles.bind(this));
        mergeSystem.onNextLevel.add(this.onNextLevel.bind(this));
        mergeSystem.onBoardLevelUpdate.add(this.onMergeSystemUpdate.bind(this));
        mergeSystem.specialTileReveal.add(this.onSpecialTileReveal.bind(this));

        let mergeItemsShop = new MergeItemsShop([mergeSystem])
        this.uiLayer.addChild(mergeItemsShop);
        mergeItemsShop.addItems(rawMergeDataList)
        mergeItemsShop.hide();
        mergeItemsShop.onAddEntity.add((entity) => {
            SOUND_MANAGER.play('getstar', 0.5)
            mergeSystem.buyEntity(entity)
        })
        mergeItemsShop.onClaimGift.add((entity) => {
            mergeSystem.addSpecialPiece();

            SOUND_MANAGER.play('magic', 0.5)

            COOKIE_MANAGER.claimGift(slug)
        })
        mergeItemsShop.systemID = slug;
        mergeSystem.updateAvailableSlots.add((availables) => {
            mergeItemsShop.updateLocks(availables)
            //POPUP
        });


        let achievmentsWindow = new AchievmentsWindow(mergeSystem, slug, this.mergeSystemsList.length)
        achievmentsWindow.systemID = slug;
        achievmentsWindow.addItems(window.baseAchievments.achievments)
        achievmentsWindow.onAchievmentPending.add((slug, notification = false) => {
            if (slug != this.activeMergeSystem.systemID) return;

            if (notification) {
                SOUND_MANAGER.play('coins_04', 0.5)

                this.notificationPanel.buildNewPieceNotification('achievmentl', 'You unlock a new achievement ', null, config.assets.popup.primary)

            }
            if (this.openAchievments.badge) {
                this.openAchievments.badge.visible = true;
            } else {
                this.openAchievments.addBadge('warning')
            }
        })
        achievmentsWindow.onNoAchievmentPending.add((slug) => {
            if (slug != this.activeMergeSystem.systemID) return;
            if (this.openAchievments.badge) {
                this.openAchievments.badge.visible = false;
            }
        })
        achievmentsWindow.onClaimAchievment.add((value) => {
            window.gameEconomy.addResources(value, this.activeMergeSystem.systemID)
            this.moneyFromCenter(value)
        })

        achievmentsWindow.onClaimGift.add((entity) => {
            COOKIE_MANAGER.claimFreeMoney(slug)
            let target = this.activeMergeSystem.rps * 350
            target = Math.max(500, target)
            window.gameEconomy.addResources(target, this.activeMergeSystem.systemID)
            this.moneyFromCenter(target)
        })

        this.uiLayer.addChild(achievmentsWindow);
        achievmentsWindow.hide();
        achievmentsWindow.setGiftTexture('moneyl')
        setTimeout(() => {
            mergeItemsShop.updateLocks(mergeSystem.totalAvailable())

            achievmentsWindow.checkAll();

        }, 120);
        mergeSystem.updateMaxLevel.add((max, skipPopup) => {


            COOKIE_MANAGER.addAchievment(this.activeMergeSystem.systemID, 'discovery', max + 1, true)

            this.activeMergeSystem.interactiveBackground.updateMax(max, true)
            if (max == 0 || skipPopup) {
                this.activeMergeSystem.interactiveBackground.showAnimation(max)
                return;
            }
            if (this.activeMergeSystem.dataTiles.length > max) {
                this.newPiecePopup(max)
            }
            //POPUP
        });
        mergeItemsShop.setGiftIcon(baseData.visuals.gift[0])
        mergeSystem.shop = mergeItemsShop
        mergeSystem.achievments = achievmentsWindow
        mergeSystem.interactiveBackground = interactiveBackground
        this.uiPanels.push(mergeItemsShop)
        this.uiPanels.push(achievmentsWindow)

        mergeSystem.systemArrayID = this.mergeSystemsList.length;
        mergeSystem.visible = visible;

        let buttonSize = 80

        let toggleSystems = new UIButton1(0x002299, rawMergeDataList[0].rawData.imageSrc, 0xFFFFFF, buttonSize, buttonSize, config.assets.button.primarySquare)
        toggleSystems.updateIconScale(0.9)
        toggleSystems.systemArrayID = this.mergeSystemsList.length;
        toggleSystems.onClick.add(() => {

            if (this.activeMergeSystemID == toggleSystems.systemArrayID) return;

            this.screenManager.screenTransition.startTransitionIn(0, ()=>{
                this.showSystem(toggleSystems.systemArrayID)
            }, mergeSystem.interactiveBackground.skyColor)
        })

        let unlockTextbox = new TextBox(20)
        unlockTextbox.updateText("New Level")
        toggleSystems.addChild(unlockTextbox)
        unlockTextbox.x = - unlockTextbox.width / 2 - 50
        unlockTextbox.alpha = 0;

        toggleSystems.unlockTextbox = unlockTextbox;
        mergeSystem.toggle = toggleSystems;

        this.mergeSystemsList.push(mergeSystem)
        this.systemButtonList.addElement(toggleSystems);

    }
    showSystem(id) {
        if (this.activeMergeSystemID == id) return;

        this.mergeSystemsList.forEach(element => {
            element.visible = false;
            element.interactiveBackground.visible = false;
        });


        
        this.activeMergeSystemID = id;
        this.activeMergeSystemID %= this.mergeSystemsList.length
        
        this.mergeSystemsList[this.activeMergeSystemID].visible = true;
        this.mergeSystemsList[this.activeMergeSystemID].interactiveBackground.visible = true;
        this.activeMergeSystem = this.mergeSystemsList[this.activeMergeSystemID]
        this.activeMergeSystem.toggle.unlockTextbox.alpha = 0;
        
        this.activeMergeSystem.achievments.checkAll();
        
        var lastTime = COOKIE_MANAGER.getLastResourceTime(this.activeMergeSystem.systemID);

        let calcTime = Date.now()/1000 - lastTime.lastChanged
        
        setTimeout(() => {
            
           

            if(this.activeMergeSystem.rps > 0 && calcTime > 60){
                calcTime = Math.min(calcTime, 600)
                this.startGamePopUp(this.activeMergeSystem.rps * Math.ceil(calcTime))
            }
        }, 1);
        this.refreshSystemVisuals();
    }
    startGamePopUp(targetMoney) {


        SOUND_MANAGER.play('magic', 0.4)

        let target = targetMoney
        let target2 = targetMoney * 2
        this.openPopUp(this.standardPopUp, {
            value1: utils.formatPointsLabel(target),
            value2: utils.formatPointsLabel(target2),
            title: window.localizationManager.getLabel('welcomeBack'),
            confirmLabel: window.localizationManager.getLabel('collect'),
            cancelLabel: window.localizationManager.getLabel('ok'),
            video: true,
            popUpType: config.assets.popup.secondary,
            mainLabel2:  window.localizationManager.getLabel('youEarned')+utils.formatPointsLabel(target)+ '\n'+ window.localizationManager.getLabel('watchDouble'),
            onConfirm: () => {
                window.DO_REWARD(() => {
                    window.gameEconomy.addResources(target2, this.activeMergeSystem.systemID)
                    this.moneyFromCenter(target2)


                })

            },
            onCancel: () => {
                window.gameEconomy.addResources(target, this.activeMergeSystem.systemID)
                this.moneyFromCenter(target)
                SOUND_MANAGER.play('place2', 0.4)

            }
        })

    }

    levelUpPopUp(data) {

        let target = this.activeMergeSystem.rps * 60
        let target2 = this.activeMergeSystem.rps * 600
        this.openPopUp(this.standardPopUp, {
            value1: '-',
            value2: utils.formatPointsLabel(target2),
            title:window.localizationManager.getLabel('level')+' ' + data.currentLevel,
            confirmLabel: window.localizationManager.getLabel('openShop'),
            cancelLabel: window.localizationManager.getLabel('ok'),
            mainLabel2: this.activeMergeSystem.dataTiles[data.currentLevel - 1].rawData.displayName + '\n'+window.localizationManager.getLabel('shopUnlocked'),
            video: false,
            popUpType: config.assets.popup.extra,
            hideAll: true,
            mainIcon: this.activeMergeSystem.dataTiles[data.currentLevel - 1].rawData.imageSrc,
            onConfirm: () => {

                this.openPopUp(this.activeMergeSystem.shop);
                SOUND_MANAGER.play('getThemAll', 0.4)

            },
            onCancel: () => {
                SOUND_MANAGER.play('place2', 0.4)

            }
        })

    }

    openHourCoinPopUp() {

        let target = this.activeMergeSystem.rps * 300
        target = Math.max(500, target)
        this.openPopUp(this.standardPopUp, {
            value1: 0,
            value2: utils.formatPointsLabel(target),
            title: window.localizationManager.getLabel('freeCoins'),
            confirmLabel: window.localizationManager.getLabel('collect'),
            cancelLabel: window.localizationManager.getLabel('cancel'),
            mainLabel2: window.localizationManager.getLabel('watchToEarn') +' 10\n'+ window.localizationManager.getLabel('minutesWorth'),
            video: true,
            popUpType: config.assets.popup.secondary,
            onConfirm: () => {
                window.DO_REWARD(() => {
                    window.gameEconomy.addResources(target, this.activeMergeSystem.systemID)
                    this.moneyFromCenter(target)

                })

            },
            onCancel: () => {
                SOUND_MANAGER.play('place2', 0.4)

            }
        })

    }

    newPiecePopup(pieceId) {

        let imagesrc = this.activeMergeSystem.dataTiles[pieceId].rawData.imageSrc
        let name = this.activeMergeSystem.dataTiles[pieceId].rawData.displayName
        let castlePiece = this.activeMergeSystem.interactiveBackground.getPiece(pieceId).src

        this.notificationPanel.buildNewPieceNotification(imagesrc, window.localizationManager.getLabel('discovered')+' ' + name, null, config.assets.popup.secondary)

        SOUND_MANAGER.play('coins_04', 0.4)

        setTimeout(() => {

            SOUND_MANAGER.play('coins_04', 0.4, 1.1)
            this.notificationPanel.buildNewPieceNotification(castlePiece, window.localizationManager.getLabel('unlockedPiece'), null, config.assets.popup.extra)
            this.activeMergeSystem.interactiveBackground.showAnimation(pieceId)
        }, 2000);


    }

    upgradePiecePopUp(slot, level) {
        let piece1 = this.activeMergeSystem.dataTiles[level]
        let piece2 = this.activeMergeSystem.dataTiles[level + 1]

        this.openPopUp(this.standardPopUp, {
            value1: piece1.rawData.displayName,
            value2: piece2.rawData.displayName,
            value1Icon: piece1.rawData.imageSrc,
            value2Icon: piece2.rawData.imageSrc,
            title: window.localizationManager.getLabel('upgrade'),
            confirmLabel: window.localizationManager.getLabel('upgrade'),
            cancelLabel: window.localizationManager.getLabel('cancel'),
            mainLabel2: window.localizationManager.getLabel('upgradeWatch'),
            popUpType: config.assets.popup.secondary,
            mainIcon: 'results_arrow_right',
            mainIconHeight: 30,
            video: true,
            onConfirm: () => {
                this.activeMergeSystem.addDataTo(slot, level + 1)
                SOUND_MANAGER.play('getThemAll', 0.4)
            },
            onCancel: () => {
                SOUND_MANAGER.play('place2', 0.4)

                this.activeMergeSystem.addDataTo(slot, level)
            }
        })

    }

    refreshSystemVisuals() {
        if (!this.activeMergeSystem.isLoaded) {
            this.activeMergeSystem.loadData();
        }

        window.gameEconomy.updateBoard(this.activeMergeSystem.systemID)
        this.resourcesTexture.texture = PIXI.Texture.fromImage(this.activeMergeSystem.baseData.visuals.coin)
        this.resourcesTexture.scale.set(40 / this.resourcesTexture.height * 0.5 * this.resourcesTexture.scale.y)

        this.shardsTexture.texture = PIXI.Texture.fromImage(this.activeMergeSystem.baseData.visuals.coin)
        this.shardsTexture.scale.set(40 / this.shardsTexture.height * 0.5 * this.shardsTexture.scale.y)

        this.openMergeShop.icon.texture = PIXI.Texture.fromImage('shop')
        //this.openMergeShop.icon.texture = PIXI.Texture.fromImage(this.activeMergeSystem.dataTiles[0].rawData.imageSrc)
        this.openMergeShop.updateIconScale(0.8)


        this.extraMoneyBonus.icon.texture = PIXI.Texture.fromImage('money');

        //SOUND_MANAGER.stopLoop()
        SOUND_MANAGER.playLoop(this.activeMergeSystem.soundtrack, 0.1)
        this.resize(this.latestInner, this.latestInner);
        setTimeout(() => {
            this.activeMergeSystem.activeSystem()

            this.resize(this.latestInner, this.latestInner)
        }, 1);

    }
    startTutorial() {
        setTimeout(() => {

        }, 51);
        this.gameTutorial.start();

    }
    endTutorial() {

    }
    onConfirmBonus(target) {
        this.openPopUp(this.bonusPopUp, {
            texture: target.mainButton.icon.texture,
            description: target.fullDescription,
            shortDescription: target.shortDescription,
            onConfirm: () => {
                target.confirmBonus();
                SOUND_MANAGER.play('getThemAll', 0.4)
            }
        })
    }
    moneyFromCenter(value) {
        let toLocal = this.particleSystemFront.toLocal({ x: config.width / 2, y: config.height / 2 })

        SOUND_MANAGER.play('getThemAll', 0.5)


        for (let index = 1; index <= 10; index++) {
            let angle = (Math.PI * 2 / 10) * index
            let customData = {};
            customData.texture = this.activeMergeSystem.baseData.visuals.coin
            customData.scale = 0.035
            customData.gravity = 20//1000
            customData.alphaDecress = 0
            customData.forceX = Math.sin(angle) * 800
            customData.forceY = Math.cos(angle) * 500
            customData.ignoreMatchRotation = true

            let coinPosition = this.shardsTexture.getGlobalPosition();

            let toLocalTarget = this.particleSystemFront.toLocal(coinPosition)

            customData.target = { x: toLocalTarget.x, y: toLocalTarget.y, timer: 0.25 + Math.random() * 0.5 }
            this.particleSystemFront.show(toLocal, 1, customData)


        }
        this.popLabelFront({ x: config.width / 2, y: config.height / 2 }, utils.formatPointsLabel(value), 2);

    }
    addSystem(system) {
        if (!this.systemsList.includes(system)) {
            this.systemsList.push(system)
        }
    }
    collectStartAmountDouble() {
        window.DO_REWARD(() => {
            //this.resourceSystem.collectCustomStartAmount(this.sumStart * 2)
        })
    }
    collectStartAmount() {
        //this.resourceSystem.collectCustomStartAmount(this.sumStart)
    }
    standardPopUpShow(params) {
        this.openPopUp(this.standardPopUp, params)
    }
    openPopUp(target, params) {

        this.uiPanels.forEach(element => {
            if (element.visible) {
                //element.hide();
            }
        });

        this.currentOpenPopUp = target;
        target.show(params, this.activeMergeSystem.baseData.visuals)
    }
    popLabel(targetPosition, label, scale = 1) {
        let toLocal = this.particleSystem.toLocal(targetPosition)


        this.particleSystem.popLabel(toLocal, "+" + label, 0, 1, scale, LABELS.LABEL1, Back.easeOut, 0.5, 1)
    }
    popLabelFront(targetPosition, label, scale = 1) {
        let toLocal = this.particleSystemFront.toLocal(targetPosition)


        this.particleSystemFront.popLabel(toLocal, "+" + label, 0, 1, scale, LABELS.LABEL1, Back.easeOut, 0.5, 1)
    }
    popLabelDamage(targetPosition, label) {
        let toLocal = this.particleSystem.toLocal(targetPosition)


        this.particleSystem.popLabel(toLocal, "+" + label, 0, 1, 1.5, LABELS.LABEL_DAMAGE, Back.easeOut, 0.5, 1)
    }
    addParticles(targetPosition, customData, quant) {
        let toLocal = this.particleSystem.toLocal(targetPosition)
        this.particleSystem.show(toLocal, quant, customData)
    }

    addDamageParticles(targetPosition, customData, label, quant) {
        let toLocal = this.particleSystem.toLocal(targetPosition)
        this.particleSystem.show(toLocal, quant, customData)
        //this.particleSystem.popLabel(targetPosition, "+" + label, 0, 1, 1, LABELS.LABEL1)
    }
    onNextLevel(data) {
        this.levelUpPopUp(data)
    }
    onSpecialTileReveal(slot, level) {

        this.upgradePiecePopUp(slot, level)
    }
    onMergeSystemUpdate(data) {

        if (data) {
            this.levelMeter.updateData(data)
            COOKIE_MANAGER.addAchievment(this.activeMergeSystem.systemID, 'level', data.currentLevel, true)
        }

        for (let index = 1; index < this.systemsList.length; index++) {
            // if(!this.systemButtonList[index]) break
            const element = this.systemsList[index];
            const prev = this.systemsList[index - 1];

            let isInit = COOKIE_MANAGER.isInitialized(this.systemsList[index].systemID)
            //console.log('isInit',isInit,this.systemsList[index].systemID)
            if ((!prev.boardProgression || prev.boardProgression.currentLevel < 6) && !window.allUnlock) {
                element.toggle.disable()
            } else {
                if (!isInit) {

                    this.pendingNotification = () => {
                        SOUND_MANAGER.play('Musical-Beep-Loop-02', 0.5)
                        this.notificationPanel.buildNewPieceNotification(this.systemsList[index].dataTiles[0].rawData.imageSrc, 'You unlock a new level', null, config.assets.popup.tertiary)
                        TweenMax.to(this.systemsList[index].toggle.unlockTextbox, 0.5, { alpha: 1, delay: 4 })
                    }
                    //.alpha = 1;
                    COOKIE_MANAGER.initBoard(this.systemsList[index].systemID)
                }
                element.toggle.enable()
            }
        }

    }
    addResourceParticles(targetPosition, customData, totalResources, quantParticles, showParticles = true) {
        window.gameEconomy.addResources(totalResources, this.activeMergeSystem.systemID)

        if (totalResources < 1000) {
            this.popLabelDamage(targetPosition, totalResources)
        } else {
            this.popLabelDamage(targetPosition, utils.formatPointsLabel(totalResources))
        }
        if (quantParticles <= 0) {
            return;
        }
        let toLocal = this.particleSystem.toLocal(targetPosition)
        if (!showParticles) {
            quantParticles = 1
        }

        for (let index = 0; index < quantParticles; index++) {
            //customData.target = { x: coinPosition.x - frontLayer.x, y: coinPosition.y - frontLayer.y, timer: 0.2 + Math.random() * 0.75 }
            //customData.target = { x: toLocal.x, y: toLocal.y - 50, timer: 0 }
            customData.gravity = 0
            customData.alphaDecress = 0.7
            customData.ignoreMatchRotation = true;
            this.particleSystem.show(toLocal, 1, customData)
        }

        return
        let coinPosition = this.resourcesTexture.getGlobalPosition()
        let toLocalCoin = this.particleSystem.toLocal(coinPosition)
        for (let index = 0; index < 1; index++) {
            customData.target = { x: toLocalCoin.x, y: toLocalCoin.y, timer: 0.2 + Math.random() * 0.75 }
            customData.scale = 0.01
            customData.forceX = Math.random() * 1000 - 500
            customData.forceY = 500
            customData.gravity = 1200
            customData.alphaDecress = 0.1
            customData.ignoreMatchRotation = true;
            this.particleSystem.show(toLocal, 1, customData)
        }

    }
    onMouseMove(e) {

        if (this.currentOpenPopUp && this.currentOpenPopUp.visible) {
            return;
        }

        this.systemsList.forEach(element => {
            element.updateMouseSystems(e)
        });
        this.mousePosition = e.data.global;
        if (!this.draggingEntity) {
            return;
        }
        if (this.entityDragSprite.visible) {
            this.entityDragSprite.x = this.mousePosition.x;
            this.entityDragSprite.y = this.mousePosition.y;
        }
    }


    onAdded() {


    }
    build(param) {
        super.build();
        this.addEvents();
    }
    update(delta) {
        delta *= window.TIME_SCALE * window.gameModifyers.bonusData.gameSpeed;

        //this.gameTutorial.update(delta);

        if (this.forcePauseSystemsTimer > 0) {
            this.forcePauseSystemsTimer -= delta;

        } else {
            this.systemsList.forEach(element => {
                element.updateSystems(delta)
            });
            this.particleSystem.update(delta)
            this.particleSystemFront.update(delta)
        }

        this.uiPanels.forEach(element => {
            if (element.update) {
                element.update(delta)
            }
        });


        this.totalCoins.text = utils.formatPointsLabel(window.gameEconomy.currentResources);
        utils.centerObject(this.totalCoins, this.totalCoinsContainer)
        this.totalCoins.x = 30

        this.coisPerSecond.text = utils.formatPointsLabel(this.activeMergeSystem.rps) + '/s';
        utils.centerObject(this.coisPerSecond, this.coinsPerSecondCounter)
        this.coisPerSecond.x = 30

        this.timestamp = (Date.now() / 1000 | 0);


        this.activeMergeSystem.interactiveBackground.update(delta);
        this.activeMergeSystem.shop.update(delta);

        this.notificationPanel.update(delta);
    }
    resize(resolution, innerResolution) {
        if (!innerResolution || !innerResolution.height) return

        this.latestInner = innerResolution;
        if (!resolution || !resolution.width || !resolution.height || !innerResolution) {
            //return;
        }

        var newRes = { width: resolution.width * this.screenManager.scale.x }

        if (this.activeMergeSystem.interactiveBackground) {

            this.activeMergeSystem.interactiveBackground.resize(resolution, innerResolution);
            this.activeMergeSystem.interactiveBackground.x = config.width / 2
            this.activeMergeSystem.interactiveBackground.y = config.height / 2
        }



        var toGlobal = this.toLocal({ x: 0, y: innerResolution.height })



        var topRight = game.getBorder('topRight', this)
        var toGlobalBack = this.toLocal({ x: 0, y: innerResolution.height })


        if (!window.isPortrait) {

            this.gridWrapper.x = toGlobalBack.x + 20
            this.gridWrapper.y = config.height - (this.activeMergeSystem.interactiveBackground.puzzleBackground.pivot.y + 25) * this.activeMergeSystem.interactiveBackground.puzzleBackground.scale.y//this.puzzleBackground.y - this.puzzleBackground.pivot.y

            this.gridWrapper.width = this.activeMergeSystem.interactiveBackground.puzzleBackground.usableArea.width * this.activeMergeSystem.interactiveBackground.puzzleBackground.scale.x
            this.gridWrapper.height = this.activeMergeSystem.interactiveBackground.puzzleBackground.usableArea.height * this.activeMergeSystem.interactiveBackground.puzzleBackground.scale.y


            this.shopButtonsList.x = this.shopButtonsList.width
            this.shopButtonsList.y = 10

            this.shopButtonsList.scale.set(1.8)
            this.levelMeter.scale.set(1.3)


        } else {

            this.mergeSystemContainer.scale.set(1)

            this.levelMeter.scale.set(0.7)
            this.gridWrapper.width = config.width * this.areaConfig.gameArea.w
            this.gridWrapper.height = config.height * this.areaConfig.gameArea.h
            this.gridWrapper.x = 0
            this.gridWrapper.y = this.activeMergeSystem.interactiveBackground.puzzleBackground.usableArea.y - this.activeMergeSystem.interactiveBackground.puzzleBackground.pivot.y + this.activeMergeSystem.interactiveBackground.puzzleBackground.y + this.activeMergeSystem.interactiveBackground.y - 20

        }

        this.systemButtonList.w = this.systemButtonList.elementsList[0].width
        this.systemButtonList.h = 85 * this.systemsList.length + this.systemsList.length * 2
        this.systemButtonList.updateVerticalList()

        this.statsList.y = 10
        this.statsList.x = toGlobalBack.x + 10

        this.bonusesList.y = this.statsList.y + this.statsList.height + this.statsList.w / 2 + 20;
        this.bonusesList.x = this.statsList.x + + this.bonusesList.w * 0.5

        this.helperButtonList.y = 95
        this.helperButtonList.x = toGlobalBack.x + 158


        if (!window.isPortrait) {

            this.statsList.scale.set(1.5)
            this.shopButtonsList.x = topRight.x - this.shopButtonsList.width / 2 - 20
            this.shopButtonsList.y = config.height - this.shopButtonsList.height - 20
            this.shopButtonsList.scale.set(1.5)

            this.systemButtonList.scale.set(1.5)
            this.systemButtonList.x = topRight.x - this.systemButtonList.width / 2 - 20
            this.systemButtonList.y = 35 * this.systemButtonList.scale.y + 20

            this.levelMeter.x = this.statsList.x + this.statsList.width + 20
            this.levelMeter.y = 20

        } else {


            this.levelMeter.x = this.gridWrapper.x - this.levelMeter.width / 2 + this.gridWrapper.width / 2
            this.levelMeter.y = 10//this.gridWrapper.y - this.levelMeter.height

            this.statsList.scale.set(1.25)

            this.systemButtonList.scale.set(1)


            this.shopButtonsList.x = topRight.x - this.shopButtonsList.width * 0.5 - 20
            this.shopButtonsList.y = this.systemButtonList.y + this.systemButtonList.height// this.shopButtonsList.height * 1.25
            this.shopButtonsList.scale.set(1)
        }


        this.soundButton.scale.set(this.systemButtonList.scale.x)
        this.soundButton.x = topRight.x - this.soundButton.width / 2 - 20
        this.soundButton.y = 40 * this.systemButtonList.scale.x

        this.systemButtonList.x = topRight.x - (80 * this.systemButtonList.scale.x) / 2 - 20
        this.systemButtonList.y = this.soundButton.y + (20*this.systemButtonList.scale.x) + 35 * this.systemButtonList.scale.y + 20


        this.shopsLabel.x = this.shopButtonsList.x
        this.shopsLabel.y = this.shopButtonsList.y
        this.uiPanels.forEach(element => {
            element.x = config.width / 2
            element.y = config.height / 2
        });


        this.notificationPanel.x = config.width / 2
        this.notificationPanel.y = this.levelMeter.y + this.levelMeter.height + this.notificationPanel.notificationHeight / 2
        this.systemsList.forEach(element => {
            element.resize(resolution, innerResolution, this.resourcesWrapperRight);
        });


    }

    transitionOut(nextScreen) {
        this.removeEvents();
        this.nextScreen = nextScreen;
        setTimeout(function () {
            this.endTransitionOut();
        }.bind(this), 0);
    }
    transitionIn() {
        super.transitionIn();
    }
    destroy() {

    }
    removeEvents() {
    }
    addEvents() {
        this.removeEvents();

    }

    addHelpers() {
        this.helperButtonList = new UIList();
        this.helperButtonList.h = 400;
        this.helperButtonList.w = 60;
        this.speedUpToggle = new UIButton1(0x002299, 'fast_forward_icon')
        this.helperButtonList.addElement(this.speedUpToggle)
        this.speedUpToggle.onClick.add(() => {
            if (window.TIME_SCALE > 1) {
                window.TIME_SCALE = 1
            } else {
                window.TIME_SCALE = 30
            }

            TweenMax.globalTimeScale(window.TIME_SCALE)
        })

        this.clearData = new UIButton1(0x002299, 'icon_reset')
        this.helperButtonList.addElement(this.clearData)
        this.clearData.onClick.add(() => {
            COOKIE_MANAGER.wipeData()
        })

        this.addCash = new UIButton1(0x002299, 'coin')
        this.helperButtonList.addElement(this.addCash)
        this.addCash.onClick.add(() => {
            window.gameEconomy.addResources(
                8000000000000)
        })


        this.addRandomShip = new UIButton1(0x002299, 'vampire')
        this.helperButtonList.addElement(this.addRandomShip)
        this.addRandomShip.onClick.add(() => {
            this.activeMergeSystem.addShipBasedOnMax()
        })



        this.autoMergeToggle = new UIButton1(0x002299, 'hand')
        this.helperButtonList.addElement(this.autoMergeToggle)
        this.autoMergeToggle.onClick.add(() => {
            if (window.gameModifyers.modifyersData.autoMerge >= 2) {
                window.gameModifyers.modifyersData.autoMerge = 1
            }
            else {
                window.gameModifyers.modifyersData.autoMerge = 2
                //window.gameModifyers.updateModifyer('autoMerge')

            }
        })

        this.unlockAll = new UIButton1(0x002299, 'upArrow')
        this.helperButtonList.addElement(this.unlockAll)
        this.unlockAll.onClick.add(() => {
            if (window.allUnlock) {
                window.allUnlock = false
            } else {
                window.allUnlock = true;
            }

            this.onMergeSystemUpdate()
        })
        this.showCastle = new UIButton1(0x002299, 'upArrow')
        this.helperButtonList.addElement(this.showCastle)
        this.showCastle.onClick.add(() => {
            this.activeMergeSystem.interactiveBackground.showAll()
        })
        this.helperButtonList.updateVerticalList();
        this.container.addChild(this.helperButtonList)

        this.helperButtonList.visible = false
        this.helperButtonList.scale.set(0.85)
    }
}