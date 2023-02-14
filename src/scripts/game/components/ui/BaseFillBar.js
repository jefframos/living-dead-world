import BaseComponent from "../../core/gameObject/BaseComponent";
import Color from "../../core/utils/Color";
import GameObject from "../../core/gameObject/GameObject";
import GameView from "../../core/view/GameView";
import RenderModule from "../../core/modules/RenderModule";
import Utils from "../../core/utils/Utils";

export default class BaseFillBar extends GameObject {
    constructor() {
        super();
        this.intensity = 0;

        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.RenderLayers.FrontLayer
        //this.filter = new PIXI.filters.ColorMatrixFilter();

        this.flashTime = 0.3;
        this.flashCurrentTime = 0;

        this.currentRGB = { r: 0, g: 0, b: 0 }


        this.startValue = Color.toRGB(0x8636f0);
        this.endValue = Color.toRGB(0xFF0000);


        this.gameView.view = new PIXI.Container();
        this.barContainer = new PIXI.Container();
        this.gameView.view.addChild(this.barContainer)
        this.barContainer.y = -50


        this.backBar = new PIXI.NineSlicePlane(PIXI.Texture.from('tile'), 5, 5, 5, 5);
        this.backBar.width = 50
        this.backBar.height = 10
        this.backBar.tint = 0;
        this.barContainer.addChild(this.backBar);

        this.fillBar = new PIXI.NineSlicePlane(PIXI.Texture.from('tile'), 5, 5, 5, 5);
        this.fillBar.width = 50
        this.fillBar.height = 10
        this.fillBar.tint = Color.rgbToColor(this.startValue);
        this.barContainer.addChild(this.fillBar);

        this.maxWidth = 50
        this.maxHeight = 10
    }

    build(width = 50, height = 10, border = 1) {
        super.build();
        this.maxWidth = width
        this.maxHeight = height

        this.backBar.width = width + border*2
        this.backBar.height = height + border*2

        this.backBar.x = -border
        this.backBar.y = -border

        this.fillBar.width = width
        this.fillBar.height = height

        this.barContainer.x = -width / 2 - border;

        this.currentRGB = { r: this.startValue.r, g: this.startValue.g, b: this.startValue.b }
        this.barNormal = 1;
        this.fillBar.tint = Color.rgbToColor(this.startValue);
    }
    destroy() {
        super.destroy();
    }


    update(delta, unscaled) {
        super.update(delta, unscaled);


        Color.colorLerp(this.currentRGB, this.endValue, this.startValue, this.barNormal);


        this.fillBar.width = Utils.lerp(this.fillBar.width, this.maxWidth * this.barNormal, 0.5);

        this.fillBar.tint = Color.rgbToColor(this.currentRGB);

        this.transform.position.copy(this.parent.transform.position)
    }

    set normal(value){
        this.barNormal = value;
    }
}