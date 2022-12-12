import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import StandardPop from './StandardPop';
import AutoCollectButton from '../../ui/AutoCollectButton';
import CatItemList from '../../ui/CatItemList';
import TrophyContainer from '../../ui/TrophyContainer';
import PointsContainer from '../../ui/PointsContainer';
import SpaceShipContainer from '../../ui/SpaceShipContainer';
import ChestContainer from '../../ui/ChestContainer';
// import PrizeContainer from '../../ui/PrizeContainer';
import GameOverCatsContainer from '../../ui/GameOverCatsContainer';
import UIButton from '../../ui/uiElements/UIButton';
import HUD from '../../ui/HUD';
export default class GameOverPopUp extends StandardPop
{
    constructor(label, screenManager)
    {
        super(label, screenManager);


        this.popUp.alpha = 0;
        this.popUp.tint = 0x999999
        this.onInitRedirect = new Signals();
        this.onShopRedirect = new Signals();

        this.logoMask = new PIXI.Sprite.from('logo_mask_white');
        this.logoMask.anchor.set(0.5);
        this.logoMask.x = config.width / 2
        this.logoStartScale = this.width / this.logoMask.width;
        this.logoMask.scale.set(this.logoStartScale)
        this.logoMask.y = this.logoMask.height / 2 + config.height * 0.1

        this.container.y = this.logoMask.height / 2 + config.height * 0.1

        this.lines = [];
        this.catListContainer = new PIXI.Container();

        this.catItemList = new CatItemList(
        {
            w: this.logoMask.width * 0.85,
            h: this.logoMask.height * 0.75
        });
        this.catListContainer.addChild(this.catItemList)
        this.catItemList.updateAllItens();
        this.catItemList.onAutoCollect.add(this.onAutoCollect.bind(this));
        this.catItemList.onActiveCat.add(this.onActiveCat.bind(this));
        this.catItemList.onInfoAutoCollect.add(this.onInfoAutoCollect.bind(this));
        this.catListContainer.x = -this.catItemList.containerBackground.width / 2 // 2 + this.catItemList.upButton.width / 2
        this.catListContainer.y = -this.catItemList.containerBackground.height / 2 // 2 + this.catItemList.upButton.height * 2
        this.container.addChild(this.catListContainer);


        this.playButton = new UIButton('icon_play', 0.6) //new PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
            // this.playButton.anchor.set(0.5)
        this.playButtonScale = this.logoMask.height / this.playButton.height * 0.3
        this.playButton.scale.set(this.playButtonScale);
        this.playButton.y = config.height - this.container.y - this.playButton.height / 2 - 20
        this.playButton.interactive = true;
        this.playButton.buttonMode = true;
        this.playButton.on('mousedown', this.confirm.bind(this)).on('touchstart', this.confirm.bind(this));
        this.container.addChild(this.playButton)
        this.playButton.scale.set(0);


        this.settingsButton = new UIButton('icon_settings', 0.75)
        this.settingsButtonScale = this.logoMask.height / this.settingsButton.height * 0.15
        this.settingsButton.scale.set(this.settingsButtonScale, this.settingsButtonScale);
        // console.log(this.settingsButton.width);
        this.settingsButton.x = config.width / 2 - this.settingsButton.width;
        this.settingsButton.y = -config.height / 2 + this.settingsButton.height + config.height * 0.2;
        // this.settingsButton.y = -300
        this.settingsButton.interactive = true;
        this.settingsButton.buttonMode = true;
        this.settingsButton.on('mouseup', this.openSettings.bind(this)).on('touchend', this.openSettings.bind(this));
        this.container.addChild(this.settingsButton)


        this.shopButton = new UIButton('icon_shop')
        this.shopButtonScale = this.logoMask.height / this.shopButton.height * 0.20
        this.shopButton.scale.set(this.shopButtonScale, this.shopButtonScale);
        this.shopButton.x = config.width * 0.17 - config.width / 2
        this.shopButton.y = this.playButton.y //+ this.shopButton.height + config.height * 0.2;
            // this.shopButton.y = -300
        this.shopButton.interactive = true;
        this.shopButton.buttonMode = true;

        this.shopInfo = new PIXI.Sprite.from('info');
        this.shopInfo.anchor.set(0.5);
        this.shopInfo.scale.set((this.shopButton.width / this.shopButtonScale) / this.shopInfo.width * 0.4);
        this.shopButton.addChild(this.shopInfo)
        this.shopInfo.x = this.shopButton.width / this.shopButtonScale * 0.5;
        this.shopInfo.y = -this.shopButton.height / this.shopButtonScale * 0.5;
        this.shopButton.on('mousedown', this.redirectToShop.bind(this)).on('touchstart', this.redirectToShop.bind(this));
        this.container.addChild(this.shopButton)


        this.pointsContainer = new PointsContainer();
        this.addChild(this.pointsContainer)
        this.pointsContainer.x = config.width / 2
        this.pointsContainer.y = this.logoMask.y + this.logoMask.height - this.pointsContainer.height * 0.25 // - this.pointsContainer.height//config.height / 2 + this.pointsContainer.height * 0.75

        this.trophyContainer = new TrophyContainer();
        this.addChild(this.trophyContainer)
        this.trophyContainer.x = config.width * 0.17
        this.trophyContainer.y = config.height * 0.7

        this.chestContainer = new ChestContainer();
        this.addChild(this.chestContainer)
        this.chestContainer.x = config.width * 0.8;
        this.chestContainer.y = config.height * 0.85;
        this.chestContainer.onConfirm.add(() =>
        {
            this.onConfirmChest();
        });
        this.screenBlocker = new PIXI.Graphics().beginFill().drawRect(0, 0, config.width, config.height);
        this.addChild(this.screenBlocker);
        this.screenBlocker.alpha = 0.5
        this.screenBlocker.interactive = true;
        this.screenBlocker.buttonMode = true;
        this.screenBlocker.on('mousedown', this.closeSpaceship.bind(this)).on('touchstart', this.closeSpaceship.bind(this));
        this.screenBlocker.visible = false;

        this.spaceShipContainer = new SpaceShipContainer();
        this.addChild(this.spaceShipContainer)
        this.spaceShipContainer.x = config.width * 0.83
        this.spaceShipContainer.y = config.height * 0.7
        this.spaceShipContainer.onOpenInfo.add(() =>
        {
            if (this.possibleToSendToEarth())
            {
                this.spaceShipContainer.openSpaceshipInfoCallback();
                this.showScreenBlocker();
            }
            else
            {
                this.screenManager.showInfo(
                {
                    x: config.width / 2,
                    y: config.height / 2
                }, 'spaceship', 'ou need to unlock at least \n' + GAME_DATA.minimumAmountOfCatsToReset + ' types of cat before you can\nsend them back to Earth',
                {
                    x: 0,
                    y: 0.5
                })
            }
        })
        this.spaceShipContainer.onCloseInfo.add(() =>
        {
            this.hideScreenBlocker();
        })
        this.spaceShipContainer.onConfirm.add(() =>
        {
            this.onConfirmSpaceship();
        })
        this.spaceShipContainer.onInfoSpaceship.add(() =>
        {
            this.screenManager.showInfo(
            {
                x: config.width / 2,
                y: config.height / 2
            }, 'spaceship', 'Send saved cats back to earth!\nSending cats to earth resets all progress\nin exchange for lots of lovely trophies!',
            {
                x: 0,
                y: 0.5
            })
        })


        this.screenManager.prizeContainer.onPrizeCollected.add(this.hidePrizeContainer.bind(this));
        this.screenManager.settingsContainer.onHide.add(this.onHideSettings.bind(this));
        // this.addChild(this.screenManager.prizeContainer)

        this.pointsContainer.updateMoney(GAME_DATA.moneyData.currentCoins, true)

        this.gameOverCatsContainer = new GameOverCatsContainer();
        this.addChild(this.gameOverCatsContainer)
        this.gameOverCatsContainer.hide();
        this.gameOverCatsContainer.onHide.add(this.onHideCatsGameOverList.bind(this));
        this.gameOverCatsContainer.onCollectGift.add(this.onCollectGift.bind(this));

    }

