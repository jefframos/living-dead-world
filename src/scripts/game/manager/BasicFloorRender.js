import GameObject from "../core/GameObject";
import GameView from "../core/GameView";
import Player from "../entity/Player";
import RenderModule from "../modules/RenderModule";
import WorldManager from "./WorldManager";

export default class BasicFloorRender extends GameObject {
    static instance;

    constructor() {
        super()
        this.gameView = new GameView();
        this.gameView.view = new PIXI.TilingSprite(PIXI.Texture.from('grass'), 45, 45);
        this.gameView.view.anchor.set(0.5)
        this.gameView.view.tileScale.set(2)
        this.gameView.view.width = 5000
        this.gameView.view.height = 5000

        this.tileSize = 45 * this.gameView.view.tileScale.x;
        this.gameView.layer = RenderModule.RenderLayers.Base;       
        this.playerTileID = { i: 0, j: 0 }
    }
    start() {
        this.player = this.engine.findByType(Player)
    }
    update(delta) {
        this.playerTileID.i = Math.floor(this.player.transform.position.x / this.tileSize)
        this.playerTileID.j = Math.floor(this.player.transform.position.y / this.tileSize)
        this.gameView.view.x = this.playerTileID.i * this.tileSize
        this.gameView.view.y = this.playerTileID.j * this.tileSize

       
    }
}