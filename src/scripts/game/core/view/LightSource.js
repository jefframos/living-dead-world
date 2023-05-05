import * as PIXI from 'pixi.js';

import GameView from './GameView';
import Vector3 from '../gameObject/Vector3';

export default class LightSource extends GameView {
    constructor(gameObject) {
        super(gameObject);
        this.view = new PIXI.Sprite.from('small-blur')
        this.setRadius(100)    
        this.view.anchor.set(0.5)
        this.view.blendMode = PIXI.BLEND_MODES.OVERLAY
    }
    setRadius(radius){
        this.radius = radius;
        this.minDistance = this.radius
        this.maxDistance = this.radius * 1.5 
        this.view.width = radius * 2
        this.view.height = radius * 1.5

        console.log(this.minDistance)
    }
    setColor(color= 0xFFFED9, intensity = 0.5){
        this.view.tint = color
        this.view.alpha = intensity
    }
   
    update(delta) {
        super.update(delta);        
    }
    onRender() {
        super.onRender();
       
    }
}