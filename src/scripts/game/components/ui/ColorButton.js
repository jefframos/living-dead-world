import BaseButton from "./BaseButton";

export default class ColorButton extends BaseButton {
    constructor(texture = 'square_0006', width = 100, height = 150) {
        super(texture, width, height)
        this.setColors();
    }
   
    setColors(base = 0xFFFFFF, over = 0xFF0000, baseText = 0, overText = 0xFFFFFF) {
        this.baseColor = base
        this.overColor = over

        this.baseColorText = baseText
        this.overColorText = overText

        this.tint = this.baseColor;
        this.textTint = this.baseColorText;
    }
    addShape(texture, width, height) {
        if(this.safeShape){
            this.safeShape.texture = PIXI.Texture.from(texture)
        }else{
            this.safeShape = new PIXI.Sprite.from(texture);
            this.addChild(this.safeShape);
        }
        this.safeShape.width = width
        this.safeShape.height = height
        this.hitArea = new PIXI.Rectangle(0, 0, width, height);
    }
    over() {
        super.over();
        this.tint = this.overColor;
        this.textTint = this.overColorText;
    }
    out() {
        super.out();
        this.tint = this.baseColor;
        this.textTint = this.baseColorText;
    }
}