    onCollectGift()
    {
        this.screenManager.prizeContainer.show(1);
    }
    openSettings()
    {
        this.screenManager.openSettings();
    }
    enableAutoCollect(data)
    {
        GAME_DATA.enableAutoCollect(data)

        let staticData = GAME_DATA.getStaticCatData(data)

        console.log(staticData, data);
        let name = staticData.catName.replace('\n', ' ');
        this.screenManager.showInfo(
        {
            x: config.width / 2,
            y: config.height / 2
        }, null, (name + ' now will be collected\nautomatically').toUpperCase(),
        {
            x: 0,
            y: 0.5
        })

        SOUND_MANAGER.play('pickup_star');

        this.updateTrophyQuant();
        this.screenManager.closeVideo();
        this.catItemList.updateAllItens()
    }
    onInfoAutoCollect()
    {
        this.screenManager.showInfo(
        {
            x: config.width / 2,
            y: config.height / 2
        }, 'automate', 'This cat will be collected\nautomatically',
        {
            x: 0,
            y: 0.5
        })
    }
    onActiveCat(data)
    {
        GAME_DATA.activeCat(data);
        this.catItemList.updateItemActive(data.catID);
        this.updateCatsQuant();
        let staticData = GAME_DATA.getStaticCatData(data.catID)
        GAME_DATA.moneyData.currentCoins -= staticData.cost;
        this.pointsContainer.updateMoney(GAME_DATA.moneyData.currentCoins)
    }
    onAutoCollect(data)
    {
        // this.showScreenBlocker();
        //console.log('AUTO COLLECT');
        this.enableAutoCollect(data.catID)
            // this.screenManager.loadVideo(this.enableAutoCollect.bind(this, data.catID), data.catID);
    }
    resetAll()
    {
        STORAGE.reset();
        location.reload();
    }
    addMany()
    {
        GAME_DATA.addCats([100, 100, 100, 100]);
        GAME_DATA.updateTrophy(10000);

        let tempCurrent = GAME_DATA.maxPoints * 1.5 + 20;
        let current = utils.formatPointsLabel(tempCurrent / MAX_NUMBER);

        GAME_DATA.updateCatsAllowed(tempCurrent);
        let high = utils.formatPointsLabel(GAME_DATA.maxPoints / MAX_NUMBER);
        this.updatePoints(current, high, tempCurrent);
        this.pointsContainer.updateMoney(GAME_DATA.moneyData.currentCoins, false, 0.1)
        this.pointsContainer.erasePoints(0.1)
        this.updateAllData()
    }
    hideScreenBlocker()
    {
        this.screenBlocker.visible = true;
        TweenLite.to(this.screenBlocker, 0.5,
        {
            alpha: 0,
            onComplete: () =>
            {
                this.screenBlocker.visible = false;
            }
        })
    }
    showScreenBlocker()
    {
        this.screenBlocker.visible = true;
        this.screenBlocker.alpha = 0;
        TweenLite.to(this.screenBlocker, 0.5,
        {
            alpha: 0.5,
        })
    }
    toInit()
    {
        this.onInitRedirect.dispatch();
    }
    redirectToInit()
    {
        this.hide(false, this.toInit.bind(this));
    }
    redirectToShop()
    {
        this.onShopRedirect.dispatch();
    }

