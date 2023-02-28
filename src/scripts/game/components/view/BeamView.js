import * as PIXI from 'pixi.js';

import EffectsManager from '../../manager/EffectsManager';
import Utils from '../../core/utils/Utils';

export default class BeamView extends PIXI.Sprite {
    constructor() {
        super();

        this.startShape = new PIXI.Sprite.from('beamBase')
        this.endShape = new PIXI.Sprite.from('endBeam')
        this.base = new PIXI.Sprite.from('shadow')

        //this.tiledTexture = new PIXI.TilingSprite(PIXI.Texture.from('beam'))
        this.tiledTexture = new PIXI.TilingSprite(PIXI.Texture.from('laserBeam2'))

        //this.addChild(this.base)
        this.addChild(this.tiledTexture)
        //this.addChild(this.startShape)
        //this.addChild(this.endShape)

        this.startShape.anchor.set(0.5)
        this.endShape.anchor.set(0.5)
        this.tiledTexture.anchor.set(0.5, 0.5)

        this.startShape.tint = 0xFF0000
        this.endShape.tint = 0xFF0000
        this.tiledTexture.tint = 0x00FFFF
         //this.startShape.alpha = 0.1
         //this.endShape.alpha = 0.1
         //this.tiledTexture.alpha = 0.5
    }
    fromTo(positionStart, distance, positionEnd){
        this.startShape.y = 0
        
        this.endShape.x = distance
        this.endShape.y = 0
        
        
        this.tiledTexture.tileScale.set( this.beamHeight / 64)
        this.tiledTexture.width = this.beamWidth * 2 - 50*this.tiledTexture.tileScale.y
        this.tiledTexture.height =  this.beamHeight    
        this.tiledTexture.x = 50*this.tiledTexture.tileScale.y + 10
        
        this.startShape.x = -distance +  50*this.tiledTexture.tileScale.y
        if(this.beamHeight){
            this.startShape.scale.set(Utils.scaleToFit(this.startShape, this.beamHeight))
            this.endShape.scale.set(this.startShape.scale.x)
        }
    }
    build(width, height){

        this.beamWidth = width
        this.beamHeight = height
        return

        this.startShape.x = -width / 2 + 30   

        
        this.endShape.x = width / 2

        if(height){

            this.startShape.scale.set(Utils.scaleToFit(this.startShape, height))
            this.endShape.scale.set(this.startShape.scale.x)
        }


        this.tiledTexture.width = width * 2 - 80
        this.tiledTexture.height = height* 2     
        this.tiledTexture.x = 0

        this.tiledTexture.scale.set( height / 64)
    }
    update(delta){
        this.tiledTexture.tilePosition.x += delta * 300;
        this.tiledTexture.tilePosition.x %= 64;
        this.tiledTexture.tilePosition.y = -2;


    }
}