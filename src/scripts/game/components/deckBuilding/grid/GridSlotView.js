import * as PIXI from 'pixi.js';

import InteractableView from '../../../view/card/InteractableView';
import Utils from '../../../core/utils/Utils';
import signals from 'signals';

export default class GridSlotView extends PIXI.Container {
    constructor(width = 100, height = 100) {
        super()

        let texture = 'square_0006'

        this.container = new PIXI.Container();
        this.addChild(this.container)

        this.cardBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.container.addChild(this.cardBackground);
        this.cardBackground.width = width
        this.cardBackground.height = height
        this.cardBackground.alpha = 0.3

        this.onMouseEnter = new signals.Signal();
        this.onMouseOut = new signals.Signal();


        this.cardImage = new PIXI.Sprite();
        this.container.addChild(this.cardImage);
        this.cardImage.anchor.set(0.5)
        this.cardImage.x = width / 2
        this.cardImage.y = height / 2

        // InteractableView.addMouseEnter(this, () => {
        //     console.log("ENTER")
        //     this.onMouseEnter.dispatch(this);
        //     this.mouseOver();
        // })
        
        // InteractableView.addMouseMove(this, () => {
        // })

        // InteractableView.addMouseOut(this, () => {
        //     console.log("OUT")
            
        //     this.onMouseOut.dispatch(this);
        //     this.mouseOut();
            
        // })
    }
    mouseOver(){
        this.cardBackground.alpha = 0.5
        
    }
    mouseOut(){
      this.cardBackground.alpha = 0.3

  }
    updateTexture(textureID) {
        this.cardImage.texture = PIXI.Texture.from(textureID)
    }

    setData(cardData) {
        this.cardData = cardData;
        this.updateTexture(cardData.icon)
        this.cardImage.scale.set(Utils.scaleToFit(this.cardImage, 60))
    }
}