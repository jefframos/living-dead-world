import * as PIXI from 'pixi.js';

import CircleCounter from '../../ui/hudElements/CircleCounter';
import MergeTile from './MergeTile';
import ProgressBar from '../ProgressBar';
import Signals from 'signals';
import UIBar from '../../ui/uiElements/UIBar';

export default class ChargerTile extends MergeTile {
    constructor(i, j, size, lockIcon, standardChargeTime, visuals) {
        super(i, j, size, lockIcon, visuals);
        //this.backShape.texture = PIXI.Texture.from(Math.floor(Math.random() * visuals.backTiles.length))

        this.defaultChargeTime = standardChargeTime;
        this.currentChargeTime = this.defaultChargeTime;

        this.onCompleteCharge = new Signals();
        this.container.addChild(this.backShape)

        this.backShapeMasked = new PIXI.Sprite.from(visuals.locks[0])

        let scale = Math.min(size / this.backShapeMasked.width, size / this.backShapeMasked.height)
        this.backShapeMasked.scale.set(scale*0.9)
        this.backShapeMasked.anchor.set(0.5)
        this.backShapeMasked.alpha = 1
        this.backShapeMasked.x = size/2
        this.backShapeMasked.y = size/2
        this.container.addChild(this.backShapeMasked)


        this.frontShapeSprite = new PIXI.Sprite.from(visuals.locks[0])

        this.frontShapeSprite.scale.set(scale*0.9)
        this.frontShapeSprite.anchor.set(0.5)
        this.frontShapeSprite.alpha = 0.25
        this.frontShapeSprite.x = size/2
        this.frontShapeSprite.y = size/2
        this.container.addChild(this.frontShapeSprite)
        

        this.levelBar = new ProgressBar({ width: size, height: size }, 3, 3)
        this.levelBar.updateBackgroundColor(0x20516c)
        this.levelBar.updateBackgroundFront(0x00ffff)
        this.levelBar.setBarOnly()
        //this.container.addChild(this.levelBar)

        this.maskSquare = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0,0,size, size)
        this.container.addChild(this.maskSquare)

        this.backShapeMasked.mask = this.maskSquare

        this.maskSquare.rotation = -Math.PI 
        this.maskSquare.x = size
        this.maskSquare.y = size

        this.container.removeChild(this.damageTimerView)

        this.isCharged = false;

        this.systemID = '';
        this.outState()

        this.fullLabel =new PIXI.Text(window.localizationManager.getLabel('full'), LABELS.LABEL1)
        this.fullLabel.anchor.set(0.5)
        this.fullLabel.style.fontSize = 32
        this.container.addChild(this.fullLabel)
        this.fullLabel.x = size / 2
        this.fullLabel.y = size / 2
    }
    onMouseDown(e) {
        if (this.isBlocked) return
        super.onMouseDown(e);
        this.currentChargeTime -= 0.2
        COOKIE_MANAGER.addAchievment(this.systemID, 'tap', 1)
        SOUND_MANAGER.play('Pop-Low-Pitch-Up-02', 0.1, Math.random() * 0.1 + 0.9)
        if (this.currentChargeTime <= 0) {
            this.completeCharge();
        } else {

            this.onShowParticles.dispatch()
        }
    }
    giftState() { }
    enterAnimation() { }
    reveal() { }
    blockState() {
        this.isBlocked = true
    }
    standardState() {
        this.isBlocked = false

    }
    update(delta, timeStamp) {
        this.tileSprite.visible = false;
        this.backShape.tint = 0xFFFFFF

        this.backShapeMasked.visible = !this.isBlocked
        //return
        // if(COOKIE_MANAGER.getStats().tutorialStep <= 0){
        //     this.currentChargeTime = delta
        // }
        //console.log(this.currentChargeTime)
        if (!this.isBlocked) {
            super.update(delta, timeStamp);

            if (this.currentChargeTime > 0) {
                this.currentChargeTime -= delta;
                if (this.currentChargeTime <= 0) {
                    this.completeCharge();
                } else {
                    //this.tileSprite.visible = false;
                }

                this.maskSquare.scale.y = 1 - (this.currentChargeTime / this.defaultChargeTime)
                this.levelBar.setProgressBar(1 - (this.currentChargeTime / this.defaultChargeTime))
                //this.levelBar.visible = true;

                //this.circleCounter.update(1-(this.currentChargeTime / this.defaultChargeTime))

            }
            this.fullLabel.visible = false
        }else{
            this.fullLabel.visible = true
        }
        //this.levelBar.visible = false;
        this.levelBar.visible = true;
        this.label.visible = this.tileSprite.visible;
    }
    startCharging() {
        this.isCharged = false;
        this.tileData = null;
        this.currentChargeTime = this.defaultChargeTime;
        this.levelBar.visible = false;
        this.levelBar.setProgressBar(0, 0, true);
    }
    completeCharge() {
        this.isCharged = true;
        this.levelBar.visible = false;
        //this.tileSprite.visible = true;
        this.onCompleteCharge.dispatch();
    }
    lookAt(target) {

    }
    overState() {
        // this.backSlot.tint = 0x00FFFF
        // this.backShape.tint = 0x00FFFF

    }
    outState() {
        // this.backSlot.tint = 0x00FFFF
        // this.backShape.tint = 0x00FFFF

    }
}