import * as PIXI from 'pixi.js';

import BaseButton from '../ui/BaseButton';
import InteractableView from '../../view/card/InteractableView';
import UIUtils from '../../core/utils/UIUtils';
import Utils from '../../core/utils/Utils';
import signals from 'signals';

export default class CardView extends PIXI.Container {
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

        this.textures = ['tier-0-card_1', 'tier-1-card_1', 'tier-2-card_1', 'tier-3-card_1', 'tier-4-card_1']
        this.texturesNew = ['new-card0001', 'new-card0002', 'new-card0003']
        this.skews = [{
            skew: -0.3,
            rotation: -0.2,
            position: {
                x: width / 2 + 5,
                y: 15
            }
        },
        {
            skew: -0.25,
            rotation: -0.2,
            position: {
                x: width / 2 + 5,
                y: 18
            }
        },
        {
            skew: -0.3,
            rotation: -0.08,
            position: {
                x: width / 2 + 5,
                y: 20
            }
        }]

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

        this.label = new PIXI.Text('', window.LABELS.LABEL1)
        this.cardContainer.addChild(this.label);
        this.label.style.fill = 0
        this.label.style.strokeThickness = 0
        this.label.style.wordWrap = true
        this.label.style.wordWrapWidth = width * 0.7
        this.label.style.fontSize = 14
        this.label.anchor.set(0.5, 0)
        this.label.x = width / 2
        this.label.y = 30

        this.label.skew.set(-0.1, 0)

        this.offset = { x: 0, y: 0 }

        // let zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0,0,10)
        // this.addChild(zero)

        this.cardContainer.x = -width / 2
        this.cardContainer.pivot.y = height

        this.safeShape.x = -width / 2
        this.safeShape.pivot.y = height
        this.confirmCard = new BaseButton('square_0001s', 100, 50);
        this.addChild(this.confirmCard)
        this.confirmCard.pivot.x = this.confirmCard.safeShape.width
        UIUtils.addLabel(this.confirmCard, "Confirm", {strokeThickness:0, fontSize:18, fill:0})
        InteractableView.addMouseClick(this.confirmCard, () => { this.onCardConfirmed.dispatch(this) })


        this.cancelCard = new BaseButton('square_0004s', 100, 50);
        //this.addChild(this.cancelCard)

        this.state = 0;
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
        let cardID = Math.floor(Math.random() * this.textures.length)
        this.cardBackground.texture = PIXI.Texture.from(this.textures[cardID]);
        this.updateTexture(cardData.entityData.icon)
        this.cardImage.scale.set(Utils.scaleToFit(this.cardImage, 50))
        this.label.text = cardData.entityData.name
    }
    update(delta) {
        this.cardContainer.y = Utils.lerp(this.cardContainer.y, this.offset.y, 0.3);

        if (this.mouseOver && this.state != 1) {
            this.offset.y = -20
        } else {
            this.offset.y = 0
        }

        if (this.customWidth) {
            this.cardBackground.width = Utils.lerp(this.cardBackground.width, this.customWidth, 0.2);
            this.cardBackground.height = Utils.lerp(this.cardBackground.height, this.customHeight, 0.3);
            this.cardBackground.x = -this.cardBackground.width / 2 + this.baseWidth / 2

        }
        
        if(this.state == 1){

            this.cardImage.x = Utils.lerp(this.cardImage.x, -this.cardBackground.width/2 + this.baseWidth, 0.2);
        }else{

            this.cardImage.x = Utils.lerp(this.cardImage.x, this.cardBackground.width / 2, 0.2);
        }


        
        this.safeShape.pivot.y = this.cardBackground.height
        this.cardContainer.pivot.y = this.cardBackground.height

        this.margin = 20

        this.cancelCard.visible = this.confirmCard.visible = this.state == 1;
        this.cancelCard.x = -this.cardBackground.width / 2 + this.margin
        this.cancelCard.y = -this.cancelCard.height - this.margin

        this.confirmCard.x = this.cardBackground.width / 2 - this.margin
        this.confirmCard.y = -this.confirmCard.height - this.margin
    }
}