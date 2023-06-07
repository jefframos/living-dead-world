import * as PIXI from 'pixi.js';

import InteractableView from '../../../view/card/InteractableView';
import UIUtils from '../../../core/utils/UIUtils';
import Utils from '../../../core/utils/Utils';
import signals from 'signals';

export default class RouletteSlotView extends PIXI.Container {
    constructor() {
        super();

        this.slotHeight = 100;
        this.panelHeight = this.slotHeight * 2;
        this.background = UIUtils.getRect(0xFF0455, 150, this.panelHeight)
        this.addChild(this.background);

        this.container = new PIXI.Container();
        this.addChild(this.container);

        this.stripContainer = new PIXI.Container();
        this.container.addChild(this.stripContainer);


        this.containerMask = UIUtils.getRect(0xFF0455, 150, this.panelHeight)
        this.container.addChild(this.containerMask);
        this.container.mask = this.containerMask;

        InteractableView.addMouseClick(this, () => {
            this.onSlotSelected.dispatch()
        })

        this.midOffset = this.slotHeight * 0.5
        this.onSlotSelected = new signals.Signal();
        this.totalImages = 3;

        this.offset = 0;
        this.images = [];
        this.sprites = [];


        this.normal = 0;

        this.curveTimer = 3;
        this.curveCurrentTime = 0;


        this.spinSpeed = 1500;

        this.centerDataIndex = 0;

        this.addSlotImagesList(['pistol1-icon', 'unicornLeg-icon', 'blaster-minugun-icon'])

        this.baseGrad = new PIXI.Sprite.from('base-gradient')
        this.baseGrad.scale.set(Utils.scaleToFit(this.baseGrad, 150))
        this.topGrad = new PIXI.Sprite.from('base-gradient')
        this.topGrad.scale.set(Utils.scaleToFit(this.topGrad, 150))
        this.topGrad.scale.y *= -1
        this.topGrad.anchor.y = 1

        this.baseGrad.y = this.panelHeight - this.baseGrad.height
        this.container.addChild(this.baseGrad);
        this.container.addChild(this.topGrad);

        this.baseGrad.tint = this.topGrad.tint = 0x5533aa;
        this.baseGrad.blendMode = this.topGrad.blendMode = PIXI.BLEND_MODES.OVERLAY


    }
    addSlotImagesList(images) {
        this.images = images;

        this.startImage = Math.floor(Math.random() * this.images.length)

        while (this.stripContainer.children.length) {
            this.stripContainer.removeChildAt(0);
        }

        this.sprites = [];

        for (let index = 0; index < this.totalImages; index++) {
            const element = this.images[(this.startImage + index) % this.images.length];
            const sprite = new PIXI.Sprite.from(element);
            sprite.y = index * this.slotHeight - this.slotHeight
            this.sprites.push(sprite);
            sprite.scale.set(Utils.scaleToFit(sprite, this.slotHeight - 10))
            sprite.anchor.set(0.5);
            sprite.x = 75
            this.stripContainer.addChild(sprite);
        }

        this.offset = Math.random() * this.slotHeight

        this.spin();
    }
    spin() {
        this.spinning = true;

        this.spinSpeed = 1500 + Math.random() * 200;

        this.curveTimer = 3 + Math.random();
        this.curveCurrentTime = 0;
    }
    endState() {
        this.spinning = false;
        TweenLite.to(this, 1 + Math.random() * 0.3, { offset: this.slotHeight * 0.5, ease: Back.easeOut })
        this.centerDataIndex = (this.startImage + 1) % this.images.length;
    }
    update(delta) {
        if (this.spinning) {
            if (this.curveCurrentTime >= this.curveTimer) {
                this.endState();
            } else {
                this.curveCurrentTime += delta;
                this.normal = this.curveCurrentTime / this.curveTimer;
                this.offset += delta * this.spinSpeed * Utils.easeOutQuad(1 - (this.normal))
            }
        }
        if (this.offset > this.slotHeight) {
            this.offset %= this.slotHeight
            this.startImage--;
            this.startImage %= this.images.length
            if (this.startImage < 0) {
                this.startImage = this.images.length - 1
            }
            this.updateSpritesTextures()
        }
        for (let index = 0; index < this.sprites.length; index++) {
            this.sprites[index].y = index * this.slotHeight + this.offset - this.panelHeight * 0.5 + this.midOffset
        }

    }
    updateSpritesTextures() {
        for (let index = 0; index < this.totalImages; index++) {
            const image = this.images[(this.startImage + index) % this.images.length];

            const sprite = this.sprites[index]
            sprite.texture = PIXI.Texture.from(image)
            sprite.scale.set(Utils.scaleToFit(sprite, this.slotHeight - 10))

        }
    }
}