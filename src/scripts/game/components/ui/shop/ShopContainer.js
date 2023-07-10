import * as PIXI from 'pixi.js';

import Game from '../../../../Game';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import ShopCard from './ShopCard';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import ViewDatabase from '../../../data/ViewDatabase';

export default class ShopContainer extends MainScreenModal {
    constructor() {
        super();

        this.chest1 = new ShopCard(this.chest1Click.bind(this), this.chest1VideoClick.bind(this), UIUtils.baseButtonTexture + '_0001', 250, 250, 'Small Crate')
        this.chest1.updateButtonTitle('2x\nItems')
        this.chest1.setIcon('item-chest-0001')
        this.chest1.setValue('softCurrency', 'x500')

        this.chest2 = new ShopCard(this.chest2Click.bind(this), this.chest2VideoClick.bind(this), UIUtils.baseButtonTexture + '_0003', 250, 250, 'Weapon Crate', false)
        this.chest2.updateButtonTitle('5x\nWeapons')
        this.chest2.setIcon('item-chest-0002')
        this.chest2.setValue('softCurrency', 'x2000')

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


        this.chestMid1 = new ShopCard(this.chestMid1Click.bind(this), this.chestMid1VideoClick.bind(this), UIUtils.baseButtonTexture + '_0002', 250, 250, 'Cosmetics Crate')
        this.chestMid1.updateButtonTitle('2x\nCosmetics')
        this.chestMid1.setIcon('item-chest-0001')
        this.chestMid1.setValue('hardCurrency', 'x5')
        this.chestMid2 = new ShopCard(this.chestMid2Click.bind(this), this.chestMid2VideoClick.bind(this), UIUtils.baseButtonTexture + '_0003', 250, 250, 'Acessory Crate', false)
        this.chestMid2.updateButtonTitle('5x\nAcessories')
        this.chestMid2.setIcon('item-chest-0002')
        this.chestMid2.setValue('hardCurrency', 'x5')
        this.midLine = new UIList();
        this.container.addChild(this.midLine)

        this.midLine.addElement(this.chestMid1);
        this.midLine.addElement(this.chestMid2);

        this.midButtons = [];
        this.midButtons.push(this.chestMid1);
        this.midButtons.push(this.chestMid2);



        this.chestBottom1 = new ShopCard(this.bundleClick.bind(this), this.bundleVideoClick.bind(this), UIUtils.baseButtonTexture + '_0004', 250, 250, 'Bundle Crate', false)
        this.chestBottom1.setIcon('bundle-icon', 0.5)
        this.chestBottom1.updateButtonTitle('10x\nAll Items')
        this.chestBottom1.setValue('specialCurrency', 'x5', 2)

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
    chest1Click() {
        PrizeManager.instance.getMetaPrize([0, 2, 3, 6], 1, 2);
    }
    chest1VideoClick() {
        this.chest1Click();
    }
    chest2Click() {
        PrizeManager.instance.getMetaPrize([0], 1, 5);
    }
    chest2VideoClick() {
        this.chest1Click();
    }
    chestMid1Click() {
        PrizeManager.instance.getMetaPrize([6], 1, 2);
    }
    chestMid1VideoClick() {
        this.chest1Click();
    }
    chestMid2Click() {
        PrizeManager.instance.getMetaPrize([2, 3], 1, 5);
    }
    chestMid2VideoClick() {
        this.chest1Click();
    }
    bundleClick() {
        PrizeManager.instance.getMetaPrize([0, 1, 2, 3, 6], 3, 10);
    }
    bundleVideoClick() {
        this.chest1Click();
    }
    addBackgroundShape() {
        this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0002'), 20, 20, 20, 20);
        this.container.addChild(this.infoBackContainer);
    }
    show() {
        this.resize()
        super.show();

        if(!ViewDatabase.instance.canGetPiece()){
            this.chestMid1.disableWithMessage('You Collected All Cosmestics')
        }else{
            this.chestMid1.enable()
        }
    }
    resize(res, newRes) {

        if (Game.IsPortrait) {
            this.infoBackContainer.width = Game.Borders.width - 80
            this.infoBackContainer.height = Game.Borders.height - 300
        } else {
            if(Game.Borders.width / Game.Borders.height < 1.5){
                
                this.infoBackContainer.width = Game.Borders.width * 0.75
                this.infoBackContainer.height = Game.Borders.height - 200
            }else{
                
                this.infoBackContainer.width = Game.Borders.width *0.5
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
        console.log('aspectChange', isPortrait);
        if (isPortrait) {
        } else {

        }
    }
}