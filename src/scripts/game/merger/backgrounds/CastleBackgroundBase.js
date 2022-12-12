import * as PIXI from 'pixi.js';
import utils from '../../../utils';
import config from '../../../config';
import TweenLite from 'gsap';

export default class CastleBackgroundBase extends PIXI.Container {
    constructor() {

        super();
        this.baseContainer = new PIXI.Container()
        this.addChild(this.baseContainer)
        this.castleContainer = new PIXI.Container();
        this.build();
        this.initCastle();
        this.usableArea = new PIXI.Graphics().beginFill(0x00FF00).drawRect(0, 0, 550, 550)
        //this.addChild(this.usableArea)
        this.usableArea.alpha = 0.15
        this.usableArea.x = - this.usableArea.width / 2
        this.usableArea.y = - 450
    }
    initCastle() {

        let copy = []
        this.castleSet.forEach(element => {
            copy.push(element)
        });

        copy.sort(function(a, b){return b.order-a.order});

        copy.forEach(element => {
            let img = new PIXI.Sprite.from(element.src)
            img.x = element.pos.x
            img.y = element.pos.y
            this.castleContainer.addChild(img)

            this.castleSet.forEach(element2 => {
                if(element2.src == element.src){
                    element2.sprite = img;
                }
            });
        })
    }
    showAll(){
        for (let index = 0; index < this.castleSet.length; index++) {
            const element = this.castleSet[index];
            element.sprite.visible = true
        }

        setTimeout(() => {
            for (let index = 0; index < this.castleSet.length; index++) {
                const element = this.castleSet[index];
                element.sprite.visible = true
            }
        }, 50);
    }
    getPiece(id) {
        return this.castleSet[id];
    }
    updateMax(value, hide = false) {
        value = Math.min(value, this.castleSet.length - 1)
        for (let index = 0; index < this.castleSet.length; index++) {
            const element = this.castleSet[index];
            element.sprite.visible = false
        }
        for (let index = 0; index <= value; index++) {
            const element = this.castleSet[index];            
            element.sprite.visible = true
        }
        this.castleSet.forEach(element => {
            element.sprite.x = element.pos.x
            element.sprite.y = element.pos.y

        });      

        if(hide){
            this.castleSet[value].sprite.alpha = 0
        }
    }
    showAnimation(value){


        this.castleSet[0].sprite.visible = true
        this.castleSet[0].sprite.alpha = 1

        this.castleSet.forEach(element => {
            element.sprite.x = element.pos.x
            element.sprite.y = element.pos.y
            TweenLite.killTweensOf(element.sprite);

        }); 

        if (value > 0){
            this.castleSet[value].sprite.visible = true
            TweenLite.to(this.castleSet[value].sprite, 0.2, {delay:0.5, alpha:1})
            TweenLite.from(this.castleSet[value].sprite, 0.8, {delay:0.5,  y: this.castleSet[value - 1].sprite.y - this.castleSet[value - 1].sprite.height * 1.5, ease:Bounce.easeOut });
        }
    }
    build() {

    }
    update(delta) {

    }
}