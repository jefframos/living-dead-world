import * as PIXI from 'pixi.js';

import Signals from 'signals';
import TextBox from '../ui/TextBox';
import UIButton1 from '../ui/UIButton1';
import UILabelButton1 from '../ui/UILabelButton1';
import config from '../../config';
import UIList from '../ui/uiElements/UIList';
import TweenMax from 'gsap';

export default class NotificationView extends PIXI.Container {
    constructor(width, height, padding = 0, texture = config.assets.popup.secondary) {
        super(); 
        this.container = new PIXI.Container();

        this.addChild(this.container)

        this.popUp = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.from(texture), 50, 100, 50, 50)
        this.popUp.width = width
        this.popUp.height = height

        config.addPaddingPopup(this.popUp)

        this.container.addChild(this.popUp)
        
        this.contentList = new UIList()
        this.contentList.w = width - padding * 2
        this.contentList.h = height - padding * 2
        this.contentList.x = padding
        this.contentList.y = padding
        this.container.addChild(this.contentList)

        this.container.pivot.x = width / 2
        this.container.pivot.y = height / 2

       
    }
    cleatList(){
        this.contentList.removeAllElements();
    }

    addElement(element){
        this.contentList.addElement(element)
        this.contentList.updateHorizontalList();
    }
    show(){
        this.container.scale.set(1.3, 0.7)
        TweenMax.to(this.container.scale, 0.6, {x:1,y:1, ease:Elastic.easeOut})
    }
}