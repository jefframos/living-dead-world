import * as PIXI from 'pixi.js';

import BaseButton from '../BaseButton';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';
import signals from 'signals';

export default class DifficultyButton extends PIXI.Container {
    constructor(difficulty) {
        super();


        let tex = 'floor_5'
        let label = ''
        let icon = 'play-level-icon-easy'
        this.medal = 'medals0001'
        this.medalBack = 'back-medal'
        
        if (difficulty == 1) {
            
            tex = UIUtils.baseButtonTexture + '_0001'
            icon = 'play-level-icon-easy'
            label = 'Easy'
            this.medal = 'medals0001'
            
        } else if (difficulty == 2) {
            tex = UIUtils.baseButtonTexture + '_0002'
            icon = 'play-level-icon-normal'
            label = 'Standard'
            this.medal = 'medals0002'
            
        } else if (difficulty == 3) {
            tex = UIUtils.baseButtonTexture + '_0004'
            icon = 'play-level-icon-hard'
            label = 'Hard'
            this.medal = 'medals0003'
            
        } else {
            tex = UIUtils.baseButtonTexture + '_0005'
            icon = 'play-level-icon-master'
            label = 'Expert'
            this.medal = 'master-crown'
            this.medalBack = 'crown-shadow'

        }
        let w = 95
        this.button = new BaseButton(tex, w, 130)
        this.addChild(this.button)
        this.button.alpha = 1
        this.containerBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(tex), 20, 20, 20, 20);
        this.containerBackground.width = w
        this.containerBackground.height = 120
        this.containerBackground.alpha = 0

        this.locker = new PIXI.NineSlicePlane(PIXI.Texture.from(UIUtils.baseButtonTexture + '_0007'), 20, 20, 20, 20);
        this.locker.width = w
        this.locker.height = 120
        //this.addChild(this.locker)

       
        this.levelIcon = new PIXI.Sprite.from(icon)
        this.addChild(this.levelIcon)

        this.levelIcon.anchor.set(0.5)
        this.levelIcon.scale.set(Utils.scaleToFit(this.levelIcon, this.containerBackground.width - 20))

        this.levelIcon.x = this.containerBackground.width / 2
        this.levelIcon.y = this.containerBackground.height / 2

        this.badge = new PIXI.Sprite.from(this.medal)
        this.addChild(this.badge)

        this.badge.anchor.set(0.5)
        this.badge.scale.set(Utils.scaleToFit(this.badge, 40))

        this.badge.x = this.containerBackground.width -20
        this.badge.y = this.containerBackground.height -20// 2 + 10

        this.description = UIUtils.getPrimaryLabel(label)
        this.description.scale.set(Utils.scaleToFitIfMax(this.description, 150))
        this.description.style.fontSize = 16
        this.description.anchor.x = 0.5
        this.description.anchor.y = 1
        this.description.x = 0.5 * this.containerBackground.width
        this.description.y = 20
        this.addChild(this.description)


        this.onClick = new signals.Signal();
        this.button.onButtonClicked.add(() => {
            //alert(this.isLock)
            if(this.isLock){
                return;
            }
            this.onClick.dispatch();
        })

        this.finished = false
    }
    lock() {
        this.isLock = true;
        this.locker.visible = true;

        this.badge.texture = new PIXI.Texture.from('locker')

        this.badge.scale.set(Utils.scaleToFit(this.badge, 40))
    }
    unlock(){
        this.isLock = false;
        this.locker.visible = false;

        this.badge.texture = new PIXI.Texture.from(this.finished ? this.medal : this.medalBack)
        
        this.badge.scale.set(Utils.scaleToFit(this.badge, 40))


    }
    setStatus(status) {
        if (status >= 0) {
            this.badge.texture = new PIXI.Texture.from(this.medal)
            // this.badge.tint = 0xFFFFFF
            // this.badge.alpha = 1
            this.finished = true
        } else {
            this.badge.texture = new PIXI.Texture.from(this.medalBack) 
            this.finished = false
            //this.badge.tint = 0
            //this.badge.alpha = 0.7

        }
    }
}