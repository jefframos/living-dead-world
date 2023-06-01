import * as PIXI from 'pixi.js';

import BaseButton from '../ui/BaseButton';
import InteractableView from '../../view/card/InteractableView';
import UIUtils from '../../core/utils/UIUtils';
import Utils from '../../core/utils/Utils';
import signals from 'signals';

export default class LoadoutCardView extends PIXI.Container {
    constructor(texture = 'square_0006', width = 115, height = 150) {
        super()
        this.baseWidth = width;
        this.baseHeight = height;
        this.safeShape = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.addChild(this.safeShape);
        this.safeShape.width = width
        this.safeShape.height = height
        this.safeShape.alpha = 0;

        this.cardData = null;

        this.textures = ['square_0001','square_0002','square_0003','square_0004']

        this.cardContainer = new PIXI.Container();
        this.addChild(this.cardContainer);

        this.cardBorder = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.cardContainer.addChild(this.cardBorder);
        this.cardBorder.width = width
        this.cardBorder.height = height

        this.cardImage = new PIXI.Sprite();

        this.cardContainer.addChild(this.cardImage);
        this.cardImage.anchor.set(0.5)
        // this.cardImage.scale.set(0.5)
        this.cardImage.x = width / 2
        this.cardImage.y = height / 2

        this.mouseOver = false;

        this.onCardClicked = new signals.Signal();
        this.onCardConfirmed = new signals.Signal();
        this.onStartDrag = new signals.Signal();
        this.onEndDrag = new signals.Signal();
        InteractableView.addMouseEnter(this.cardContainer, () => { this.mouseOver = true; })
        InteractableView.addMouseOut(this.cardContainer, () => { this.mouseOver = false; })
        InteractableView.addMouseClick(this.cardContainer, () => { this.onCardClicked.dispatch(this) })
        InteractableView.addMouseDown(this.cardContainer, () => {
            this.onStartDrag.dispatch(this)
        })

             
        this.offset = { x: 0, y: 0 }

        // let zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0,0,10)
        // this.addChild(zero)

        this.cardContainer.x = -width / 2
        this.cardContainer.pivot.y = height

        this.safeShape.x = -width / 2
        this.safeShape.pivot.y = height

        this.state = 0;

       this.smallFontSize = 12
       this.largeFontSize = 16

    }
    resetPivot(){
        this.cardContainer.x = 0
        this.cardContainer.pivot.y = 0

        this.safeShape.x = 0
        this.safeShape.pivot.y = 0
    }
    highlight() {

        this.customWidth = 500;
        this.customHeight = 250;
        this.state = 1
    }
    unhighlight() {

        this.customWidth = this.baseWidth;
        this.customHeight = this.baseHeight;
        this.state = 0
    }
    updateTexture(textureID) {
        this.cardImage.texture = PIXI.Texture.from(textureID)
    }

    setData(cardData) {
        if (this.cardData == cardData) {
            return;
        }
        this.cardData = cardData;
        let cardID = 0
        this.cardBorder.texture = PIXI.Texture.from(this.textures[cardID]);
        this.updateTexture(cardData.entityData.icon)
        this.cardImage.scale.set(Utils.scaleToFit(this.cardImage, 50))
    }
    
}