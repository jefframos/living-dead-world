import * as PIXI from 'pixi.js';

import EntityShop from './EntityShop';
import ShopItem from './ShopItem';
import Signals from 'signals';
import TweenMax from 'gsap';

export default class MergeItemsShop extends EntityShop {
    constructor(mainSystem, systemID, border = 0) {
        super(mainSystem, systemID, 6, {
            w: config.width * 0.9,
            h: config.height * 0.9
        })


        this.onAddEntity = new Signals();
        this.systemID = 'monsters';


        this.title.addIcon('shopl')
        this.giftItem = new ShopItem({ w: this.itemWidth, h: this.size.h * 0.8 / 6 })
        this.giftItem.backShapeGeneral.texture = PIXI.Texture.from(config.assets.panel.extra)
        //this.giftItem.itemIcon.texture = PIXI.Texture.from('Btn04')
        this.container.addChild(this.giftItem)
        this.giftItem.x = this.size.w * 0.1
        this.giftItem.y = 80
        this.giftItem.updateHorizontalList();
        this.giftItem.shopButton.updateCoast(window.localizationManager.getLabel('freeGift'))
        this.giftItem.unblock()
        this.giftItem.shopButton.enable();
        this.giftItem.shopButton.onClickItem.removeAll()
        this.giftItem.shopButton.onClickItem.add(
            () => {
                this.onClaimGift.dispatch()
                this.hide()
            });

        this.standardGiftTime = 5 * 60;

        this.shopList.addBaseGradient('base-gradient',this.itemWidth, 0x575B64)
    }
    setGiftIcon(icon) {
        this.giftItem.itemIcon.texture = PIXI.Texture.from(icon)
        this.giftItem.updateHorizontalList();
    }
    update(delta) {
        let latest = COOKIE_MANAGER.getLatestGiftClaim(this.systemID);

        if (latest > 0) {
            let diff = Date.now() - latest;

            let diffTime = this.standardGiftTime - diff / 1000
            this.giftItem.shopButton.updateCoast(utils.convertNumToTime(Math.ceil(diffTime)))
            this.giftItem.block(true)
            if (diffTime <= 0) {
                COOKIE_MANAGER.claimGift(this.systemID, -1);
            }

        } else if (!this.giftItem.isBlocked) {
            this.giftItem.shopButton.updateCoast(window.localizationManager.getLabel('freeGift'))
            this.giftItem.shopButton.enable();
        }
        //console.log(latest);
    }
    confirmItemShop(item) {
        this.mainSystem.forEach(resourceSystem => {
            resourceSystem.findUpgrade(item)
        });

        COOKIE_MANAGER.addMergePieceUpgrade(item, this.systemID);

        this.onAddEntity.dispatch(item);

    }
    updateLocks(total) {
        for (let index = this.currentItens.length - 1; index >= 0; index--) {
            const element = this.currentItens[index];

            if (total <= 0) {
                element.block();
                this.giftItem.block()
            } else {
                element.unblock();
                this.giftItem.unblock()
            }

        }
    }
    show(id) {
        this.visible = true;
       
        let currentResources = COOKIE_MANAGER.getBoard(this.systemID);
        let currentEntities = []
        for (const key in currentResources.entities) {
            const element = currentResources.entities[key];
            if (element && element.nameID) {
                currentEntities.push(element.nameID);
            }
        }

        let found = false;
        this.savedProgression = COOKIE_MANAGER.getBoard(this.systemID);
        this.boardProgression = this.savedProgression.boardLevel;

        for (let index = this.currentItens.length - 1; index >= 0; index--) {
            const element = this.currentItens[index];

            if (index < this.boardProgression.currentLevel) {
                element.unlockItem();
                found = true;
            } else {
                element.lockItem();
            }

        }
        this.currentItens[0].unlockItem();
        this.posShow();


    }
}