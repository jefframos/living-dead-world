import * as PIXI from 'pixi.js';

import BaseButton from '../BaseButton';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';
import signals from 'signals';

export default class DifficultyButton extends PIXI.Container {
    constructor(difficulty) {
        super();


        let tex = 'floor_5'
        let label = ''

        if (difficulty == 1) {

            tex = UIUtils.baseButtonTexture + '_0001'
            label = 'Easy'

        } else if (difficulty == 2) {
            tex = UIUtils.baseButtonTexture + '_0002'
            label = 'Medium'

        } else {
            tex = UIUtils.baseButtonTexture + '_0004'
            label = 'Hard'

        }
        this.button = new BaseButton(tex, 130, 120)
        this.addChild(this.button)
        this.containerBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(tex), 20, 20, 20, 20);
        this.containerBackground.width = 130
        this.containerBackground.height = 120
        //this.addChild(this.containerBackground)

        this.description = UIUtils.getPrimaryLabel(label)
        this.description.scale.set(0.75)
        this.description.anchor.x = 0.5
        this.description.x = 0.5 * this.containerBackground.width
        this.description.y = 10
        this.addChild(this.description)

        this.badge = new PIXI.Sprite.from('achievmentl')
        this.addChild(this.badge)

        this.badge.anchor.set(0.5)
        this.badge.scale.set(Utils.scaleToFit(this.badge, 40))

        this.badge.x = this.containerBackground.width - 30
        this.badge.y = this.containerBackground.height - 35

        this.onClick = new signals.Signal();
        this.button.onButtonClicked.add(() => {
            this.onClick.dispatch();
        })
    }
    setStatus(status) {
        //console.log(status)
        if (status >= 0) {
            this.badge.tint = 0xFFFFFF
            this.badge.alpha = 1
        } else {
            this.badge.tint = 0
            this.badge.alpha = 0.7

        }
    }
}