import * as PIXI from 'pixi.js';

import Utils from '../../core/utils/Utils';

export default class PlayerActiveEquipmentOnHud extends PIXI.Container {
    constructor() {
        super();
        this.icon = new PIXI.Sprite();
        this.icon.anchor.set(0.5)
        this.levelLabel = new PIXI.Text("", window.LABELS.LABEL1)
        this.levelLabel.anchor.set(0.5)

        this.addChild(this.icon)
        this.addChild(this.levelLabel)
    }
    setItem(item, size = 50) {
        this.icon.texture = PIXI.Texture.from(item.entityData.icon)
        this.icon.scale.set(Utils.scaleToFit(this.icon, 50))
       // this.icon.rotation = Math.PI / 4
        this.icon.x = this.icon.width/2
        this.icon.y = this.icon.height/2
    }
    setLevel(level = 0) {
        this.levelLabel.text = level +1;
        //this.levelLabel.text = level ? level+1 : '';
        this.levelLabel.x = this.icon.width
        this.levelLabel.y = this.icon.height
    }
}
