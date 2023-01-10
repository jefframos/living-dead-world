import * as PIXI from 'pixi.js';

import config from './config';
import utils from './utils';

export default class Game {
    static GlobalScale = {x:1, y:1}
    static GlobalContainerPosition = {x:0, y:0}
    static Screen = {width:0, height:0}
    constructor(config, screenManager) {
        Game.GlobalScale = {x:1, y:1}
        Game.GlobalContainerPosition = {x:0, y:0}
        this.screenManager = screenManager;

        const Renderer = (config.webgl) ? PIXI.autoDetectRenderer : PIXI.CanvasRenderer;

        this.desktopResolution = {
            width: config.width,
            height: config.height,
        };

        Game.Screen.width = config.width
        Game.Screen.height = config.height
        
        this.ratio = config.width / config.height;
        window.renderer = new PIXI.Application({
            width: config.width,
            height: config.height,
            resolution: Math.max(window.devicePixelRatio, 2),
            antialias: false,
            backgroundColor: 0x151510
        });
        document.body.appendChild(window.renderer.view);

        this.stage = new PIXI.Container();
        window.renderer.stage.addChild(this.stage)


        this.frameskip = 1;
        this.lastUpdate = Date.now();


        this.forceResizeTimer = 5;

        this.latestWidth = 0;

        this.borders = {
            topLeft: { x: 0, y: 0 },
            bottomLeft: { x: 0, y: 0 },
            topRight: { x: 0, y: 0 },
            bottomRight: { x: 0, y: 0 },
        }

        this.makeLoader();
        this.resize()
    }
    makeLoader() {
        this.loaderContainer = new PIXI.Container()
        let backLoader = new PIXI.Graphics().beginFill(0).drawRect(0, 0, 300, 30)
        this.fillLoader = new PIXI.Graphics().beginFill(0xff296D).drawRect(0, 0, 300, 30)
        this.loaderContainer.addChild(backLoader)
        this.loaderContainer.addChild(this.fillLoader)
        this.fillLoader.scale.x = 0
        // this.logo = new PIXI.Sprite.from('logoTransparent.png')
        // this.logo.anchor.set(0.5)
        // this.logo.x = 150
        // this.logo.y = -200
        // this.loaderContainer.addChild(this.logo)
        this.stage.addChild(this.loaderContainer);

        this.loaderContainer.x = Game.Screen.width/2
    }
    updateLoader(progress) {
        this.fillLoader.scale.x = progress / 100
        this.resize()
    }
    initialize() {

        this.stage.removeChild(this.loaderContainer);
        window.renderer.ticker.add(this._onTickEvent, this);
        setTimeout(() => {
            this.resize()
        }, 10);
    }
    _onTickEvent(deltaTime) {
        this.dt = deltaTime / 60;
        this.update();
        if (this.latestWidth != window.innerWidth) {
            this.resize();
        }
        if (this.forceResizeTimer > 0) {
            this.forceResizeTimer -= this.dt;
            //this.resize()
        }
    }
    resize() {
        var w = window.innerHeight
        var h = window.innerWidth;

        this.latestWidth = window.innerWidth;

        window.isPortrait = w < h


        if (window.innerWidth / window.innerHeight >= this.ratio) {
            var w = window.innerHeight * this.ratio;
        } else {
            var h = window.innerWidth / this.ratio;
        }

        const width = window.innerWidth || document.documentElement.clientWidth ||
            document.body.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight ||
            document.body.clientHeight;

        var w = width;
        var h = height;
        //this.resolution = { width: window.outerWidth, height: window.outerHeight };
        this.resolution = { width: window.outerWidth, height: window.outerHeight };
        this.innerResolution = { width: w, height: h };

        window.renderer.view.style.position = 'absolute';

        window.renderer.view.style.width = `${this.innerResolution.width}px`;
        window.renderer.view.style.height = `${this.innerResolution.height}px`;




        let sclX = this.innerResolution.width / config.width
        let sclY = this.innerResolution.height / config.height


        let scl = Math.min(sclX, sclY)
        const newSize = {
            width: this.desktopResolution.width * scl,
            height: this.desktopResolution.height * scl,
        };

        window.renderer.view.style.width = `${this.innerResolution.width}px`;
        window.renderer.view.style.height = `${this.innerResolution.height}px`;


        window.renderer.view.style.left = '0px'//`${this.innerResolution.width / 2 - (newSize.width) / 2}px`;
        window.renderer.view.style.top = '0px'//`${this.innerResolution.height / 2 - (newSize.height) / 2}px`;
        // window.renderer.view.style.width = `${this.innerResolution.width}px`;
        // window.renderer.view.style.height = `${this.innerResolution.height}px`;
        //window.renderer.view.style.left = `${window.innerWidth / 2 - (this.innerResolution.width) / 2}px`;


        // let sclX = this.innerResolution.width /this.desktopResolution.width //* this.ratio
        // let sclY =  this.innerResolution.height /this.desktopResolution.height //* this.ratio


        // console.log(sclX, sclY)

        // utils.resizeToFitAR
        // let scaleMin = 1//Math.min(sclX, sclY) * this.ratio;
        // if(sclX < sclY){
        //     scaleMin = sclX* this.ratio
        // }else{

        //     scaleMin = sclY* this.ratio
        // }


        //element.scale.set(min)

        if (this.loaderContainer && this.loaderContainer.parent) {
            let newScaleX = newSize.width / this.innerResolution.width
            this.loaderContainer.scale.x = newScaleX//this.ratio
            let newScaleY = newSize.height / this.innerResolution.height
            this.loaderContainer.scale.y = newScaleY//this.ratio


            this.loaderContainer.x = Game.Screen.width/2 - this.loaderContainer.width / 2//this.desktopResolution.width / 2 - (this.desktopResolution.width / 2 * newScaleX) + 150 * newScaleX
            this.loaderContainer.y =  Game.Screen.height - this.loaderContainer.height - 50


        }

        if (this.screenManager) {
            //  let sclX = (this.innerResolution.width)/(this.desktopResolution.width) ;
            //  let sclY = (this.innerResolution.height)/(this.desktopResolution.height) ;
            //  let min = Math.min(sclX, sclY);
            // this.screenManager.scale.set(min)





            let newScaleX = newSize.width / this.innerResolution.width
            this.screenManager.scale.x = newScaleX//this.ratio
            let newScaleY = newSize.height / this.innerResolution.height
            this.screenManager.scale.y = newScaleY//this.ratio

            //console.log(newScaleX)
            // 	// this.screenManager.pivot.x = this.innerResolution.width / 2 // this.screenManager.scale.x
            this.screenManager.x = this.desktopResolution.width / 2 - (this.desktopResolution.width / 2 * newScaleX)///- (this.innerResolution.width / 2 *newScaleX) // this.screenManager.scale.y
            this.screenManager.pivot.y = this.innerResolution.height / 2 - (this.innerResolution.height / 2 / newScaleY) // this.screenManager.scale.y

            // 	this.screenManager.x = 0//window.innerWidth/2 * sclX - this.desktopResolution.width/2* sclX//this.innerResolution.width / 2 // this.screenManager.scale.x
            // 	this.screenManager.y = 0// window.innerHeight/2 * sclY - this.desktopResolution.height/2* sclY // this.screenManager.scale.y


            Game.GlobalScale.x = config.width / this.innerResolution.width
            Game.GlobalScale.y =  config.height / this.innerResolution.height

            Game.GlobalContainerPosition.x = this.screenManager.x
            Game.GlobalContainerPosition.y = this.screenManager.y
            



            
            // 	//console.log(window.appScale)
            window.isPortrait = this.innerResolution.width < this.innerResolution.height * 1.2

            this.screenManager.resize(this.resolution, this.innerResolution);
            this.borders.topRight.x = config.width + this.screenManager.x / this.screenManager.scale.x
            this.borders.bottomRight.x = config.width + this.screenManager.x / this.screenManager.scale.x
            this.borders.bottomRight.y = config.height
            this.borders.bottomLeft.y = config.height

        }
    }

    getBorder(type, parent) {
        var toGlobal = this.screenManager.toGlobal(this.borders[type])
        return parent.toLocal(toGlobal)
    }
    /**
     * 
     *  let sclX = this.innerResolution.width / config.width
        let sclY = this.innerResolution.height / config.height


        let scl = Math.min(sclX, sclY)
        const newSize = {
            width: this.desktopResolution.width * scl,
            height: this.desktopResolution.height * scl,
        };

        window.renderer.view.style.width = `${newSize.width}px`;
        window.renderer.view.style.height = `${newSize.height}px`;

  
        window.renderer.view.style.left = `${this.innerResolution.width / 2 - (newSize.width) / 2}px`;
        window.renderer.view.style.top = `${this.innerResolution.height / 2 - (newSize.height) / 2}px`;
     * 
     * 
     * 
     */
    update() {
        this.screenManager.update(this.dt)
        // window.renderer.render(this.stage);
    }

    start() {
        //	this.animationLoop.start();
    }

    stop() {
        //	this.animationLoop.stop();
    }
}