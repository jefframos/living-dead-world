import * as PIXI from 'pixi.js';

import Game from '../../../../Game';
import MainScreenModal from '../MainScreenModal';
import ShopCard from './ShopCard';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';

export default class ShopContainer extends MainScreenModal {
    constructor() {
        super();

        this.chest1 = new ShopCard(UIUtils.baseButtonTexture + '_0001', 250, 250)
        this.chest2 = new ShopCard(UIUtils.baseButtonTexture + '_0001', 250, 250)
        this.chest3 = new ShopCard(UIUtils.baseButtonTexture + '_0001', 250, 250)
        this.topLine = new UIList();
        this.container.addChild(this.topLine)

        this.topLine.addElement(this.chest1);
        this.topLine.addElement(this.chest2);
        this.topLine.addElement(this.chest3);

        this.topButtons = [];
        this.topButtons.push(this.chest1);
        this.topButtons.push(this.chest2);
        this.topButtons.push(this.chest3);

   
        this.chestMid1 = new ShopCard(UIUtils.baseButtonTexture + '_0003', 250, 250)
        this.chestMid2 = new ShopCard(UIUtils.baseButtonTexture + '_0003', 250, 250)
        this.midLine = new UIList();
        this.container.addChild(this.midLine)

        this.midLine.addElement(this.chestMid1);
        this.midLine.addElement(this.chestMid2);

        this.midButtons = [];
        this.midButtons.push(this.chestMid1);
        this.midButtons.push(this.chestMid2);



        this.chestBottom1 = new ShopCard(UIUtils.baseButtonTexture + '_0005', 250, 250)
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
    addBackgroundShape() {
        this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0002'), 20, 20, 20, 20);
        this.container.addChild(this.infoBackContainer);
    }
    show() {
        super.show();
    }
    resize(res, newRes) {
        
        if(Game.IsPortrait){
            this.infoBackContainer.width = Game.Borders.width - 80
            this.infoBackContainer.height = Game.Borders.height - 300
        }else{
            this.infoBackContainer.width = Game.Borders.width/2 - 80
            this.infoBackContainer.height = Game.Borders.height -200
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
        
        this.container.y = Game.Borders.height / 2 + 160
    }
    recenterContainer() {
        this.container.pivot.x = this.container.width / 2
        this.container.x = Game.Borders.width/ 2
        
        this.container.pivot.y = this.container.height / 2
        this.container.y = Game.Borders.height / 2 + 80

    }
    resizeLine(list, buttons){
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