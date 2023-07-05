import * as PIXI from 'pixi.js';

import UIUtils from '../../../utils/UIUtils';

export default class ShopCard extends PIXI.Container {
    constructor(texture = UIUtils.baseButtonTexture + '_0006', width = 100, height = 150) {
        super()

        this.safeShape = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 25, 25, 25, 25);
        this.safeShape.width = width
        this.safeShape.height = height
        this.addChild(this.safeShape);
    }
    resize(width, height) {
        this.safeShape.width = width
        this.safeShape.height = height
    }
}