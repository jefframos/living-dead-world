import BaseButton from "./BaseButton";

export default class ColorButton extends BaseButton {
    constructor(texture = 'square_0006', width = 100, height = 150) {
        super(texture, width, height)
        this.setActiveTexture('square_0001')
        this.setColors(0xFFFFFF,0xFFFFFF);
        this.color = 0;

    }
    setColor(mainColor) {
        this.addIcon('white-circle',30);
        this.color = mainColor;
        this.icon.tint = mainColor;
    }

    setColors(base = 0xFFFFFF, over = 0xFF0000, baseText = 0, overText = 0xFFFFFF) {
        this.baseColor = base
        this.overColor = over

        this.baseColorText = baseText
        this.overColorText = overText

        this.tint = this.baseColor;
        this.textTint = this.baseColorText;
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