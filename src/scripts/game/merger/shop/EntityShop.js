import * as PIXI from 'pixi.js';

import ShopItem from './ShopItem';
import ShopList from './ShopList';
import Signals from 'signals';
import TweenMax from 'gsap';
import UIButton1 from '../../ui/UIButton1';
import TextBox from '../../ui/TextBox';
import UpgradesToggles from './UpgradesToggles';
import config from '../../../config';
import utils from '../../../utils';

export default class EntityShop extends PIXI.Container {
    constructor(mainSystem, systemID, itemsPerPage = 5, size) {
        super()
        this.mainSystem = mainSystem;
        this.size = size?size:{
            w: config.width * 0.9,
            h: config.height * 0.8
        }

        this.currentItens = [];
        this.background = new PIXI.Graphics().beginFill(0).drawRect(-config.width * 5, -config.height * 5, config.width * 10, config.height * 10)
        this.addChild(this.background)
        this.background.alpha = 0.5;

        this.background.interactive = true;
        this.background.buttonMode = true;
        this.background.on('mousedown', this.confirm.bind(this)).on('touchstart', this.confirm.bind(this));

        this.container = new PIXI.Container();
        this.addChild(this.container)
        this.container.pivot.x = this.size.w / 2
        this.container.pivot.y = this.size.h / 2
        this.backContainer = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.from(config.assets.popup.darkGrey), 50, 100, 50, 50)
        this.backContainer.width = this.size.w
        this.backContainer.height = this.size.h
        this.container.addChild(this.backContainer);
        config.addPaddingPopup(this.backContainer)
        // this.tiledBackground2 = new PIXI.TilingSprite(PIXI.Texture.from('patter-square', 64, 64))
        // this.container.addChild(this.tiledBackground2);
        // this.tiledBackground2.width = this.size.w
        // this.tiledBackground2.height = this.size.h
        // // this.tiledBackground2.anchor.set(0.5)
        // this.tiledBackground2.tileScale.set(0.2)
        // this.tiledBackground2.alpha = 0.1

        this.title = new TextBox(20,config.assets.panel.secondary, 32)//new PIXI.Text(window.localizationManager.getLabel('resources'), LABELS.LABEL1);
        this.title.updateText(window.localizationManager.getLabel('entities'))
        // this.portrait = new PIXI.Sprite.from('skull');
        // this.container.addChild(this.portrait);
        // this.portrait.scale.set(0.65)
        // this.portrait.anchor.set(0, 1)
        // this.portrait.x = 20
        // this.portrait.y = 104

        this.itemWidth = this.size.w - this.size.w * 0.2;
        this.itemHeight = this.size.h * 0.8 / (itemsPerPage+1);

        this.container.addChild(this.title);

        this.shopList = new ShopList({ w: this.size.w, h: this.itemHeight  * itemsPerPage + itemsPerPage*5}, itemsPerPage)
        this.shopList.y = 110
        this.container.addChild(this.shopList);


        this.shopList.onItemShop.add(this.confirmItemShop.bind(this))
        this.shopList.onShowBlock.add(this.showBlock.bind(this))

        this.openShop = new UIButton1(0xFFffff, window.TILE_ASSSETS_POOL['image-X'], 0xFFffff, 70, 70, config.assets.button.warningSquare)
        this.openShop.updateIconScale(0.5)
        this.container.addChild(this.openShop)
        this.openShop.x = this.size.w 
        this.openShop.y = 0
        this.openShop.onClick.add(() => {
            this.hideFromClick()
        })
        // this.toggles = new UpgradesToggles({ w: this.size.w * 0.7, h: 60 })
        // //this.container.addChild(this.toggles);
        // this.toggles.x = this.size.w / 2 - this.size.w * 0.35 - 30
        // this.toggles.y = this.size.h - this.toggles.height - 30
        // this.toggles.onUpdateValue.add(this.updateToggleValue.bind(this))

        window.gameEconomy.onMoneySpent.add(this.moneySpent.bind(this))

        this.onPurchase = new Signals();
        this.onPossiblePurchase = new Signals();
        this.onClaimGift = new Signals();