    closeSpaceship()
    {
        this.spaceShipContainer.closeSpaceship();
    }

    spaceshipVideoCallback()
    {
        // this.spaceShipContainer.visible = false;
        this.catItemList.resetPosition();
        this.screenManager.closeVideo();
        GAME_DATA.sendCatsToEarth();
        this.updateCatsQuant();
        this.updateTrophyQuant();

        TweenLite.to(this, 1,
        {
            onComplete: () =>{

                SOUND_MANAGER.play('pickup_star', 0.75)
            },
            onUpdate: () =>
            {
                SOUND_MANAGER.play('star_0' + Math.ceil(Math.random() * 3), 0.5)
                let globalCoinPos = this.trophyContainer.getGlobalPosition();
                globalCoinPos.x -= this.trophyContainer.width * 0.15
                globalCoinPos.y -= this.trophyContainer.height * 0.15
                window.screenManager.addCoinsParticles(globalCoinPos, 1,
                {
                    texture: 'trophy',
                    alphaDecress: 0.5,
                    gravity: 500,
                    scale: 0.03,
                    angSpeed: Math.random() * 2 - 1
                });
            }
        })


        this.pointsContainer.erasePoints(0.1);
        this.pointsContainer.updateMoney(GAME_DATA.moneyData.currentCoins)

    }
    onConfirmSpaceship()
    {
        this.closeSpaceship();
        this.screenManager.loadVideo(this.spaceshipVideoCallback.bind(this), null, 'spaceship');
    }

