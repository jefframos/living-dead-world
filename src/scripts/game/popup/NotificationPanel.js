import * as PIXI from 'pixi.js';

import Signals from 'signals';
import TextBox from '../ui/TextBox';
import UIButton1 from '../ui/UIButton1';
import UILabelButton1 from '../ui/UILabelButton1';
import config from '../../config';
import NotificationView from './NotificationView';
import utils from '../../utils';

export default class NotificationPanel extends PIXI.Container {
    constructor() {
        super();
        this.onShow = new Signals();
        this.onHide = new Signals();
        this.onConfirm = new Signals();
        this.onClose = new Signals();

        this.container = new PIXI.Container();
        this.addChild(this.container)

        this.w = config.width * 0.75;
        this.h = config.height * 0.5;


        this.notificationList = [];

        this.notificationHeight = 100
    }

    buildNewPieceNotification(character, label, lastPiece, texture) {
        let pop = new NotificationView(this.w, this.notificationHeight, 10, texture)

        let charElement = this.addImageToNotification(character)
        if(!lastPiece){
            charElement.listScl = 0.25
        }
        pop.addElement(charElement)


        let labelElement = this.addLabelToNotification(label, lastPiece?this.w/3: this.w * 0.75)
        pop.addElement(labelElement)

        if(lastPiece){
            pop.addElement(this.addImageToNotification(lastPiece))
        }

        pop.time = 4
        pop.show();
        this.container.addChild(pop)
        

        pop.y = this.notificationList.length * (this.notificationHeight + 5)
        this.notificationList.push(pop);
    }

    addLabelToNotification(text, wrap = 0) {
        let label = new PIXI.Text(text, LABELS.LABEL1);
        label.style.fontSize = 28
        label.scaleContentMax = true;
        if(wrap){
            label.style.wordWrap = true
            label.style.wordWrapWidth = wrap
        }
        return label
    }

    addImageToNotification(imageSrc) {
        let sprite = new PIXI.Sprite.from(imageSrc);
        sprite.scaleContentMax = true;
        sprite.fitHeight = 0.8;
        return sprite
    }
    update(delta) {
        for (let index = this.notificationList.length - 1; index >= 0; index--) {
            const element = this.notificationList[index];

            element.y = utils.lerp(element.y, index * (this.notificationHeight + 5), 0.1)

            element.time -= delta;
            if (element.time <= 0.3)
            {
                element.alpha = utils.lerp(element.alpha, 0, 0.1)
            }
            if (element.time <= 0) {
                element.parent.removeChild(element)
                this.notificationList.splice(index, 1)
            }

        }
    }
}