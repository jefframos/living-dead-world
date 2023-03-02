import * as PIXI from 'pixi.js';

import InteractableView from '../../view/card/InteractableView';
import Utils from '../../core/utils/Utils';
import signals from 'signals';

export default class CardView extends PIXI.Container {
    constructor(texture = 'square_0006', width = 100, height = 150) {
        super()

        this.safeShape = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.addChild(this.safeShape);
        this.safeShape.width = width
        this.safeShape.height = height
        this.safeShape.alpha = 0;

        this.cardData = null;

        this.textures = ['square_0001','square_0002','square_0003','square_0004','square_0005']

        this.cardContainer = new PIXI.Container();
        this.addChild(this.cardContainer);

        this.cardBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.cardContainer.addChild(this.cardBackground);
        this.cardBackground.width = width
        this.cardBackground.height = height

        this.cardImage = new PIXI.Sprite();

        this.cardContainer.addChild(this.cardImage);
        this.cardImage.anchor.set(0.5)
        // this.cardImage.scale.set(0.5)
        this.cardImage.x = width / 2
        this.cardImage.y = height / 2 - 30

        this.mouseOver = false;

        this.onCardClicked = new signals.Signal();
        this.onStartDrag = new signals.Signal();
        this.onEndDrag = new signals.Signal();
        InteractableView.addMouseEnter(this, () => { this.mouseOver = true; })
        InteractableView.addMouseOut(this, () => { this.mouseOver = false; })
        //InteractableView.addMouseClick(this, () => { this.onCardClicked.dispatch(this)})
        InteractableView.addMouseDown(this, () => { 
            this.onStartDrag.dispatch(this) 
        })

        this.label = new PIXI.Text('', window.LABELS.LABEL1)
        this.cardContainer.addChild(this.label);
        this.label.style.wordWrap = width * 0.8
        this.label.anchor.set(0.5)
        this.label.x = width / 2
        this.label.y = height / 2 + 30

        this.offset = { x: 0, y: 0 }

        // let zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0,0,10)
        // this.addChild(zero)

        this.cardContainer.x = -width / 2
        this.cardContainer.pivot.y = height

        this.safeShape.x = -width / 2
        this.safeShape.pivot.y = height
    }

    updateTexture(textureID) {
        this.cardImage.texture = PIXI.Texture.from(textureID)
    }

    setData(cardData) {
        this.cardBackground.texture = PIXI.Texture.from(this.textures[cardData.entityData.tier] || 'square_0001');
        this.cardData = cardData;
        this.updateTexture(cardData.entityData.icon)
        this.cardImage.scale.set(Utils.scaleToFit(this.cardImage, 60))
        this.label.text = cardData.entityData.name
    }
    update(delta) {
        this.cardContainer.y = Utils.lerp(this.cardContainer.y, this.offset.y, 0.3);

        if (this.mouseOver) {
            this.offset.y = -20
        } else {
            this.offset.y = 0
        }
    }
}