import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import Player from "../entity/Player";
import RenderModule from "../core/modules/RenderModule";
import WorldManager from "./WorldManager";

export default class BasicFloorRender extends GameObject {
    static instance;

    constructor() {
        super()
        this.gameView = new GameView();
        this.gameView.view = new PIXI.TilingSprite(PIXI.Texture.from('grass'), 128, 128);
        this.gameView.view.anchor.set(0.5)
        this.gameView.view.tileScale.set(1.5)
        this.gameView.view.width = 5000
        this.gameView.view.height = 5000

        this.tileSize = 128 * this.gameView.view.tileScale.x;
        this.gameView.layer = RenderModule.RenderLayers.Base;       
        this.playerTileID = { i: 0, j: 0 }
    }
    start() {
    }
    update(delta) {
        
        this.playerTileID.i = Math.floor(Player.MainPlayer.transform.position.x / this.tileSize)
        this.playerTileID.j = Math.floor(Player.MainPlayer.transform.position.y / this.tileSize)
        this.gameView.view.x = this.playerTileID.i * this.tileSize
        this.gameView.view.y = this.playerTileID.j * this.tileSize
    }
}