        this.isPossibleBuy = false;
        this.updateCurrentResources();
        setTimeout(() => {

            this.updateCurrentResources();
            this.updateToggleValue();
        }, 500);

        window.onEscPressed.add(() => {
            if (!this.visible) {
                return;
            }
            this.hideFromClick();
        })

        this.systemID = systemID;


       
    }
    update(delta) {}
    showBlock() {

    }
    confirm() {
        this.hide();
    }
    hideCallback() {
        this.hide();
    }
    hideFromClick() {
        window.DO_COMMERCIAL(() => {
            this.visible = false;
            this.currentItens.forEach(element => {
                element.hide();
            });
        })
    }
    hide() {
        this.visible = false;
        this.currentItens.forEach(element => {
            element.hide();
        });
    }
    updateCurrentResources() {

        // this.currentResourcesLabel.text = utils.formatPointsLabel(window.gameEconomy.currentResources)
        // // this.currentResourcesLabel.pivot.x = this.currentResourcesLabel.width / 2
    }
    moneySpent() {
        this.updateToggleValue();
        this.updateCurrentResources();

    }
    updateToggleValue() {
        this.isPossibleBuy = false;
        this.currentItens.forEach(element => {
            if(element.updatePreviewValue){

                element.updatePreviewValue(1)
            }

            //console.log(element.itemData.type, element.isLocked)
            if (!this.isPossibleBuy && !element.isLocked) {
                this.isPossibleBuy = element.canBuyOne();
            }
        });

        //console.log(this.isPossibleBuy)
        this.onPossiblePurchase.dispatch(this.isPossibleBuy);
    }
    posShow() {
        this.title.x = this.size.w / 2

        this.currentItens.forEach(element => {
            if(element.updatePreviewValue){

                element.updatePreviewValue(1)
            }
            
        });

        this.shopList.resetPosition()
        SOUND_MANAGER.play('shoosh', 0.1)

    }
    show() {
        this.visible = true;

        let currentResources = COOKIE_MANAGER.getResources(this.systemID);


        let currentEntities = []
        for (const key in currentResources.entities) {
            const element = currentResources.entities[key];
            if (element.currentLevel) {
                currentEntities.push(key);
            }
        }
        this.currentItens.forEach(element => {
            if (currentEntities.indexOf(element.nameID) > -1) {
                element.unlockItem();
            } else {
                element.lockItem();
            }
            //element.unlockItem();
            element.show();
            element.updatePreviewValue(1)
        });

        this.posShow();

    }
    confirmItemShop(item, button, totalUpgrades, id) {

        //console.log(totalUpgrades)

        this.onPurchase.dispatch(item, button, totalUpgrades);
        this.mainSystem.forEach(resourceSystem => {
            resourceSystem.findUpgrade(item)
        });

        COOKIE_MANAGER.addResourceUpgrade(item, id);

    }
    addItems(items, skipCheck = false) {

        this.currentItens = []
        for (let index = 0; index < items.length; index++) {
            let shopItem = new ShopItem({ w: this.itemWidth, h: this.size.h * 0.8 / 6 })
            shopItem.setData(items[index])
            shopItem.nameID = items[index].rawData.nameID;
            //console.log((index+1)+ ' - ' +items[index].rawData.initialCost)
            this.currentItens.push(shopItem)
        }

        this.shopList.addItens(this.currentItens)
        this.shopList.x = this.size.w * 0.1
        this.shopList.y = 80 + this.size.h * 0.8 / 6 + 5

        if (skipCheck) {
            return;
        }
        // let currentResources = COOKIE_MANAGER.getResources(this.systemID);
        let currentShips = COOKIE_MANAGER.getBoard(this.systemID);
        // console.log(currentResources)
        let currentEntities = []
        // for (const key in currentResources.entities) {
        //     const element = currentResources.entities[key];
        //     if (element.currentLevel) {
        //         currentEntities.push(key);
        //     }
        // }

        for (const key in currentShips.entities) {
            const element = currentShips.entities[key];
            if (element && element.nameID) {
                currentEntities.push(element.nameID);
            }
        }

        this.currentItens.forEach(element => {
            if (currentEntities.indexOf(element.nameID) > -1) {
                element.unlockItem();

            } else {
                element.lockItem();
            }
        });

    }
}