import * as PIXI from 'pixi.js';

import BaseButton from '../ui/BaseButton';
import EntityData from '../../data/EntityData';
import InteractableView from '../../view/card/InteractableView';
import UIUtils from '../../core/utils/UIUtils';
import Utils from '../../core/utils/Utils';
import signals from 'signals';

export default class CardView extends PIXI.Container {
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

        this.textures = ['ingame-card0001', 'ingame-card0002', 'ingame-card0003', 'ingame-card0004', 'ingame-card0005', 'ingame-card0006']

        this.fullContnainer = new PIXI.Container();
        this.addChild(this.fullContnainer);

        this.cardContentContnainer = new PIXI.Container();
        this.fullContnainer.addChild(this.cardContentContnainer);

        this.cardContainer = new PIXI.Container();
        this.fullContnainer.addChild(this.cardContainer);

        this.cardBackground = new PIXI.Sprite.from('ingame-card0003');
        this.cardBackground.width = width
        this.cardBackground.height = height

        this.cardBorder = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 0, 120, 0, 120);
        this.cardContentContnainer.addChild(this.cardBorder);
        this.cardBorder.width = width
        this.cardBorder.height = height


        this.cardIconContainer = new PIXI.Sprite.from('item_card_container')
        this.cardContainer.addChild(this.cardIconContainer);
        this.cardIconContainer.anchor.set(0.5);
        this.cardIconContainer.scale.set(Utils.scaleToFit(this.cardIconContainer, 80))

        this.cardImage = new PIXI.Sprite();
        this.cardIconContainer.addChild(this.cardImage);
        this.cardImage.anchor.set(0.5)

        this.mouseOver = false;

        this.onCardClicked = new signals.Signal();
        this.onCardConfirmed = new signals.Signal();
        this.onStartDrag = new signals.Signal();
        this.onEndDrag = new signals.Signal();
        InteractableView.addMouseEnter(this.cardContentContnainer, () => { this.mouseOver = true; })
        InteractableView.addMouseOut(this.cardContentContnainer, () => { this.mouseOver = false; })
        InteractableView.addMouseClick(this.cardContentContnainer, () => { this.onCardConfirmed.dispatch(this) })
        InteractableView.addMouseDown(this.cardContentContnainer, () => {
            this.onStartDrag.dispatch(this)
        })

        //this.titleBox = new PIXI.NineSlicePlane(PIXI.Texture.from('title-1'), 50, 0, 50, 0);
        this.titleBox = new PIXI.NineSlicePlane(PIXI.Texture.from('grid1'), 50, 0, 50, 0);
        this.cardContentContnainer.addChild(this.titleBox);
        this.titleBox.width = width + 20
        this.titleBox.height = 37
        this.titleBox.x = -10
        this.titleBox.y = 20



        this.labelTitle = new PIXI.Text('', window.LABELS.LABEL1)
        this.titleBox.addChild(this.labelTitle);
        this.labelTitle.style.fill = 0xFFFFFF
        this.labelTitle.style.strokeThickness = 0
        this.labelTitle.style.wordWrap = true
        this.labelTitle.style.fontStyle = 'italic'
        this.labelTitle.style.wordWrapWidth = width
        this.labelTitle.style.fontSize = 14
        this.labelTitle.anchor.set(0.5)
        this.labelTitle.y = 25 / 2

        this.offset = { x: 0, y: 0 }

        // let zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0,0,10)
        // this.addChild(zero)

        this.cardContainer.x = -width / 2
        this.cardContainer.pivot.y = height

        this.cardContentContnainer.x = -width / 2
        this.cardContentContnainer.pivot.y = height
        this.safeShape.x = -width / 2
        this.safeShape.pivot.y = height


        this.state = 0;

        this.smallFontSize = 12
        this.largeFontSize = 16

    }
    resetPivot() {
        this.cardContainer.x = 0
        this.cardContainer.pivot.y = 0
        this.cardContentContnainer.x = 0
        this.cardContentContnainer.pivot.y = 0

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
    getIdByType(type) {
        switch (type) {
            case EntityData.EntityDataType.Weapon:
                return 3
            case EntityData.EntityDataType.Companion:
                return 0

            case EntityData.EntityDataType.Attribute:
                return 5

            case EntityData.EntityDataType.Acessory:
                return 2
        }
        return 1
    }
    setData(cardData) {
        if (this.cardData == cardData) {
            return;
        }
        this.cardData = cardData;
        let cardID = this.getIdByType(cardData.entityData.type)
        this.cardBorder.texture = PIXI.Texture.from(this.textures[cardID]);
        this.updateTexture(cardData.entityData.icon)
        this.cardImage.scale.set(Utils.scaleToFit(this.cardImage, 180))
        this.labelTitle.text = cardData.entityData.name

        if (this.cardData.entityData.description) {
            this.setDescription(this.cardData.entityData.description);
        }
    }
    setDescription(label) {
        if (this.labelDescription) {
            this.labelDescription.text = label;
        } else {
            this.labelDescription = new PIXI.Text(label, window.LABELS.LABEL1)
        }
        this.labelDescription.style.fill = 0xffffff
        this.labelDescription.style.strokeThickness = 1
        this.labelDescription.style.wordWrap = true
        this.labelDescription.style.fontSize = 12
        this.labelDescription.anchor.set(0.5, 0)
        this.labelDescription.x = 0
        this.labelDescription.y = 20

    }
    show(order) {

        this.animation = true;
        this.cardContentContnainer.alpha = 0;

        this.cardIconContainer.y = this.cardBorder.height / 2
        let targetScale = Utils.scaleToFit(this.cardIconContainer, 80)
        this.cardIconContainer.scale.set(targetScale * 2, 0);
        TweenLite.to(this.cardIconContainer.scale, 1, { delay: order * 0.2 + 0.2, x: targetScale, y: targetScale, ease: Elastic.easeOut })
        TweenLite.to(this.cardIconContainer, 0.3, { delay: order * 0.2 + 0.3, y: 50, ease: Back.easeOut })


        this.cardContentContnainer.y = -150
        TweenLite.to(this.cardContentContnainer, 0.75, { delay: order * 0.2 + 0.3, alpha: 1, y: 0, ease: Elastic.easeOut })

        TweenLite.to(this.offset, 0.3, { delay: order * 0.2 + 0.3, y: 0, ease: Back.easeOut })

        this.cardBorder.height = 100
        TweenLite.to(this.cardBorder, 0.3, { delay: order * 0.2 + 0.3, height: this.baseHeight, ease: Back.easeOut })

        //this.cardIconContainer.y = 50

        setTimeout(() => {
            this.animation = false;
        }, (order * 0.2 + 1) * 1000);

    }
    update(delta) {
        if (!this.animation) {

            this.cardContainer.y = Utils.lerp(this.cardContainer.y, this.offset.y, 0.3);
            this.cardContentContnainer.y = Utils.lerp(this.cardContentContnainer.y, this.offset.y, 0.3);

            if (this.mouseOver && this.state != 1) {
                this.offset.y = -20
            } else {
                this.offset.y = 0
            }
        }

        this.labelTitle.style.fontSize = this.smallFontSize

        this.cardIconContainer.x = this.cardBorder.width / 2

        this.safeShape.pivot.y = this.baseHeight
        this.cardContainer.pivot.y = this.baseHeight
        this.cardContentContnainer.pivot.y = this.baseHeight

        this.margin = 20

        this.cardBackground.x = this.cardBorder.x
        this.cardBackground.width = this.cardBorder.width - 10
        this.cardBackground.height = this.cardBorder.height - 10

        this.titleBox.width = this.cardBorder.width
        this.titleBox.pivot.x = this.titleBox.width / 2
        this.titleBox.x = this.cardBorder.x + this.cardBorder.width / 2
        this.titleBox.y = 110


        this.labelTitle.x = this.titleBox.width / 2
        this.labelTitle.style.wordWrapWidth = this.cardBorder.width - 20


    }
}