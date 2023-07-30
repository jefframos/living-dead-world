import * as PIXI from 'pixi.js';

import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import Player from './Player';
import RenderModule from "../core/modules/RenderModule";
import Shadow from '../components/view/Shadow';
import Utils from '../core/utils/Utils';
import Vector3 from '../core/gameObject/Vector3';

export default class Collectable extends GameObject {
    constructor() {
        super();

        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.RenderLayers.Base;
        this.gameView.view = new PIXI.Sprite.from("pickup0001")
        this.gameView.view.anchor.set(0.5,1)
        this.gameView.view.scale.set(Utils.scaleToFit(this.gameView.view, 30))

    }
    setType() { }
   
    start() {
        super.start();
        this.player = this.engine.findByType(Player)
        this.lerpTime = 0.35;
        this.currentLerp = 0;
        this.attracting = false;
        this.setCollectableTexture();
    }
    update(delta) {
        super.update(delta)
        if (!this.player) {
            return;
            this.destroy()
        }
        if (this.attracting) {
            this.currentLerp += delta;

            if (this.currentLerp >= this.lerpTime * 0.5) {
                this.collectCallback();
                this.destroy()
            } else {
                this.transform.position = Vector3.lerp(this.transform.position, Vector3.sum(this.player.transform.position, new Vector3(0, -20, 0)), this.currentLerp / this.lerpTime)
            }
        }
        if (Vector3.distance(this.transform.position, this.player.transform.position) < (this.player.collectRadius + 5)) {
            this.attracting = true;
        }
    }
    setCollectableTexture() {
        this.gameView.view.texture = PIXI.Texture.from("pickup000" + Math.ceil(Math.random() * 5))
    }
    collectCallback() {
        this.player.sessionData.addXp(1)

    }
}