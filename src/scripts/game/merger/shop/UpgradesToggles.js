import * as PIXI from 'pixi.js';

import Signals from 'signals';
import TweenMax from 'gsap';
import UIButton1 from '../../ui/UIButton1';
import UIList from '../../ui/uiElements/UIList';

export default class UpgradesToggles extends PIXI.Container {
    constructor(rect) {
        super()
        let width = rect.w
        let height = rect.h
        this.backShape = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.from('progressBarSmall'), 10, 10, 10, 10)
        this.backShape.width = width
        this.backShape.height = height
        this.addChild(this.backShape)
        this.backShape.alpha = 0
        this.backShape.interactive = true;
        


        this.lockList = new UIList()
        this.lockList.w = width;
        this.lockList.h = height;

        this.onUpdateValue = new Signals();

        this.addChild(this.lockList);

        this.values = [1, 10, 100, 500]
        this.toggles = []
        for (let index = 0; index < this.values.length; index++) {
            let texture = null;
            if(this.values[index] < 500){
                texture =window.TILE_ASSSETS_POOL['image-'+ this.values[index]]
            }else{
                texture =window.TILE_ASSSETS_POOL['image-MAX']
            }
            let toggle = new UIButton1(0xFFffff, texture, 0xFFffff, 120,65, 'large-square-pattern-green')
            toggle.changePivot(0, 0)
            toggle.updateIconScale(0.7)
            toggle.disableState(0x555555)
            toggle.value = this.values[index]
            toggle.fitHeight = 0.8
            toggle.icon.y -= 4
            this.lockList.addElement(toggle)
            toggle.onClick.add(() => {

                this.toggles.forEach(element => {
                    element.disableState(0x555555, 'large-square-pattern-green')
                });
                toggle.enableState(0, 'large-square-pattern-cyan')
                this.currentActiveValue = toggle.value;

                this.onUpdateValue.dispatch()
            })

            this.toggles.push(toggle)
        }
        this.toggles[0].enableState(0, 'large-square-pattern-cyan')

        this.currentActiveValue = this.toggles[0].value;

        this.lockList.updateHorizontalList()

    }

    removeButton(id){
        
        this.lockList.removeElement(this.toggles[id])
        this.lockList.updateHorizontalList()
    }
}