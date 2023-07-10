import * as PIXI from 'pixi.js';

import EntityBuilder from '../../../screen/EntityBuilder';
import Game from '../../../../Game';
import LoadoutCardView from '../../deckBuilding/LoadoutCardView';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';

export default class AttributesContainer extends PIXI.Container {
    constructor() {
        super();

        this.modalTexture = 'tile'

        this.containerBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(this.modalTexture), 20, 20, 20, 20);
        this.containerBackground.width = 500
        this.containerBackground.height = 50
        this.containerBackground.tint = 0
        this.containerBackground.alpha = 0.5

        this.addChild(this.containerBackground)

        this.uiList = new UIList();
        this.addChild(this.uiList)

        this.uiList.w = this.containerBackground.width - 20
        this.uiList.h = this.containerBackground.height - 20

        this.uiList.x = 10;
        this.uiList.y = 10;


        this.healthLabel = UIUtils.getPrimaryLabel('100', { fontSize: 24 });
        this.speedLabel = UIUtils.getPrimaryLabel('100', { fontSize: 24 });
        this.powerLabel = UIUtils.getPrimaryLabel('100', { fontSize: 24 });
        this.defenseLabel = UIUtils.getPrimaryLabel('100', { fontSize: 24 });
        this.frequencyLabel = UIUtils.getPrimaryLabel('100', { fontSize: 20 });
        this.evasionLabel = UIUtils.getPrimaryLabel('100', { fontSize: 20 });
        this.criticalLabel = UIUtils.getPrimaryLabel('100', { fontSize: 20 });

        this.uiList.addElement(new PIXI.Sprite.from(UIUtils.getIconByAttribute('baseHealth')), { fitHeight: 0.5 });
        this.uiList.addElement(this.healthLabel);


        this.uiList.addElement(new PIXI.Sprite.from(UIUtils.getIconByAttribute('basePower')), { fitHeight: 0.5 });
        this.uiList.addElement(this.powerLabel);
        
        this.uiList.addElement(new PIXI.Sprite.from(UIUtils.getIconByAttribute('baseDefense')), { fitHeight: 0.5 });
        this.uiList.addElement(this.defenseLabel);
        
        this.uiList.addElement(new PIXI.Sprite.from(UIUtils.getIconByAttribute('baseFrequency')), { fitHeight: 0.5 });
        this.uiList.addElement(this.frequencyLabel);

        this.uiList.addElement(new PIXI.Sprite.from(UIUtils.getIconByAttribute('baseEvasion')), { fitHeight: 0.5 });
        this.uiList.addElement(this.evasionLabel);

        this.uiList.addElement(new PIXI.Sprite.from(UIUtils.getIconByAttribute('baseCritical')), { fitHeight: 0.5 });
        this.uiList.addElement(this.criticalLabel);

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
        
        if (defaultAttributes.critical < attributes.critical) {
            this.criticalLabel.style.fill = 0xAFFE0F
        } else {
            this.criticalLabel.style.fill = 0xFFFFFF
        }
        this.criticalLabel.text = attributes.critical.toFixed(2)
        
        if (defaultAttributes.evasion < attributes.evasion) {
            this.evasionLabel.style.fill = 0xAFFE0F
        } else {
            this.evasionLabel.style.fill = 0xFFFFFF
        }
        this.evasionLabel.text = attributes.evasion.toFixed(2)

        //TODO: the frequency is wrong here, should have always the right value
        this.frequencyLabel.text = Math.max(0.05,attributes.frequency).toFixed(2)

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