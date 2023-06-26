import * as PIXI from 'pixi.js';

import CompanionData from '../../../data/CompanionData';
import EntityBuilder from '../../../screen/EntityBuilder';
import Game from '../../../../Game';
import LoadoutCardView from '../../deckBuilding/LoadoutCardView';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../core/utils/UIUtils';
import Utils from '../../../core/utils/Utils';
import WeaponData from '../../../data/WeaponData';

export default class LoadoutStatsView extends PIXI.Container {
    constructor() {
        super();

        this.modalTexture = 'modal_container0009'

        this.containerBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(this.modalTexture), 20, 20, 20, 20);
        this.containerBackground.width = 170
        this.containerBackground.height = 200
        this.containerBackground.alpha = 0.5

        this.addChild(this.containerBackground)

        this.uiList = new UIList();
        this.addChild(this.uiList)

        this.uiList.w = 10
        this.uiList.h = 10

        this.uiList.x = 10;
        this.uiList.y = 10;
        this.rows = 0;

        this.starsSprites = [];

        this.starsList = new UIList();
        this.starsList.w = this.containerBackground.width - 20
        this.starsList.h = 30
        for (var i = 0; i < 5; i++) {
            const star = new PIXI.Sprite.from('icon_close');
            this.starsList.addElement(star, { fitHeight: 0.8 })
            this.starsSprites.push(star)
        }
        this.starsList.updateHorizontalList();

        this.currentCardData = null;
        this.currentLevel = -1;
    }
    addRow(icon, label) {


        const rowList = new UIList();
        this.addChild(rowList)
        rowList.w = this.containerBackground.width - 30
        rowList.h = 30
        rowList.addElement(new PIXI.Sprite.from(icon), { fitHeight: 0.8, listScl: 0.2 });

        const tempLabel = UIUtils.getPrimaryLabel(label, { fontSize: 22 });
        rowList.addElement(tempLabel, { align: 0, listScl: 0.8, scaleContentMax: true });

        this.rows++;

        this.uiList.addElement(rowList, { align: 0 });
        rowList.updateHorizontalList()
        this.uiList.h = this.rows * 30

        this.containerBackground.height = this.uiList.h

    }
    updateData(data, level) {
        if (this.currentCardData) {
            if (this.currentCardData.id == data.id && this.currentLevel == level) {
                return
            }
        }

        this.currentLevel = level
        this.currentCardData = data
        this.uiList.removeAllElements();
        this.rows = 0;
        this.uiList.h = 30
        this.containerBackground.height = this.uiList.h

        for (let index = 0; index < this.starsSprites.length; index++) {
            if (index <= level) {
                this.starsSprites[index].texture = PIXI.Texture.from('icon_confirm')
            } else {
                this.starsSprites[index].texture = PIXI.Texture.from('icon_close')
            }
        }
        this.uiList.addElement(this.starsList, { align: 0 });
        this.rows++;
        this.rows++;
        if (data instanceof WeaponData) {
            const atts = this.getWeaponAttributes(data, level);
            atts.forEach(element => {
                this.addRow(element.icon, element.value)
            });
        } else if (data instanceof CompanionData) {
            const weapon = EntityBuilder.instance.getWeapon(data.weapon.id)
            this.addRow(weapon.entityData.icon, weapon.entityData.name)
            const atts = this.getWeaponAttributes(weapon, level);
            console.log(data, weapon)
            atts.forEach(element => {
                this.addRow(element.icon, element.value)
            });
        } else {
            if (data.attribute && data.value && level < data.value.length) {
                this.addRow(UIUtils.getIconByAttribute(data.attribute), data.value[level])
            }

            if (data.secAttribute && data.secValue && level < data.secValue.length) {
                this.addRow(UIUtils.getIconByAttribute(data.secAttribute), data.secValue[level])
            }
        }
        this.containerBackground.height += 20
        this.uiList.updateVerticalList()
    }
    getWeaponAttributes(data, level) {
        const att = []

        if (Array.isArray(data.weaponAttributes.basePower)) {
            att.push({ icon: UIUtils.getIconByAttribute('basePower'), value: data.weaponAttributes.basePower[level] })
        }
        if (Array.isArray(data.weaponAttributes.baseFrequency)) {
            att.push({ icon: UIUtils.getIconByAttribute('baseFrequency'), value: data.weaponAttributes.baseFrequency[level] })
        }
        if (Array.isArray(data.weaponAttributes.baseBulletSpeed)) {
            att.push({ icon: UIUtils.getIconByAttribute('baseBulletSpeed'), value: data.weaponAttributes.baseBulletSpeed[level] })
        }
        if (Array.isArray(data.weaponAttributes.baseAmount)) {
            att.push({ icon: UIUtils.getIconByAttribute('baseAmount'), value: data.weaponAttributes.baseAmount[level] })
        }
        if (Array.isArray(data.weaponAttributes.baseBrustFireAmount)) {
            att.push({ icon: UIUtils.getIconByAttribute('baseBrustFireAmount'), value: data.weaponAttributes.baseBrustFireAmount[level] })
        }
        return att
    }

   
}