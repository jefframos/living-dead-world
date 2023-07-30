import * as PIXI from 'pixi.js';

import Game from '../../../../Game';
import GameData from '../../../data/GameData';
import GameStaticData from '../../../data/GameStaticData';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import RewardsManager from '../../../data/RewardsManager';
import ShopCard from './ShopCard';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import ViewDatabase from '../../../data/ViewDatabase';

export default class ShopContainer extends MainScreenModal {
    constructor() {
        super();

        this.shopList = GameStaticData.instance.getAllDataFrom('database', 'economy')[0].items
        this.topBlocker = new PIXI.Sprite.from('base-gradient');
        //this.topBlocker = new PIXI.Sprite.from('square_button_0001');
        this.topBlocker.tint = 0x13202F;
        // this.topBlocker.scale.y = -1
        this.addChildAt(this.topBlocker, 0);

        this.chest1 = new ShopCard(this.chest1Click.bind(this), this.chest1VideoClick.bind(this), UIUtils.baseButtonTexture + '_0001', 250, 250, this.shopList[0].title, this.shopList[0].video)
        this.chest1.updateButtonTitle(this.shopList[0].totalItems + 'x\n' + this.shopList[0].description)
        this.chest1.setIcon('item-chest-0001')
        this.chest1.setValue(this.getCurrency(this.shopList[0].currency), 'x' + this.shopList[0].price)

        this.chest2 = new ShopCard(this.chest2Click.bind(this), this.chest2VideoClick.bind(this), UIUtils.baseButtonTexture + '_0003', 250, 250, this.shopList[1].title, this.shopList[1].video)
        this.chest2.updateButtonTitle(this.shopList[1].totalItems + 'x\n' + this.shopList[1].description)
        this.chest2.setIcon('item-chest-0002')
        this.chest2.setValue(this.getCurrency(this.shopList[1].currency), 'x' + this.shopList[1].price)

        // this.chest3 = new ShopCard(UIUtils.baseButtonTexture + '_0001', 250, 250)
        this.topLine = new UIList();
        this.container.addChild(this.topLine)

        this.topLine.addElement(this.chest1);
        this.topLine.addElement(this.chest2);
        // this.topLine.addElement(this.chest3);

        this.topButtons = [];
        this.topButtons.push(this.chest1);
        this.topButtons.push(this.chest2);
        // this.topButtons.push(this.chest3);


        this.chestMid1 = new ShopCard(this.chestMid1Click.bind(this), this.chestMid1VideoClick.bind(this), UIUtils.baseButtonTexture + '_0002', 250, 250, this.shopList[2].title, this.shopList[2].video)
        this.chestMid1.updateButtonTitle(this.shopList[2].totalItems + 'x\n' + this.shopList[2].description)
        this.chestMid1.setIcon('item-chest-0001')
        this.chestMid1.setValue(this.getCurrency(this.shopList[2].currency), 'x' + this.shopList[2].price)
        this.chestMid2 = new ShopCard(this.chestMid2Click.bind(this), this.chestMid2VideoClick.bind(this), UIUtils.baseButtonTexture + '_0003', 250, 250, this.shopList[3].title, this.shopList[3].video)
        this.chestMid2.updateButtonTitle(this.shopList[3].totalItems + 'x\n' + this.shopList[3].description)
        this.chestMid2.setIcon('item-chest-0002')
        this.chestMid2.setValue(this.getCurrency(this.shopList[3].currency), 'x' + this.shopList[3].price)
        this.midLine = new UIList();
        this.container.addChild(this.midLine)

        this.midLine.addElement(this.chestMid1);
        this.midLine.addElement(this.chestMid2);

        this.midButtons = [];
        this.midButtons.push(this.chestMid1);
        this.midButtons.push(this.chestMid2);



        this.chestBottom1 = new ShopCard(this.bundleClick.bind(this), this.bundleVideoClick.bind(this), UIUtils.baseButtonTexture + '_0004', 250, 250, this.shopList[4].title, this.shopList[4].video)
        this.chestBottom1.setIcon('bundle-icon', 0.5)
        this.chestBottom1.updateButtonTitle(this.shopList[4].totalItems + 'x\n' + this.shopList[4].description)
        this.chestBottom1.setValue(this.getCurrency(this.shopList[4].currency), 'x' + this.shopList[4].price)

        this.bottomLine = new UIList();
        this.container.addChild(this.bottomLine)

        this.bottomLine.addElement(this.chestBottom1);

        this.bottomButtons = [];
        this.bottomButtons.push(this.chestBottom1);

        this.titleBox = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0006'), 20, 20, 20, 20);
        this.container.addChild(this.titleBox);
        this.titleBox.width = 250
        this.titleBox.height = 80

        this.titleBox.y = -60

        this.titleLabel = UIUtils.getSecondaryLabel('Shop', { fontSize: 48 })
        this.titleLabel.anchor.set(0.5)
        this.titleLabel.x = this.titleBox.width / 2
        this.titleLabel.y = this.titleBox.height / 2
        this.titleBox.addChild(this.titleLabel)

    }
    getCurrency(value) {
        if (value == 1) {
            return 'softCurrency'
        } else if (value == 2) {
            return 'hardCurrency'
        } else if (value == 3) {
            return 'specialCurrency'
        }
    }
    canBuy(data) {
        if (data.currency == 1) {
            if (GameData.instance.softCurrency >= data.price) {
                return true;
            }
        } else if (data.currency == 2) {
            if (GameData.instance.hardCurrency >= data.price) {
                return true;
            }
        } else if (data.currency == 3) {
            if (GameData.instance.specialCurrency >= data.price) {
                return true;
            }
        }
    }
    buy(data) {
        if (data.currency == 1) {
            GameData.instance.addSoftCurrency(-data.price)
        } else if (data.currency == 2) {
            GameData.instance.addHardCurrency(-data.price)
        } else if (data.currency == 3) {
            GameData.instance.addSpecialCurrency(-data.price)
        }
    }
    chest1Click(force) {
        const shopData = this.shopList[0];
        console.log(shopData)
        if (this.canBuy(shopData) || force) {
            PrizeManager.instance.getMetaPrize([0, 2, 3, 6], 1, shopData.totalItems);
            if (force) {
                return;
            }
            this.buy(shopData)
        } else {
            this.notEnoughMoney(shopData)
        }
    }
    chest1VideoClick() {
        RewardsManager.instance.doReward(() => {
            this.chest1Click(true);
        })
    }
    chest2Click(force) {
        const shopData = this.shopList[1];
        if (this.canBuy(shopData) || force) {
            PrizeManager.instance.getMetaPrize([0], 2, shopData.totalItems);
            if (force) {
                return;
            }
            this.buy(shopData)
        } else {
            this.notEnoughMoney(shopData)
        }
    }
    chest2VideoClick() {
        RewardsManager.instance.doReward(() => {
            this.chest2Click(true);
        })
    }
    chestMid1Click(force) {
        const shopData = this.shopList[2];
        if (this.canBuy(shopData) || force) {
            PrizeManager.instance.getMetaPrize([6], 1, shopData.totalItems);
            if (force) {
                return;
            }
            this.buy(shopData)
        } else {
            this.notEnoughMoney(shopData)
        }
    }
    chestMid1VideoClick() {

        RewardsManager.instance.doReward(() => {
            this.chestMid1Click(true);
        })
    }
    chestMid2Click(force) {
        const shopData = this.shopList[3];
        if (this.canBuy(shopData) || force) {
            PrizeManager.instance.getMetaPrize([2, 3], 2, shopData.totalItems);
            if (force) {
                return;
            }
            this.buy(shopData)
        } else {
            this.notEnoughMoney(shopData)
        }
    }
    chestMid2VideoClick() {
        RewardsManager.instance.doReward(() => {
            this.chestMid2Click(true);
        })
    }
    bundleClick(force) {
        const shopData = this.shopList[4];
        if (this.canBuy(shopData) || force) {
            PrizeManager.instance.getMetaPrize([0, 1, 2, 3, 6], 3, shopData.totalItems);
            if (force) {
                return;
            }
            this.buy(shopData)
        } else {
            this.notEnoughMoney(shopData)
        }
    }
    bundleVideoClick() {
        RewardsManager.instance.doReward(() => {
            this.bundleClick(true);
        })
    }
    notEnoughMoney(data) {
        data.texture = this.getCurrency(data.currency);
        GameData.instance.showCantBuy(data)
    }
    addBackgroundShape() {
        this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0002'), 20, 20, 20, 20);
        this.container.addChild(this.infoBackContainer);
    }
    show() {
        this.resize()
        super.show();

        if (!ViewDatabase.instance.canGetPiece()) {
            this.chestMid1.disableWithMessage('You Collected All Cosmestics')
        } else {
            this.chestMid1.enable()
        }
    }
    resize(res, newRes) {

        if (Game.IsPortrait) {
            this.infoBackContainer.width = Game.Borders.width - 80
            this.infoBackContainer.height = Game.Borders.height - 300
        } else {
            if (Game.Borders.width / Game.Borders.height < 1.5) {

                this.infoBackContainer.width = Game.Borders.width * 0.75
                this.infoBackContainer.height = Game.Borders.height - 200
            } else {

                this.infoBackContainer.width = Game.Borders.width * 0.5
                this.infoBackContainer.height = Game.Borders.height - 160
            }
        }


        this.resizeLine(this.topLine, this.topButtons)
        this.resizeLine(this.midLine, this.midButtons)
        this.resizeLine(this.bottomLine, this.bottomButtons)

        this.topLine.x = 10
        this.topLine.y = 40

        this.midLine.x = this.topLine.x
        this.midLine.y = this.topLine.y + this.topLine.h + 10

        this.bottomLine.x = this.midLine.x
        this.bottomLine.y = this.midLine.y + this.midLine.h + 10


        this.titleBox.x = this.infoBackContainer.width / 2 - this.titleBox.width / 2

        this.topBlocker.width = Game.Borders.width
        this.topBlocker.height = Game.Borders.height

        this.recenterContainer()
    }
    recenterContainer() {
        this.container.pivot.x = this.container.width / 2
        this.container.x = Game.Borders.width / 2

        this.container.pivot.y = this.container.height / 2
        this.container.y = Game.Borders.height / 2 + 90

    }
    resizeLine(list, buttons) {
        list.w = this.infoBackContainer.width - 20
        list.h = (this.infoBackContainer.height - 80) / 3
        list.updateHorizontalList()

        buttons.forEach(element => {
            element.resize(list.w / buttons.length - 20, list.h)
        });
    }
    aspectChange(isPortrait) {
        if (isPortrait) {
        } else {

        }
    }
}