import * as PIXI from 'pixi.js';

export default class CardView extends PIXI.Container {
    constructor(texture = 'square_0006', width = 100, height = 150) {
        super()
        
        this.cardBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.addChild(this.cardBackground);
        this.cardBackground.width = width
        this.cardBackground.height = height

        this.cardImage = new PIXI.Sprite();

        this.addChild(this.cardImage);
        this.cardImage.anchor.set(0.5)
        this.cardImage.scale.set(0.5)
        this.cardImage.x = width / 2
        this.cardImage.y = height / 2

    }

    updateTexture(textureID) {
        this.cardImage.texture = PIXI.Texture.from(textureID)
    }

}