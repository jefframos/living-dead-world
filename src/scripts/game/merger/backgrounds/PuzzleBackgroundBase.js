import * as PIXI from 'pixi.js';
import utils from '../../../utils';
import config from '../../../config';
import TweenLite from 'gsap';

export default class PuzzleBackgroundBase extends PIXI.Container {
    constructor() {

        super();

        this.build();

        this.usableArea = new PIXI.Graphics().beginFill(0x00FF00).drawRect(0, 0, 530, 650)
        //this.addChild(this.usableArea)
        this.usableArea.alpha = 0.15
        this.usableArea.x = - this.usableArea.width / 2
    }
    build() {

    }
    update(delta){
        
    }
}