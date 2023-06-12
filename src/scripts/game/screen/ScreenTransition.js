import * as PIXI from 'pixi.js';

import TweenMax from 'gsap';
import config from '../../config';

export default class ScreenTransition extends PIXI.Container {
    constructor() {
        super();
        this.container = new PIXI.Container();

        this.addChild(this.container)

        this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0004'), 20, 20, 20, 20);
        this.infoBackContainer.width = 800
        this.infoBackContainer.height = 800
        this.container.addChild(this.infoBackContainer);

    }

    transitionIn(delay) {


    }

    transitionOut(delay) {

    }
    resize(newSize, innerResolution) {
        
    }
}