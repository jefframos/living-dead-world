import * as PIXI from 'pixi.js';

import UIUtils from "../../utils/UIUtils";

export default class ConfettiContainer extends PIXI.Container {
    constructor() {
        super();

        this.confettis = [];
        this.confettiContainer = new PIXI.Container();
        this.addChild(this.confettiContainer);
        this.maxDist = 1200
        for (let index = 0; index < 80; index++) {
            const element = new PIXI.Sprite.from('tile');
            element.width = 15
            element.height = 30
            element.anchor.set(0.5)
            element.speed = Math.random() * 120 + 30
            element.rotSpeed = Math.random() * 1.2 + 0.06 
            element.rotation = Math.random() * Math.PI * 2
            element.scaleSpeed = Math.random() * 0.8
            element.sin = Math.random()
            element.tint = UIUtils.colorset.rarity[Math.floor(Math.random() * UIUtils.colorset.rarity.length)]
            const ang = Math.random() * Math.PI * 2
            const dist = Math.random() * this.maxDist / 2;
            element.x = Math.cos(ang) * dist
            element.y = Math.sin(ang) * dist
            element.startX=element.x
            this.confettiContainer.addChild(element)
            this.confettis.push(element)
        }
    }
    update(delta) {
        this.confettis.forEach(element => {
            element.y += element.speed * delta
            element.x = element.startX + Math.cos(element.rotation) * 30
            if (element.y > this.maxDist) {
                element.y -= this.maxDist
            }
            element.rotation += element.rotSpeed * delta
            element.sin += delta * element.scaleSpeed;
            element.sin %= Math.PI
            element.width = Math.max(5, Math.sin(element.sin) * 15)

            
        });
    }
}