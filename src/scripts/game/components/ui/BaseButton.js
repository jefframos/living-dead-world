import * as PIXI from 'pixi.js';

import InteractableView from '../../view/card/InteractableView';
import Utils from '../../core/utils/Utils';
import signals from 'signals';

export default class BaseButton extends PIXI.Container {
    constructor(texture = 'square_0006', width = 100, height = 150) {
        super()

        this.addShape(texture, width, height);
        this.addEvents()

        this.hitArea = new PIXI.Rectangle(0, 0, width, height);

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
    addIcon(icon, height = 0, anchor = { x: 0.5, y: 0.5 }, offset = { x: 0, y: 0 }) {
        this.icon = new PIXI.Sprite.from(icon);
        this.icon.interactive = false;

        if (height > 0) {
            this.icon.scale.set(Utils.scaleToFit(this.icon, height));
        }
        this.icon.anchor.x = anchor.x
        this.icon.anchor.y = anchor.y
        this.icon.x = this.safeShape.width / 2 + offset.x;
        this.icon.y = this.safeShape.height / 2 + offset.y;
        this.addChild(this.icon);
    }

    addIconContainer(iconContainer, height = 0, pivot = { x: 0.5, y: 0.5 }, offset = { x: 0, y: 0 }) {
        this.iconContainer = iconContainer;
        this.iconContainer.interactive = false;
        if (height > 0) {
            this.iconContainer.scale.set(Utils.scaleToFit(this.iconContainer, height));
        }
        this.iconContainer.pivot.x = pivot.x
        this.iconContainer.pivot.y = pivot.y
        this.iconContainer.x = this.safeShape.width / 2 + offset.x;
        this.iconContainer.y = this.safeShape.height / 2 + offset.y;
        this.addChild(this.iconContainer);
    }
    over() {
        this.mouseOver = true;
    }
    out() {
        this.mouseOver = false;
    }

}