    hidePrizeContainer()
    {
        if (this.visible)
        {
            this.updateAllData();
        }
    }
    openChestVideoCallback()
    {
        //this.screenManager.closeVideo();
        // this.chestContainer.visible = false;
        this.screenManager.prizeContainer.show();
    }
    onConfirmChest()
    {
        this.catItemList.resetPosition();
        this.screenManager.prizeContainer.show(2);
        //this.screenManager.loadVideo(this.openChestVideoCallback.bind(this));
    }

    updatePoints(current, high, currentNumber)
    {
        this.pointsContainer.updatePoints(current, high, currentNumber)

    }
    hide(dispatch, callback)
    {
        //console.log(dispatch);
        TweenLite.to(this.logoMask.scale, 0.5,
        {
            x: 5,
            y: 5,
            onComplete: () =>
            {
                this.screenManager.mask = null;
                if (this.logoMask.parent)
                    this.logoMask.parent.removeChild(this.logoMask)
                this.onHide.dispatch(this);
                this.toRemove = true
                super.hide(dispatch, callback);

            }
        })

        TweenLite.to(this.chestContainer, 0.5,
        {
            onComplete: () =>
            {
                this.chestContainer.visible = false;
            },
            alpha: 0
        });
        TweenLite.to(this.trophyContainer, 0.5,
        {
            alpha: 0
        });

        TweenLite.to(this.spaceShipContainer, 0.5,
        {
            alpha: 0
        });

        TweenLite.to(this.pointsContainer, 0.5,
        {
            alpha: 0
        });

        TweenLite.to(this.container.scale, 0.25,
        {
            x: 0,
            y: 1.5,
            ease: Back.easeIn
        })
    }
    updateAllData()
    {
        this.updateCatsQuant();
        this.updateTrophyQuant();
        this.catItemList.updateAllItens();
        this.pointsContainer.updateMoney(GAME_DATA.moneyData.currentCoins);
    }
    updateCatsQuant()
    {
        this.catItemList.updateAllItens();


        // return
        if (!this.updateCatsAllowed())
        {
            //this.spaceShipContainer.visible = false;

        }
        else
        {
            if (!this.spaceShipContainer.visible)
            {
                this.spaceShipContainer.x = config.width + this.spaceShipContainer.width
                TweenLite.to(this.spaceShipContainer, 0.65,
                {
                    x: config.width * 0.83,
                    ease: Back.easeOut
                })
            }
            this.spaceShipContainer.visible = true;
        }
    }

