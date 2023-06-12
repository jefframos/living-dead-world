import * as PIXI from 'pixi.js';

import BaseButton from '../ui/BaseButton';
import InteractableView from '../../view/card/InteractableView';
import UIUtils from '../../core/utils/UIUtils';
import Utils from '../../core/utils/Utils';
import signals from 'signals';

export default class LoadoutCardView extends PIXI.Container {
    constructor(texture = UIUtils.baseButtonTexture + '_0006', width = 115, height = 150) {
        super()
        this.baseWidth = width;
        this.baseHeight = height;
        this.safeShape = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.addChild(this.safeShape);
        this.safeShape.width = width
        this.safeShape.height = height
        this.safeShape.alpha = 0;

        this.cardData = null;
        this.empty = UIUtils.baseButtonTexture + '_0006';

        this.textures = [UIUtils.baseButtonTexture + '_0001', UIUtils.baseButtonTexture + '_0002', UIUtils.baseButtonTexture + '_0003', UIUtils.baseButtonTexture + '_0004', UIUtils.baseButtonTexture + '_0005']

        this.cardContainer = new PIXI.Container();
        this.addChild(this.cardContainer);

        this.cardBorder = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.cardContainer.addChild(this.cardBorder);
        this.cardBorder.width = width
        this.cardBorder.height = height


        this.cardIconContainer = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.cardContainer.addChild(this.cardIconContainer);
        this.cardIconContainer.width = 40
        this.cardIconContainer.height = 40
        this.cardIconContainer.x = width - 20
        this.cardIconContainer.y = - 20
        this.cardIconContainer.visible = false;

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
    setIconType(left = false) {
        if (left) {
            this.cardIconContainer.x = -20;
        }
        this.cardIconContainer.visible = true;

    }
    resetPivot() {
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

    setData(cardData, level = 0, customIconSize = 80) {
        if (!cardData) {
            this.cardBorder.texture = PIXI.Texture.from(this.empty);
            this.cardImage.texture = PIXI.Texture.EMPTY;

            return;
        }
        this.cardData = cardData;
        this.level = level;
        let cardID = 0
        this.cardBorder.texture = PIXI.Texture.from(this.textures[cardID]);
        if (cardData) {
            this.updateTexture(cardData.entityData.icon)
            this.cardBorder.texture = PIXI.Texture.from(this.textures[level])
        } else {
            this.cardImage.texture = PIXI.Texture.EMPTY;
            this.cardBorder.texture = PIXI.Texture.from(this.textures[level])
        }
        this.cardImage.scale.set(Utils.scaleToFit(this.cardImage, customIconSize))
    }

}