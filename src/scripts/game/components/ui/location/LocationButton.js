import * as PIXI from 'pixi.js';

import BaseButton from '../BaseButton';
import CompanionData from '../../../data/CompanionData';
import EntityBuilder from '../../../screen/EntityBuilder';
import Game from '../../../../Game';
import LoadoutCardView from '../../deckBuilding/LoadoutCardView';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';
import WeaponData from '../../../data/WeaponData';
import signals from 'signals';

export default class LocationButton extends PIXI.Container {
    constructor() {
        super();
        this.margin = 20

        this.containerBackground = new PIXI.TilingSprite(PIXI.Texture.from('floor_5'), 256, 256);
        this.containerBackground.width = 170
        this.containerBackground.height = 200

        this.addChild(this.containerBackground)

        this.uiList = new UIList();
        this.addChild(this.uiList)

        this.levelName = UIUtils.getPrimaryLabel("Name")
        this.uiList.addElement(this.levelName)
        this.levelName.style.wordWrap = 120

        this.levelTime = UIUtils.getPrimaryLabel("Name")
        this.uiList.addElement(this.levelTime)

        this.uiList.w = 10
        this.uiList.h = 10

        this.uiList.x = this.margin;
        this.uiList.y = this.margin;
        this.rows = 0;

        this.starsSprites = [];

        this.starsList = new UIList();
        this.starsList.w = this.containerBackground.width - 20
        this.starsList.h = 30
        for (var i = 0; i < 5; i++) {
            const star = new PIXI.Sprite.from(UIUtils.getIconUIIcon('enemy-kill'));
            this.starsList.addElement(star, { fitHeight: 0.8 })
            this.starsSprites.push(star)
            star.tint = 0;
        }
        this.starsList.updateHorizontalList();

        this.uiList.addElement(this.starsList)

        this.onStageSelected = new signals.Signal();
        this.baseButton = new BaseButton('powerbar_border');
        this.addChild(this.baseButton)
        this.baseButton.alpha = 0.4;
        this.baseButton.onButtonClicked.add(() => {
            this.onStageSelected.dispatch(this);
        })

        this.lockContainer = new PIXI.Container()
        this.lockSprite = new PIXI.NineSlicePlane(PIXI.Texture.from('tile'), 20, 20, 20, 20);
        this.lockSprite.width = 170
        this.lockSprite.height = 200
        this.lockSprite.tint = 0
        this.lockSprite.alpha = 0.9
        this.lockSprite.interactive = true;

        this.lockIcon = new PIXI.Sprite.from(UIUtils.getIconUIIcon('lockIcon'))
        this.lockIcon.anchor.set(0.5);

        this.lockContainer.addChild(this.lockSprite)
        this.lockContainer.addChild(this.lockIcon)
        this.addChild(this.lockContainer)


    }
    setData(data, isLock) {
        this.containerBackground.texture = PIXI.Texture.from(data.views.groundTexture, data.views.groundWidth, data.views.groundWidth)
        this.levelName.text = data.views.levelName
        this.levelTime.text = Utils.floatToTime(data.waves.lenght)
        this.uiList.updateHorizontalList()

        this.lockContainer.visible = isLock

        for (let index = 0; index < data.waves.difficulty; index++) {
            const element = this.starsSprites[index];
            element.tint = 0xFFFFFF;
        }

    }
    updateSize(width, height) {

        this.baseButton.resize(width - this.margin * 2, height - this.margin * 2)
        this.containerBackground.width = width - this.margin * 2
        this.containerBackground.height = height - this.margin * 2

        this.containerBackground.x = this.margin * 2
        this.containerBackground.y = this.margin

        this.baseButton.x = this.containerBackground.x
        this.baseButton.y = this.containerBackground.y

        this.uiList.w = this.containerBackground.width
        this.uiList.h = this.containerBackground.height
        this.uiList.updateHorizontalList()

        this.lockSprite.width = this.containerBackground.width
        this.lockSprite.height = this.containerBackground.height

        this.lockIcon.x = this.lockSprite.width / 2
        this.lockIcon.y = this.lockSprite.height / 2
        this.lockContainer.x = this.containerBackground.x
        this.lockContainer.y = this.containerBackground.y

    }

}