    updateTrophyQuant()
    {
        let percent = GAME_DATA.trophyData.collectedMultiplier

        if (percent >= 1)
        {
            percent = utils.formatPointsLabel(GAME_DATA.trophyData.collectedMultiplier / MAX_NUMBER)
        }
        else
        {
            percent = percent.toFixed(2);
        }
        let data = {
            bonus: percent + '%',
            quant: utils.formatPointsLabel(GAME_DATA.trophyData.collected / MAX_NUMBER)
        }


        this.trophyContainer.updateData(data);
    }
    possibleToSendToEarth()
    {
        let activeCats = 0;
        for (var i = 0; i < GAME_DATA.catsData.length; i++)
        {
            if (GAME_DATA.catsData[i].active)
            {
                activeCats++;
            }
        }
        if (activeCats >= GAME_DATA.minimumAmountOfCatsToReset)
        {
            return true
        }
        else
        {
            return false
        }
    }
    updateCatsAllowed()
    {
        let activeCats = 0;
        for (var i = 0; i < GAME_DATA.catsData.length; i++)
        {
            if (GAME_DATA.catsData[i].active)
            {
                activeCats++;
            }
        }
        if (activeCats < 0)
        {
            this.spaceShipContainer.visible = false;
            return false
        }
        else
        {
            this.spaceShipContainer.visible = true;
            return true
        }
    }
    onHideCatsGameOverList()
    {
        this.pointsContainer.updateMoney(GAME_DATA.moneyData.currentCoins, false, 0.25)
        this.pointsContainer.erasePoints(0.25)
        this.updateCatsQuant()
    }
    onHideSettings()
    {
        this.updateCurrency();
        this.updateCatsQuant();
    }
    updateCurrency()
    {
        this.pointsContainer.updateMoney(GAME_DATA.moneyData.currentCoins, true, 0)
        this.updateTrophyQuant();
    }
    show(param)
    {
        this.updateTrophyQuant();
        let high = utils.formatPointsLabel(GAME_DATA.maxPoints / MAX_NUMBER);
        this.updatePoints(0, high);

        if (param)
        {

            let totCats = 0;
            for (var i = 0; i < param.catsList.length; i++)
            {
                totCats += param.catsList[i]
            }
            let updatedCatList = param.catsList
            param.points = Math.round(param.points * MAX_NUMBER);
            if (totCats > 0)
            {
                updatedCatList = this.gameOverCatsContainer.show(param.catsList, param.points);
            }

            GAME_DATA.addCats(updatedCatList);

            let hasNew = GAME_DATA.updateCatsAllowed(param.points);
            let current = utils.formatPointsLabel(param.points / MAX_NUMBER);
            let high = utils.formatPointsLabel(GAME_DATA.maxPoints / MAX_NUMBER);
            this.updatePoints(current, high, param.points);

            if (totCats <= 0)
            {
                this.onHideCatsGameOverList();
            }

        }
        else
        {
            this.onHideCatsGameOverList();
            this.pointsContainer.updateMoney(GAME_DATA.moneyData.currentCoins, true)

        }



        this.catItemList.resetPosition();

        this.updateCatsAllowed();


        this.logoMask.scale.set(5)
        if (this.screenManager.screensContainer.mask)
        {
            this.screenManager.screensContainer.mask = null;
        }
        this.screenManager.screensContainer.mask = this.logoMask;
        this.screenManager.screensContainer.addChild(this.logoMask)
        TweenLite.to(this.logoMask.scale, 0.75,
        {
            x: this.logoStartScale,
            y: this.logoStartScale,
            onComplete: () =>
            {}
        })

        this.screenManager.prizeContainer.hide();



        this.trophyContainer.alpha = 0;
        TweenLite.to(this.trophyContainer, 0.75,
        {
            delay: 0.5,
            alpha: 1
        });
        this.chestContainer.alpha = 0;
        TweenLite.to(this.chestContainer, 0.75,
        {
            onStart: () =>
            {
                this.chestContainer.visible = true;
            },
            delay: 0.5,
            alpha: 1
        });

        this.spaceShipContainer.alpha = 0;
        TweenLite.to(this.spaceShipContainer, 0.75,
        {
            delay: 0.5,
            alpha: 1
        });

        this.pointsContainer.alpha = 0;
        TweenLite.to(this.pointsContainer, 0.75,
        {
            delay: 0.5,
            alpha: 1
        });

        TweenLite.to(this.playButton.scale, 0.75,
        {
            delay: 0.5,
            x: this.playButtonScale,
            y: this.playButtonScale,
            ease: Elastic.easeOut
        })
        super.show(param);
    }
    update(delta)
    {
        this.spaceShipContainer.update(delta);
        this.trophyContainer.update(delta)
        this.chestContainer.update(delta)
            // this.screenManager.prizeContainer.update(delta)
        this.catItemList.update(delta)
        this.gameOverCatsContainer.update(delta);
        // this.hud.update(delta)
    }
}