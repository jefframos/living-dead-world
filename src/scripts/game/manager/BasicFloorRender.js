import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import Player from "../entity/Player";
import RenderModule from "../core/modules/RenderModule";

export default class BasicFloorRender extends GameObject {

    constructor() {
        super()
        this.gameView = new GameView();

        // this.backShape = new PIXI.Graphics().beginFill(0x785F5E).drawRect(-5000,-5000,10000,10000)
        // this.gameView.view = new PIXI.Container();
        // this.gameView.view.addChild(this.backShape)

        this.gameView.view = new PIXI.TilingSprite(PIXI.Texture.from('floor_5'), 32, 32);
        this.gameView.view.anchor.set(0.5)
        this.gameView.view.tileScale.set(1.5)
        this.tileSize = 128 * this.gameView.view.tileScale.x;
        this.gameView.view.width = this.tileSize * 10
        this.gameView.view.height = this.tileSize * 10
        this.gameView.view.alpha = 1//0//.3
        this.gameView.view.tint = 0x666666//0//.3

        this.gameView.layer = RenderModule.RenderLayers.Base;
        this.playerTileID = { i: 0, j: 0 }
    }
    start() {
    }
    update(delta) {

        if(!Player.MainPlayer) return;
        this.playerTileID.i = Math.floor(Player.MainPlayer.transform.position.x / this.tileSize)
        this.playerTileID.j = Math.floor(Player.MainPlayer.transform.position.z / this.tileSize)

        this.gameView.view.x = this.playerTileID.i * this.tileSize
        this.gameView.view.y = this.playerTileID.j * this.tileSize
    }

    lateUpdate(delta) {
        super.lateUpdate(delta);
        this.gameView.view.zIndex = -99999999999
    }
}