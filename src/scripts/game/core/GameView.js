import * as PIXI from 'pixi.js';
import RenderModule from '../modules/RenderModule';

export default class GameView{
    constructor(gameObject){
        this.layer = RenderModule.RenderLayers.Gameplay
        this.view = null;
        this.gameObject = gameObject;
        this.anchorOffset = 0;
    }
    update(delta){
        if(this.view){
            this.view.x = this.gameObject.transform.position.x
            this.view.y = this.gameObject.transform.position.y


            // if (this.gameObject.physics.magnitude > 0) {
            //     this.anchorOffset += delta * 10;
            //     this.anchorOffset %= Math.PI
            // } else {
            //     this.anchorOffset = utils.lerp(this.anchorOffset, 0, 0.5)
            // }
            //  this.view.anchor.y = 1 + Math.sin(this.anchorOffset) * 0.5
    
        }
    }
}