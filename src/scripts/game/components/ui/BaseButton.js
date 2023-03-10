import * as PIXI from 'pixi.js';

import InteractableView from '../../view/card/InteractableView';
import Utils from '../../core/utils/Utils';
import signals from 'signals';

export default class BaseButton extends PIXI.Container {
    constructor(texture = 'square_0006', width = 100, height = 150) {
        super()

        this.addShape(texture, width, height);
        this.addEvents()

    }
    set tint(value) {
        this.safeShape.tint = value;
    }
    set textTint(value) {
        if (this.text) {
            this.text.style.fill = value;
        }
    }
    addShape(texture, width, height) {
        this.safeShape = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.addChild(this.safeShape);
        this.safeShape.width = width
        this.safeShape.height = height
    }
    addEvents() {
        this.mouseOver = false;

        this.onButtonClicked = new signals.Signal();
        InteractableView.addMouseEnter(this, () => { this.over(); })
        InteractableView.addMouseOut(this, () => { this.out(); })
        InteractableView.addMouseClick(this, () => {
            this.out();
            this.onButtonClicked.dispatch(this)
        })
    }
    addLabelOnCenter(text, offset = { x: 0, y: 0 }) {
        this.text = text;
        this.text.anchor.set(0.5);
        this.text.x = this.safeShape.width / 2 + offset.x;
        this.text.y = this.safeShape.height / 2 + offset.y;
        this.addChild(this.text);
    }

    over() {
        this.mouseOver = true;
    }
    out() {
        this.mouseOver = false;
    }

}