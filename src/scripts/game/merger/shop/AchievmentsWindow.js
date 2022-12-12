import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import EntityShop from './EntityShop';
import Signals from 'signals';
import AchievmentView from './AchievmentView';
import ShopItem from './ShopItem';
import config from '../../../config';

export default class AchievmentsWindow extends EntityShop {
    constructor(mainSystem, systemID, systemOrder) {
        super(mainSystem, systemID, 7, {
            w: config.width * 0.9,
            h: config.height * 0.9
        })
        this.systemOrder = systemOrder;
        this.onAddEntity = new Signals();
        this.onAchievmentPending = new Signals();
        this.onNoAchievmentPending = new Signals();
        this.onClaimGift = new Signals();
        this.onClaimAchievment = new Signals();
        this.systemID = 'monsters';

        this.backContainer.texture = PIXI.Texture.from(config.assets.popup.extra)
        //this.shopList.addBaseGradient('base-gradient', this.itemWidth, 0xFEF72B)

        this.title.updateText(window.localizationManager.getLabel('achievements'))

        this.giftItem = new ShopItem({ w: this.itemWidth, h: this.size.h * 0.8 / 6 })
        this.giftItem.backShapeGeneral.texture = PIXI.Texture.from(config.assets.panel.tertiary)
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
                //this.hide()
                this.onClaimGift.dispatch()
                this.checkAll();
            });

        this.standardGiftTime = 5 * 60;

        COOKIE_MANAGER.onUpdateAchievments.add((type) => {
            this.checkItem(type)
        })

        this.title.addIcon('achievmentl')

    }
    checkAll() {
        for (const key in this.currentItensByType) {
            if (Object.hasOwnProperty.call(this.currentItensByType, key)) {
                const element = this.currentItensByType[key];
                let res = element.updateCurrentData()
                if (res == 1) {
                    this.onAchievmentPending.dispatch(this.systemID, false);
                    return
                }
                if (res == 2) {
                    this.onAchievmentPending.dispatch(this.systemID, false);
                    return
                }
            }
        }
        this.onNoAchievmentPending.dispatch(this.systemID);
    }
    checkItem(type) {
        if (!this.currentItensByType) return;

        let res = this.currentItensByType[type].updateCurrentData()
        if (res) {
            if (res == 1) {
                this.onAchievmentPending.dispatch(this.systemID, true);
                return
            }
            if (res == 2) {
                this.onAchievmentPending.dispatch(this.systemID, false);
                return
            }
        }
    }
    update(delta) {
        let latest = COOKIE_MANAGER.getLatestGiftClaimFreeMoney(this.systemID);

        if (latest > 0) {
            let diff = Date.now() - latest;

            let diffTime = this.standardGiftTime - diff / 1000
            this.giftItem.shopButton.updateCoast(utils.convertNumToTime(Math.ceil(diffTime)))
            this.giftItem.block(true)
            if (diffTime <= 0) {
                COOKIE_MANAGER.claimFreeMoney(this.systemID, -1);
            }
        } else {
            this.giftItem.shopButton.updateCoast(window.localizationManager.getLabel('freeCoins'))
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
        this.onClaimAchievment.dispatch(item);

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
                //this.giftItem.shopButton.enable();
            }

        }
    }
    show(id) {
        this.visible = true;
        this.shopList.show()
        this.posShow();
    }
    updateToggleValue() { }
    setGiftTexture(tex) {
        this.giftItem.itemIcon.texture = PIXI.Texture.from(tex)
        this.giftItem.updateHorizontalList();
    }
    addItems(items, skipCheck = false) {

        this.currentItens = []
        this.currentItensByType = {}
        for (let index = 0; index < items.length; index++) {
            let shopItem = new AchievmentView(this.size.w - this.size.w * 0.2, this.size.h * 0.8 / 8, 28)

            this.currentItensByType[items[index].variable] = shopItem;

            shopItem.setData(items[index], this.systemID,this.systemOrder)
            //shopItem.nameID = items[index].rawData.nameID;

            shopItem.onClaim.add((value)=>{
                this.onClaimAchievment.dispatch(value)
                setTimeout(() => {                    
                    this.checkAll()
                }, 1);
                setTimeout(() => {                    
                    this.checkAll()
                }, 100);
            })
            this.currentItens.push(shopItem)
        }

        this.shopList.addItens(this.currentItens)
        this.shopList.x = this.size.w * 0.1
        this.shopList.y = 80 + this.size.h * 0.8 / 6 + 5

        if (skipCheck) {
            return;
        }

        let currentShips = COOKIE_MANAGER.getBoard(this.systemID);

        let currentEntities = []

        for (const key in currentShips.entities) {
            const element = currentShips.entities[key];
            if (element && element.nameID) {
                currentEntities.push(element.nameID);
            }
        }


    }
}