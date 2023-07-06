import * as PIXI from 'pixi.js';

import MainMenu from '../../../screen/MainMenu';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';

export default class ShopCard extends PIXI.Container {
    constructor(callback, videoCallback, texture = UIUtils.baseButtonTexture + '_0006', width = 100, height = 150, title = '-', hasVideo = true) {
        super()

        this.safeShape = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 25, 25, 25, 25);
        this.safeShape.width = width
        this.safeShape.height = height
        this.addChild(this.safeShape);


        this.titleBox = new PIXI.NineSlicePlane(PIXI.Texture.from('tile'), 0, 0, 0, 0);
        this.addChild(this.titleBox);
        this.titleBox.width = width + 10
        this.titleBox.height = 37
        this.titleBox.x = -10
        this.titleBox.y = 25
        this.titleBox.alpha = 0.5
        this.titleBox.blendMode = PIXI.BLEND_MODES.OVERLAY


        this.labelTitle = new PIXI.Text(title, window.LABELS.LABEL1)
        this.addChild(this.labelTitle);
        this.labelTitle.style.fill = 0xFFFFFF
        this.labelTitle.style.wordWrap = true
        this.labelTitle.style.fontSize = 20
        this.labelTitle.anchor.set(0.5)

        this.iconSprite = new PIXI.Sprite();
        this.iconSprite.anchor.set(0.5)
        this.addChild(this.iconSprite);
        
        this.buttonsList = new UIList();
        this.buttonsList.h = 50
        this.buttonsList.w = 50
        
        
        this.videoButton = UIUtils.getPrimaryLabelButton((button) => {
            videoCallback();
        }, '', UIUtils.getIconUIIcon('video'))

        this.videoButton.updateBackTexture(UIUtils.baseButtonTexture + '_0002')
        
        if(hasVideo){
            this.buttonsList.addElement(this.videoButton, { fitWidth:0.9, listScl:0.3})
        }
        
        
        this.confirmButton = UIUtils.getPrimaryLabelButton((button) => {
            callback();
        }, title)
        

        if(hasVideo){

            this.buttonsList.addElement(this.confirmButton, { fitWidth:0.9,listScl: 0.7})
        }else{
            this.buttonsList.addElement(this.confirmButton, { fitHeight:1,listScl:1})

        }


        this.buttonsList.updateHorizontalList();
        this.addChild(this.buttonsList);
    }
    updateButtonTitle(title){
        this.confirmButton.text.text = title;
        this.confirmButton.fitLabel(1)
    }
    setIcon(texture, addScale = 0){
        this.addIconScale = addScale;
        this.iconSprite.texture = PIXI.Texture.from(texture);
    }
    resize(width, height) {
        this.safeShape.width = width
        this.safeShape.height = height
        
        this.titleBox.height = Math.min(40, height * 0.15)

        this.labelTitle.style.wordWrapWidth = width
        this.titleBox.width = width - 20
        this.titleBox.x = 10
        this.labelTitle.y = this.titleBox.y + this.titleBox.height / 2
        this.labelTitle.x = this.titleBox.x + this.titleBox.width / 2

        this.iconSprite.x = width / 2
        this.iconSprite.y = height / 2

        if(width < height){

            this.iconSprite.scale.set(Utils.scaleToFit(this.iconSprite,width * (0.6 + this.addIconScale)))
        }else{
            this.iconSprite.scale.set(Utils.scaleToFit(this.iconSprite, height * (0.4 + this.addIconScale)))
            this.iconSprite.y = height / 2

        }

        this.buttonsList.w = width - 30
        this.videoButton.resize((this.buttonsList.w * 0.3)*1.5-5, this.buttonsList.h*1.5-5)
        this.videoButton.resizeIcon( this.buttonsList.h * 0.8)
        this.confirmButton.resize((this.buttonsList.w * 0.7)*1.5-5-5, this.buttonsList.h*1.5-5)
        
        this.buttonsList.h = height * 0.2
        
        this.buttonsList.updateHorizontalList();
        this.buttonsList.x = width / 2 - this.buttonsList.w/2
        this.buttonsList.y = height - this.buttonsList.h - 15

    }
}