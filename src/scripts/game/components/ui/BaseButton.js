import * as PIXI from 'pixi.js';

import InteractableView from '../../view/card/InteractableView';
import Utils from '../../core/utils/Utils';
import signals from 'signals';

export default class BaseButton extends PIXI.Container {
    constructor(texture = 'square_0006', width = 100, height = 150) {
        super()

        this.safeShape = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.addChild(this.safeShape);
        this.safeShape.width = width
        this.safeShape.height = height

        this.mouseOver = false;

        this.onButtonClicked = new signals.Signal();
        InteractableView.addMouseEnter(this, () => { this.mouseOver = true; })
        InteractableView.addMouseOut(this, () => { this.mouseOver = false; })
        InteractableView.addMouseClick(this, () => { this.onButtonClicked.dispatch(this)})

    }


}