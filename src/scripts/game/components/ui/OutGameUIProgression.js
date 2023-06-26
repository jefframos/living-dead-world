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
            width: 320,
            height: 60
        }
        const pad = 30
        this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0009'), 20, 20, 20, 20);
        this.container.addChild(this.infoBackContainer);

        this.infoBackContainer.width = this.size.width;
        this.infoBackContainer.height = this.size.height;
        this.uiList = new UIList();
        this.uiList.w = this.size.width - pad;
        this.uiList.h = this.size.height - pad;

        this.uiList.x = pad / 2
        this.uiList.y = pad / 2+2

        this.container.addChild(this.uiList)

        this.coinSprite = new PIXI.Sprite.from('coin2')
        this.uiList.addElement(this.coinSprite, { listScl: 0.1, fitHeight: 0.8, align: 1 })

        this.moneyLabel = UIUtils.getPrimaryLabel('0', { fill: 0xFFFFFF, strokeThickness: 1, fontSize:20});
        this.moneyLabel.text = 9000
        this.uiList.addElement(this.moneyLabel, {listScl: 0.3,align: 0.2})

        this.keySprite = new PIXI.Sprite.from('crownl')
        this.uiList.addElement(this.keySprite, { listScl: 0.1, fitHeight: 0.8, align: 1 })

        this.keyLabel = UIUtils.getPrimaryLabel('0', { fill: 0xFFFFFF, strokeThickness: 1, fontSize:20});
        this.keyLabel.text = 2
        this.uiList.addElement(this.keyLabel, {listScl: 0.2,align: 0.2})

        this.tokenSprite = new PIXI.Sprite.from('star')
        this.uiList.addElement(this.tokenSprite, { listScl: 0.1, fitHeight: 0.8, align: 1 })

        this.tokenLabel = UIUtils.getPrimaryLabel('0', { fill: 0xFFFFFF, strokeThickness: 1, fontSize:20});
        this.tokenLabel.text = 2
        this.uiList.addElement(this.tokenLabel, {listScl: 0.2,align: 0.2})



        this.uiList.updateHorizontalList()
    }
}