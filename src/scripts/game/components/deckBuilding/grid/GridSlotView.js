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

        this.text = new PIXI.Text('')
        this.container.addChild(this.text)
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
    holding(){
        this.cardImage.alpha = 0.1
    }
    release(){
        this.cardImage.alpha = 1
    }
    mouseOver() {
        this.cardBackground.alpha = 0.5

        
    }
    mouseOut() {
        this.cardBackground.alpha = 0.3

    }
    wipe() {
        this.cardData = null;
        this.cardImage.texture = null
        this.text.text = "";
    }
    updateTexture(textureID) {
        this.cardImage.texture = PIXI.Texture.from(textureID)
        this.cardImage.scale.set(Utils.scaleToFit(this.cardImage, 60))        
    }

    setData(cardData) {        
        this.cardData = cardData.item;
        if(this.cardData){
            this.updateTexture(this.cardData.entityData.icon)
            this.text.text = "Level "+(cardData.level+1)
        }

    }
    update(){
        // this.text.text = Math.floor(this.worldTransform.tx)+'\n'+this.x+'\n'+ Math.floor(this.worldTransform.tx / this.worldTransform.a)
        // this.text.style.fontSize = 14
        // this.text.style.fill = 0xFFFFFF
    }
}