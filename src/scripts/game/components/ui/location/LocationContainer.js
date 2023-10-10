import * as PIXI from 'pixi.js';

import Game from '../../../../Game';
import InteractableView from '../../../view/card/InteractableView';
import ListScroller from '../../../ui/uiElements/ListScroller';
import MainScreenModal from '../MainScreenModal';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import signals from 'signals';

export default class LocationContainer extends MainScreenModal {
    constructor() {
        super();

        this.scroller = new ListScroller({ w: 500, h: 600 }, { width: 75, height: 75 }, { x: 0, y: 0 })
        this.scroller.itemHeight = 500

        this.onRedirectToGame = new signals.Signal();

        this.container.addChild(this.scroller)

        this.mapList = new UIList();

        this.mapList.w = 500
        this.mapList.h = 800

        this.levelDataList = [];
        for (let index = 0; index < 5; index++) {
            const element = new PIXI.Graphics().beginFill(0xFFFFFF * Math.random()).drawRect(0,0,280,180)
            this.mapList.addElement(element)
            InteractableView.addMouseClick(element, ()=>{
                this.onRedirectToGame.dispatch(this.levelDataList[index])
            })
            this.levelDataList.push({id:index})
            
        }
        this.mapList.updateVerticalList();
        this.scroller.addItens([this.mapList])
    

    }
    addBackgroundShape() {
        this.modalTexture = 'modal_blur';
        super.addBackgroundShape();

    }
    resize(res, newRes) {

        if (Game.IsPortrait) {
            this.infoBackContainer.width = Game.Borders.width - 80
            this.infoBackContainer.height = Game.Borders.height - 80
        } else {
            if (Game.Borders.width / Game.Borders.height < 1.5) {

                this.infoBackContainer.width = Game.Borders.width * 0.75
                this.infoBackContainer.height = Game.Borders.height - 80
            } else {

                this.infoBackContainer.width = Game.Borders.width * 0.5
                this.infoBackContainer.height = Game.Borders.height - 80
            }
        }

        this.infoBackContainer.height = Game.Borders.height - this.container.y + 20//- 40

        this.mapList.w = this.infoBackContainer.width
        this.mapList.h =  this.levelDataList.length * 180
        this.mapList.updateVerticalList();

        this.scroller.resize({ w: this.infoBackContainer.width, h: this.infoBackContainer.height }, { w: this.mapList.width, h: this.mapList.height })
        this.scroller.itemHeight = this.mapList.height + 80

        this.recenterContainer()
    }
    recenterContainer() {
        this.container.pivot.x = this.container.width / 2
        this.container.x = Game.Borders.width / 2

        this.container.pivot.y = 0//this.container.height / 2
        this.container.y = 150

    }
    show() {
        this.resize()
        super.show();
    }
}