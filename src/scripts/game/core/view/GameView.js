import * as PIXI from 'pixi.js';

import RenderModule from '../modules/RenderModule';

export default class GameView {
    constructor(gameObject) {
        this.layer = RenderModule.RenderLayers.Gameplay
        this.viewOffset = { x: 0, y: 0 }
        this.view = null;
        this.gameObject = gameObject;
        this.anchorOffset = 0;
    }
    get x(){
        return this.view.x
    }
    get y(){
        return this.view.y
    }
    update(delta) {
    }
}