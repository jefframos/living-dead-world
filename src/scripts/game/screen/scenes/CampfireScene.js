import * as PIXI from 'pixi.js';

import BaseScene from './BaseScene';
import Game from '../../../Game';

export default class CampfireScene extends BaseScene {
    constructor() {
        super();

        this.sceneSetup.assets = [
            BaseScene.makeAssetSetup({ src: 'pine-1', position: { x: -210, y: -175 }, anchor: { x: 0.5, y: 0.9 }, tint:0x888888 }),
            BaseScene.makeAssetSetup({ src: 'pine-2', position: { x: 210, y: -175 }, anchor: { x: 0.5, y: 0.9 }, tint:0x888888 }),
            BaseScene.makeAssetSetup({ src: 'tree-2', position: { x: 0, y: -195 }, anchor: { x: 0.5, y: 0.9 }, tint:0x666666 }),
            BaseScene.makeAssetSetup({ src: 'container', position: { x: -280, y: -65 }, anchor: { x: 0.5, y: 0.9 } }),
            BaseScene.makeAssetSetup({ src: 'log-sit', position: { x: -180, y: -60 }, anchor: { x: 0.5, y: 0.5 } }),
            BaseScene.makeAssetSetup({ src: 'flag', position: { x: -400, y: -145 }, anchor: { x: 0.5, y: 0.5 } }),
            BaseScene.makeAssetSetup({ src: 'barrel1', position: { x: 0, y: 0 }, anchor: { x: 0.5, y: 0.9 } }),
            BaseScene.makeAssetSetup({ src: 'tent', position: { x: 150, y: -90 }, anchor: { x: 0.5, y: 0.9 } }),
            BaseScene.makeAssetSetup({ src: 'stool', position: { x: 145, y: 0 }, anchor: { x: 0.5, y: 0.9 } }),
            BaseScene.makeAssetSetup({ src: 'bottle', position: { x: 176, y: 10 }, anchor: { x: 0.5, y: 0.9 } }),
            BaseScene.makeAssetSetup({ src: 'barrel2', position: { x: 290, y: -55 }, anchor: { x: 0.5, y: 0.9 } }),
            BaseScene.makeAssetSetup({ src: 'campfire-fire00', position: { x: -5, y: -105 },scale:{x:1,y:0.8}, anchor: { x: 0.5, y: 0.9 }, 
            animation:{
                enabled:true,
                start:1,
                end:8
            }}),
        ]


    }
    beforeBuild() {
        this.middle = new PIXI.Graphics().beginFill(0x2B4159).drawCircle(0, 0, 500)
        this.sceneContainer.addChild(this.middle);
    
        this.campfireLight = new PIXI.Sprite.from('campfire-light')
        this.campfireLight.anchor.set(0.5)
        this.campfireLight.blendMode = PIXI.BLEND_MODES.ADD
        this.campfireLight.alpha = 0.3
        this.sceneContainer.addChild(this.campfireLight);
        this.lightFlickerTime = 0;

        this.grassTopContainer = new PIXI.Container();
        this.sceneContainer.addChild(this.grassTopContainer);

        // this.grassTopLeft = new PIXI.Sprite.from('grasspatch-top')
        // this.grassTopLeft.anchor.set(1, 0.5)        
        // this.grassTopLeft.tint = 0
        // this.grassTopContainer.addChild(this.grassTopLeft);

        // this.grassTopRight = new PIXI.Sprite.from('grasspatch-top')
        // this.grassTopRight.anchor.set(0, 0.5)        
        // this.grassTopRight.scale.x = -1;
        // this.grassTopRight.x = this.grassTopRight.width
        // this.grassTopRight.tint = 0
        // this.grassTopContainer.addChild(this.grassTopRight);
        

        this.patchesColor = 0x213143;

        this.grassTopLeft = new PIXI.NineSlicePlane(PIXI.Texture.from('grasspatch-top'), 2, 5, 520,5);
        this.grassTopLeft.tint = this.patchesColor
        this.grassTopContainer.addChild(this.grassTopLeft);
        this.grassTopLeft.width = 5000
        this.grassTopLeft.pivot.set(this.grassTopLeft.width, this.grassTopLeft.height / 2)      
        
        
        this.grassTopRight = new PIXI.NineSlicePlane(PIXI.Texture.from('grasspatch-top'), 2, 5, 520,5);
        this.grassTopRight.tint = this.patchesColor
        this.grassTopRight.scale.x = -1;

        this.grassTopContainer.addChild(this.grassTopRight);
        this.grassTopRight.width = 5000
        this.grassTopRight.pivot.set(this.grassTopRight.width, this.grassTopRight.height / 2)        

        this.grassTopRight.y = -2
        this.grassTopRight.y = -2

        this.topPatch = new PIXI.Sprite.from('tile')
        this.topPatch.anchor.set(0.5,1)
        this.topPatch.y = -this.grassTopRight.height / 2
        this.topPatch.tint = this.patchesColor
        this.topPatch.width = 5000
        this.topPatch.height = 5000
        this.grassTopContainer.addChild(this.topPatch);
        
        this.bottomPatch = new PIXI.Sprite.from('tile')
        this.bottomPatch.anchor.set(0.5,0)
        this.bottomPatch.y = this.grassTopRight.height / 2 - 5
        this.bottomPatch.tint = this.patchesColor
        this.bottomPatch.width = 5000
        this.bottomPatch.height = 5000
        this.grassTopContainer.addChild(this.bottomPatch);


        // this.topPatch = new PIXI.Sprite.from('tile')
        // this.topPatch.anchor.set(0.5,1)
        // this.topPatch.y = -this.grassTopRight.height / 2
        // this.grassTopContainer.addChild(this.topPatch);

        //this.grassTopContainer.scale.set(0.9)

        this.campfireLightTop = new PIXI.Sprite.from('campfire-light')
        this.campfireLightTop.anchor.set(0.5)
        this.campfireLightTop.blendMode = PIXI.BLEND_MODES.ADD
        this.campfireLightTop.alpha = 0.3
        this.sceneContainer.addChild(this.campfireLightTop);
        
        
    }
    afterBuild() {

       
    }
    update(delta){
        super.update(delta);

        if(this.lightFlickerTime <= 0){

            this.campfireLight.alpha = Math.random() * 0.05 + 0.2
            this.campfireLight.scale.set(1.5 + Math.random() * 0.05)

            this.campfireLightTop.alpha = Math.random() * 0.05 + 0.2
            this.campfireLightTop.scale.set(1 + Math.random() * 0.05)

            this.lightFlickerTime = Math.random() * 0.2 + 0.1

        }else{
            this.lightFlickerTime -= delta;
        }

    }
}