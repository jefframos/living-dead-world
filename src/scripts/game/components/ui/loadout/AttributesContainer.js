import * as PIXI from 'pixi.js';

import EntityBuilder from '../../../screen/EntityBuilder';
import Game from '../../../../Game';
import LoadoutCardView from '../../deckBuilding/LoadoutCardView';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../core/utils/UIUtils';
import Utils from '../../../core/utils/Utils';

export default class AttributesContainer extends PIXI.Container {
    constructor() {
        super();

        this.modalTexture = 'modal_container0006'

        this.containerBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(this.modalTexture), 20, 20, 20, 20);
        this.containerBackground.width = 550
        this.containerBackground.height = 80
        this.containerBackground.alpha = 1

        this.addChild(this.containerBackground)
        
        this.uiList = new UIList();
        this.addChild(this.uiList)

        this.uiList.w = this.containerBackground.width - 20
        this.uiList.h = this.containerBackground.height - 20

        this.uiList.x = 10;
        this.uiList.y = 10;


        this.healthLabel = UIUtils.getPrimaryLabel('100', {fontSize:26});
        this.speedLabel = UIUtils.getPrimaryLabel('100', {fontSize:26});
        this.frequencyLabel = UIUtils.getPrimaryLabel('100', {fontSize:26});
        this.powerLabel = UIUtils.getPrimaryLabel('100', {fontSize:26});
        this.defenseLabel = UIUtils.getPrimaryLabel('100', {fontSize:26});

        this.uiList.addElement(new PIXI.Sprite.from('heart'), {fitHeight:0.5});
        this.uiList.addElement(this.healthLabel);

        this.uiList.addElement(new PIXI.Sprite.from('heart'), {fitHeight:0.5});
        this.uiList.addElement(this.speedLabel);

        this.uiList.addElement(new PIXI.Sprite.from('heart'), {fitHeight:0.5});
        this.uiList.addElement(this.frequencyLabel);

        this.uiList.addElement(new PIXI.Sprite.from('heart'), {fitHeight:0.5});
        this.uiList.addElement(this.powerLabel);

        this.uiList.addElement(new PIXI.Sprite.from('heart'), {fitHeight:0.5});
        this.uiList.addElement(this.defenseLabel);

        this.uiList.updateHorizontalList()
        
    }
    updateAttributes(attributes){
        this.healthLabel.text = attributes.health
        this.speedLabel.text = attributes.speed
        this.frequencyLabel.text = attributes.frequency
        this.powerLabel.text = attributes.power
        this.defenseLabel.text = attributes.defense
        this.uiList.updateHorizontalList()
    }
}