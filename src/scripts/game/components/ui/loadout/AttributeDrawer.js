import * as PIXI from 'pixi.js';

import EntityBuilder from '../../../screen/EntityBuilder';
import Game from '../../../../Game';
import LoadoutCardView from '../../deckBuilding/LoadoutCardView';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';

export default class AttributeDrawer extends PIXI.Container {
    constructor(icon = UIUtils.getIconByAttribute('baseHealth')) {
        super();

       
        this.uiList = new UIList();
        this.addChild(this.uiList)

        this.uiList.w = 80
        this.uiList.h = 50



        this.label = UIUtils.getPrimaryLabel('100', { fontSize: 24 });
        this.icon = new PIXI.Sprite.from(icon)

        this.uiList.addElement(this.icon, { fitHeight: 0.8, align:0.8 });
        this.uiList.addElement(this.label, {align: 0.2});

        this.uiList.updateHorizontalList()

    }
    updateAttributes(defaultAttribute, attribute) {

        if (defaultAttribute.health < attribute.health) {
            this.label.style.fill = 0xAFFE0F
        } else {
            this.label.style.fill = 0xFFFFFF
        }
        this.label.text = attribute       
        this.uiList.updateHorizontalList()
    }
    rebuild(w,h){
        this.uiList.w = w
        this.uiList.h = h
        this.uiList.updateHorizontalList()
    }
}