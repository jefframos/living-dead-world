import * as PIXI from 'pixi.js';

import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import Player from './Player';
import RenderModule from "../core/modules/RenderModule";
import Utils from '../core/utils/Utils';
import Vector3 from '../core/gameObject/Vector3';

export default class Collectable extends GameObject {
    constructor() {
        super();

        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.RenderLayers.Base;
        this.gameView.view = new PIXI.Sprite.from("icon_increase")

        this.gameView.view.scale.set(Utils.scaleToFit(this.gameView.view, 5))

    }
    start() {
        super.start();
        this.player = this.engine.findByType(Player)
    }
    update(delta) {
        super.update(delta)
        if(!this.player){
            return;
        }
        if (Vector3.distance(this.transform.position, this.player.transform.position) < 50) {
            this.player.sessionData.addXp(1)
            this.destroy()
        }
    }
}