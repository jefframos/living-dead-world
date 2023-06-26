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

        this.modalTexture = 'modal_container0009'

        this.containerBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(this.modalTexture), 20, 20, 20, 20);
        this.containerBackground.width = 550
        this.containerBackground.height = 80
        this.containerBackground.alpha = 0.5

        this.addChild(this.containerBackground)

        this.uiList = new UIList();
        this.addChild(this.uiList)

        this.uiList.w = this.containerBackground.width - 20
        this.uiList.h = this.containerBackground.height - 20

        this.uiList.x = 10;
        this.uiList.y = 10;


        this.healthLabel = UIUtils.getPrimaryLabel('100', { fontSize: 26 });
        this.speedLabel = UIUtils.getPrimaryLabel('100', { fontSize: 26 });
        this.frequencyLabel = UIUtils.getPrimaryLabel('100', { fontSize: 26 });
        this.powerLabel = UIUtils.getPrimaryLabel('100', { fontSize: 26 });
        this.defenseLabel = UIUtils.getPrimaryLabel('100', { fontSize: 26 });

        this.uiList.addElement(new PIXI.Sprite.from(UIUtils.getIconByAttribute('baseHealth')), { fitHeight: 0.5 });
        this.uiList.addElement(this.healthLabel);

        this.uiList.addElement(new PIXI.Sprite.from(UIUtils.getIconByAttribute('baseSpeed')), { fitHeight: 0.5 });
        this.uiList.addElement(this.speedLabel);

        this.uiList.addElement(new PIXI.Sprite.from(UIUtils.getIconByAttribute('baseFrequency')), { fitHeight: 0.5 });
        this.uiList.addElement(this.frequencyLabel);

        this.uiList.addElement(new PIXI.Sprite.from(UIUtils.getIconByAttribute('basePower')), { fitHeight: 0.5 });
        this.uiList.addElement(this.powerLabel);

        this.uiList.addElement(new PIXI.Sprite.from(UIUtils.getIconByAttribute('baseDefense')), { fitHeight: 0.5 });
        this.uiList.addElement(this.defenseLabel);

        this.uiList.updateHorizontalList()

    }
    updateAttributes(defaultAttributes, attributes) {

        if (defaultAttributes.health < attributes.health) {
            this.healthLabel.style.fill = 0xAFFE0F
        } else {
            this.healthLabel.style.fill = 0xFFFFFF
        }
        this.healthLabel.text = attributes.health

        if (defaultAttributes.speed < attributes.speed) {
            this.speedLabel.style.fill = 0xAFFE0F
        } else {
            this.speedLabel.style.fill = 0xFFFFFF
        }
        this.speedLabel.text = attributes.speed

        if (defaultAttributes.frequency < attributes.frequency) {
            this.frequencyLabel.style.fill = 0xAFFE0F
        } else {
            this.frequencyLabel.style.fill = 0xFFFFFF
        }
        this.frequencyLabel.text = attributes.frequency

        if (defaultAttributes.power < attributes.power) {
            this.powerLabel.style.fill = 0xAFFE0F
        } else {
            this.powerLabel.style.fill = 0xFFFFFF
        }
        this.powerLabel.text = attributes.power

        if (defaultAttributes.defense < attributes.defense) {
            this.defenseLabel.style.fill = 0xAFFE0F
        } else {
            this.defenseLabel.style.fill = 0xFFFFFF
        }
        this.defenseLabel.text = attributes.defense
        this.uiList.updateHorizontalList()
    }
}