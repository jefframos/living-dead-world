import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import config from '../../config';


export default class ScreenTransition extends PIXI.Container {
    constructor() {
        super();
        this.container = new PIXI.Container();

        this.addChild(this.container)
        

        this.screenCover = new PIXI.Graphics().beginFill(0x3B296D).drawRect(-5000,0,10000,config.height * 1.5)
        this.container.addChild(this.screenCover)
        this.screenCover.interactive = true;
        this.screenCover.alpha = 0;

        this.shapeCover1 = new PIXI.NineSlicePlane(
            PIXI.Texture.from('progressBarSmall'), 10, 10, 10, 10)
        this.shapeCover1.tint = 0x3B296D
        this.container.addChild(this.shapeCover1)
        this.shapeCover1.height = config.height * 2
        this.shapeCover1.width = config.width * 10
        this.shapeCover1.pivot.x = this.shapeCover1.width/2


        
        // this.tiledBackground = new PIXI.TilingSprite(PIXI.Texture.from('patter-square', 256, 256))
		// this.shapeCover1.addChild(this.tiledBackground);
		// this.tiledBackground.width = this.shapeCover1.width
		// this.tiledBackground.height = this.shapeCover1.height
        // this.tiledBackground.alpha = 0


        this.logo = new PIXI.Sprite.from('logoTransparent')
        this.logo.anchor.set(0.5)

        this.container.addChild(this.logo)

        this.logo.x = 0
        this.logo.y = config.height / 2
        this.logo.visible = false;

        // this.center = new PIXI.Graphics().beginFill(0xFF296D).drawCircle(0,0,20)
        // this.container.addChild(this.center)
    }
    startTransitionIn(delay = 0, callback, color){
        this.shapeCover1.tint = color
        this.container.visible = true;
        this.screenCover.interactive = true;
        this.shapeCover1.y = config.height * 1.5
        this.shapeCover1.alpha = 1;
        
        //TweenMax.to(this.tiledBackground, 1, {delay:delay+0.1, alpha:0.15});
        this.logo.visible = true;

        setTimeout(() => {
            
            this.transitionIn(0, callback);
        }, delay * 1000);


    }
    transitionIn(delay, callback){

        SOUND_MANAGER.play('shoosh', 0.4)

        this.logo.scale.set(0,1.5)
        this.logo.rotation = - Math.PI / 4
        TweenMax.to(this.logo, 1, {delay:delay+0.4,rotation:0,ease:Elastic.easeOut});
        TweenMax.to(this.logo.scale, 0.6, {delay:delay+0.4,y:1, x:1,ease:Elastic.easeOut});
        TweenMax.to(this.shapeCover1, 0.7, {delay,y:0,ease:Cubic.easeOut, onComplete:()=>{
            this.endTransitionIn(callback);
        }})
    }
    endTransitionIn(callback){
        this.startTransitionOut(0.5);

        if(callback){
            callback();
        }
    }
    startTransitionOut(delay = 0){


        //this.shapeCover1.y = window.game.borders.topLeft.y

        this.transitionOut(delay);
        
    }
    transitionOut(delay){
        TweenMax.to(this.logo.scale, 0.6, {delay:delay,y:0, x:0,ease:Back.easeIn});
        TweenMax.to(this.shapeCover1, 0.6, {delay,y:config.height, ease:Back.easeIn,onComplete:()=>{
            this.endTransitionOut();
        }})
    }
    endTransitionOut(){
        this.screenCover.interactive = false;
        this.container.visible = false;
    }
}