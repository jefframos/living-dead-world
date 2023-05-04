import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import Player from "../entity/Player";
import RenderModule from "../core/modules/RenderModule";

export default class PlayerHalo extends GameObject {

    constructor() {
        super()
        this.gameView = new GameView();

        // this.backShape = new PIXI.Graphics().beginFill(0x785F5E).drawRect(-5000,-5000,10000,10000)
        // this.gameView.view = new PIXI.Container();
        // this.gameView.view.addChild(this.backShape)

        this.gameView.view = new PIXI.Container()
        this.layerBlur = new PIXI.Sprite.from('small-blur')
        this.gameView.view.addChild(this.layerBlur)
        this.layerBlur.width = 600
        this.layerBlur.height = 450
        this.layerBlur.alpha = 0.5
        this.layerBlur.tint = 0xFFFED9
        this.layerBlur.anchor.set(0.5)
        this.layerBlur.blendMode = PIXI.BLEND_MODES.COLOR_DODGE
        this.gameView.layer = RenderModule.RenderLayers.Base;
        this.playerTileID = { i: 0, j: 0 }
    }
    start() {
    }
    update(delta) {
        this.gameView.view.x = this.parent.gameObject.gameView.x
        this.gameView.view.y = this.parent.gameObject.gameView.y - this.parent.gameObject.transform.position.y
    }

    lateUpdate(delta) {
        super.lateUpdate(delta);
        this.gameView.view.zIndex = -1
    }
}