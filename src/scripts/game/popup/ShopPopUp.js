import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import StandardPop from './StandardPop';
import ShopList from '../../ui/shop/ShopList';
import ShopItem from '../../ui/shop/ShopItem';
import UIButton from '../../ui/uiElements/UIButton';
export default class ShopPopUp extends StandardPop
{
    constructor(label, screenManager)
    {
        super(label, screenManager);

        let videoLabel = new PIXI.Text('collect the cats and bla bla bla\nonboarding...',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '24px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });


        this.popUp.alpha = 0;

        this.backgroundContainer = new PIXI.Container();
        let tiled = new PIXI.extras.TilingSprite(PIXI.Texture.from('pattern'), 132, 200);
        tiled.width = config.width;
        tiled.height = config.height;
        tiled.alpha = 0.05
        tiled.tileScale.set(0.5)

        this.backgroundContainer.interactive = true;

        this.logoMask = new PIXI.Sprite.from('logo_mask_white');
        this.logoMask.anchor.set(0.5);
        this.logoMask.x = 0 //config.width / 2
        this.logoStartScale = this.width / this.logoMask.width;
        this.logoMask.scale.set(this.logoStartScale)
        this.logoMask.y = 0 //config.height / 2

        let bgColor = new PIXI.Graphics().beginFill(0x12073f).drawRect(-config.width / 2, -config.height / 2, config.width, config.height);
        this.backgroundContainer.addChild(bgColor)

        let bigBlur = new PIXI.Sprite(PIXI.Texture.from('bigblur'));
        this.backgroundContainer.addChild(bigBlur)
        bigBlur.width = this.width // 2;
        bigBlur.height = this.height // 2;
        bigBlur.alpha = 0.2
        bigBlur.anchor.set(0.5);

        tiled.x = -config.width / 2;
        tiled.y = -config.height / 2;

        this.backgroundContainer.addChild(tiled)
            // this.backgroundContainer.addChild(this.logoMask) 
            // this.backgroundContainer.mask = this.logoMask
        this.container.addChild(this.backgroundContainer);


        this.backButton = new UIButton('icon_back')        
        this.backButton.scale.set(config.height / this.backButton.height * 0.1)
        this.backButton.interactive = true;
        this.backButton.buttonMode = true;
        this.backButton.on('mousedown', this.confirm.bind(this)).on('touchstart', this.confirm.bind(this));
        this.container.addChild(this.backButton)

        // this.container.addChild(videoLabel)
        videoLabel.pivot.x = videoLabel.width / 2;
        videoLabel.pivot.y = videoLabel.height / 2;

        videoLabel.y = -this.h / 3 + 50
        // this.cancelButton.x = -75
        // this.cancelButton.y = 50
        this.backButton.icon.scale.x = -1
        this.backButton.x = config.width / 2 - this.backButton.width
        this.backButton.y = config.height / 2 - this.backButton.height

        let shopRect = {
            w: config.width * 0.85,
            h: config.height * 0.65
        }
        this.margin = (config.width - shopRect.w) / 2;
        let pageItens = 6
        this.shopList = new ShopList(shopRect, pageItens);

        this.shopList.x = -shopRect.w / 2
        this.shopList.y = -shopRect.h / 2

        this.container.addChild(this.shopList)

        let shopItens = [];
        for (var i = 0; i < GAME_DATA.actionsData.length; i++)
        {
            let shopItem = new ShopItem(
            {
                w: shopRect.w,
                h: shopRect.h / pageItens
            });
            shopItem.setData(GAME_DATA.actionsData[i], 'actionsDataStatic')
            shopItens.push(shopItem)
        }

        for (var i = 0; i < GAME_DATA.shopData.length; i++)
        {
            let shopItem = new ShopItem(
            {
                w: shopRect.w,
                h: shopRect.h / pageItens
            });
            shopItem.setData(GAME_DATA.shopData[i], 'shopDataStatic')
            shopItens.push(shopItem)
        }

        this.shopList.addItens(shopItens);
        this.shopList.onItemShop.add((item, button) =>
        {
            let globalPos = {x:button.transform.worldTransform.tx + button.width * Math.random(), y:button.transform.worldTransform.ty};
            this.screenManager.addCoinsParticles(globalPos, 1, {forceX:0, forceY:100,texture:'icon_increase', gravity:0});
            this.updateMoney(GAME_DATA.moneyData.currentCoins, false)
            this.updateTrophy(GAME_DATA.trophyData.collected, false)
        })

        this.shopList.onVideoItemShop.add((item) =>
        {
            let staticData = GAME_DATA[item.staticData][item.id];
            console.log(item);
            this.screenManager.loadVideo(this.openVideoCallback.bind(this, staticData), null, 'open_gold_chest');
        })

        this.shopList.onShowInfo.add((item, button) =>
        {
            
            let globalPos = button.toGlobal({x:-button.width / 2, y:0});
            let staticData = GAME_DATA[item.staticData][item.id];
            globalPos.x = config.width / 2
            this.screenManager.showInfo(globalPos, staticData.icon, staticData.shopDesc, {x:0, y:0});
            // this.screenManager.showInfo(globalPos, staticData.icon, staticData.shopDesc, {x:-0.25, y:0.25});
        })

        this.backCurrencyContainer = new PIXI.Graphics().beginFill(0).drawRect(0,0,config.width,  config.height * 0.06)
        this.container.addChild(this.backCurrencyContainer);
        this.backCurrencyContainer.alpha = 0.5;
        this.backCurrencyContainer.x = -config.width / 2
        this.backCurrencyContainer.y = -config.height / 2 + 50
        

        this.coinsContainer = new PIXI.Container();
        this.coinSprite = new PIXI.Sprite.from(GAME_DATA.moneyData.softIcon);
        this.coinsContainer.addChild(this.coinSprite);
        this.coinSprite.anchor.set(0, 0.5);

        this.moneyLabel = new PIXI.Text('0',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '42px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.moneyLabel.pivot.y = this.moneyLabel.height / 2;
        this.coinsContainer.addChild(this.moneyLabel);

        this.coinSprite.scale.set(config.height / this.coinSprite.height * 0.05)
        this.moneyLabel.scale.set(config.height / this.moneyLabel.height * 0.045)
        this.moneyLabel.x = this.coinSprite.width * 1.25;
        this.currentMoney = GAME_DATA.moneyData.currentCoins;
        this.coinsContainer.y = this.backCurrencyContainer.y + this.backCurrencyContainer.height / 2//-config.height / 2 + this.coinsContainer.height + 50
        this.coinsContainer.x = -this.coinsContainer.width / 2



        this.trophyContainer = new PIXI.Container();
        this.trophySprite = new PIXI.Sprite.from(GAME_DATA.trophyData.icon);
        this.trophyContainer.addChild(this.trophySprite);
        this.trophySprite.anchor.set(0, 0.5);

        this.trophyLabel = new PIXI.Text('0',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '42px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.trophyLabel.pivot.y = this.trophyLabel.height / 2;
        this.trophyContainer.addChild(this.trophyLabel);

        this.trophySprite.scale.set(config.height / this.trophySprite.height * 0.05)
        this.trophyLabel.scale.set(config.height / this.trophyLabel.height * 0.045)
        this.trophyLabel.x = this.trophySprite.width * 1.25;
        this.currentTrophy = GAME_DATA.trophyData.collected;
        this.trophyContainer.y = this.backCurrencyContainer.y + this.backCurrencyContainer.height / 2//-config.height / 2 + this.trophyContainer.height + 50
        this.trophyContainer.x = this.trophyContainer.width / 2// - this.trophyContainer.width

        this.container.addChild(this.coinsContainer);
        this.container.addChild(this.trophyContainer);

        this.updateMoney(GAME_DATA.moneyData.currentCoins, true)
        this.updateTrophy(GAME_DATA.trophyData.collected, true)

        this.screenManager.prizeContainer.onPrizeCollected.add(this.hidePrizeContainer.bind(this));

    }
    openVideoCallback(data)
    {
        this.screenManager.closeVideo();
        this.screenManager.prizeContainer.show(data.value);
    }
    hidePrizeContainer(){
        if(!this.visible){
            return;
        }
        this.shopList.updateItems();
        
        this.updateMoney(GAME_DATA.moneyData.currentCoins, false)
        this.updateTrophy(GAME_DATA.trophyData.collected, false)
    }
    update(delta)
    {

    }
    show(param)
    {
        this.toRemove = false;
        this.onShow.dispatch(this);
        this.shopList.updateItems();
        this.shopList.show();

        this.container.scale.set(0, 2)
        this.updateMoney(GAME_DATA.moneyData.currentCoins, true)
        this.updateTrophy(GAME_DATA.trophyData.collected, true)
        TweenLite.to(this.container.scale, 0.25,
        {
            x: 1,
            y: 1,
            ease: Back.easeOut
        })
    }
    afterHide()
    {
        this.shopList.hide();
    }
    hide(dispatch = true, callback = null)
    {
        TweenLite.to(this.container.scale, 0.25,
        {
            x: 0,
            y: 1.5,
            ease: Back.easeIn,
            onComplete: () =>
            {
                if (dispatch)
                {
                    this.onHide.dispatch(this);
                }
                if (callback)
                {
                    callback();
                }
                this.afterHide();
                this.toRemove = true
            }
        })
    }
    updateMoney(money, force, delay = 0)
    {
        if (force)
        {
            this.moneyLabel.text = utils.formatPointsLabel(money / MAX_NUMBER);
            this.coinsContainer.x = -config.width / 2 + this.margin;
            this.currentMoney = money;
            return;
        }
        if (this.currentTween)
        {
            TweenLite.killTweensOf(this.currentTween);
        }
        let moneyObj = {
            current: this.currentMoney,
            target: money
        }
        this.currentMoney = money;
        this.currentTween = TweenLite.to(moneyObj, 0.5,
        {
            delay: delay,
            current: money,
            onUpdateParams: [moneyObj],
            onUpdate: (moneyObj) =>
            {
                this.moneyLabel.text = utils.formatPointsLabel(moneyObj.current / MAX_NUMBER);
                this.coinsContainer.x =-config.width / 2 + this.margin;
            },
            onComplete: () =>
            {

                this.coinsContainer.x =-config.width / 2 + this.margin;
            }
        })
    }
    updateTrophy(money, force, delay = 0)
    {
        if (force)
        {
            this.trophyLabel.text = utils.formatPointsLabel(money / MAX_NUMBER);
            this.trophyContainer.x =  config.width / 2 - this.margin - this.trophyContainer.width;
            this.currentTrophy = money;
            return;
        }
        if (this.currentTween)
        {
            TweenLite.killTweensOf(this.currentTween);
        }
        let moneyObj = {
            current: this.currentTrophy,
            target: money
        }
        this.currentTrophy = money;
        this.currentTween = TweenLite.to(moneyObj, 0.5,
        {
            delay: delay,
            current: money,
            onUpdateParams: [moneyObj],
            onUpdate: (moneyObj) =>
            {
                this.trophyLabel.text = utils.formatPointsLabel(moneyObj.current / MAX_NUMBER);
                this.trophyContainer.x = config.width / 2 - this.margin - this.trophyContainer.width;
            },
            onComplete: () =>
            {

                this.trophyContainer.x = config.width / 2 - this.margin - this.trophyContainer.width;
            }
        })
    }
    confirm()
    {
        this.onConfirm.dispatch(this);
        this.hide();
    }
    close()
    {
        this.onClose.dispatch(this);
        this.hide();
    }
}