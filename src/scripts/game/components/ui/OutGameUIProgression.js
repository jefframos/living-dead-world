import * as PIXI from 'pixi.js';

import InteractableView from '../../view/card/InteractableView';
import UIList from '../../ui/uiElements/UIList';
import UIUtils from '../../core/utils/UIUtils';
import Utils from '../../core/utils/Utils';
import signals from 'signals';

export default class OutGameUIProgression extends PIXI.Container {
    constructor() {
        super()

        this.container = new PIXI.Container();
        this.addChild(this.container)

        this.size = {
            width: 150,
            height: 60
        }
        const pad = 20
        this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('infoBack'), 20, 20, 20, 20);
        this.container.addChild(this.infoBackContainer);

        this.infoBackContainer.width = this.size.width;
        this.infoBackContainer.height = this.size.height;
        this.uiList = new UIList();
        this.uiList.w = this.size.width - pad;
        this.uiList.h = this.size.height - pad;

        this.uiList.x = pad / 2
        this.uiList.y = pad / 2

        this.container.addChild(this.uiList)

        this.moneyLabel = UIUtils.getPrimaryLabel('0', { fill: 0xFFFFFF })
        this.moneyLabel.text = 9000
        this.uiList.addElement(this.moneyLabel)

        this.coinSprite = new PIXI.Sprite.from('coin3')
        this.uiList.addElement(this.coinSprite, { listScl: 0.2, fitWidth: 0.8, align: 0.5 })


        this.uiList.updateHorizontalList()
    }
}