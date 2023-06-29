import * as PIXI from 'pixi.js';

import Game from '../../Game';
import GameObject from './gameObject/GameObject';
import Vector3 from './gameObject/Vector3';

export default class Camera extends GameObject {
    static _instance = null;
    static get instance() {
        if (!Camera._instance) {
            Camera._instance = this;
        }
        return Camera._instance;
    }
    static ViewportSize = {
        width: 1000,
        height: 1000,
        min: 0,
        max: 1000
    }
    constructor() {
        super()
        this.zoom = 1;
        this.targetZoom = Game.Debug.zoom || 0.75;
        this.followPoint = new Vector3();
    }
    update(delta) {
        super.update(delta);

        Camera.ViewportSize.width = Game.Borders.width / (this.zoom * Game.GlobalScale.x)
        Camera.ViewportSize.height = Game.Borders.height / (this.zoom * Game.GlobalScale.y)
        Camera.ViewportSize.min = Math.min(Game.Borders.width, Game.Borders.height)
        Camera.ViewportSize.max = Math.max(Game.Borders.width, Game.Borders.height)

    }
}