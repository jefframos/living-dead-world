import * as PIXI from 'pixi.js';

import Game from '../../../../Game';
import GameStaticData from '../../../data/GameStaticData';
import InteractableView from '../../../view/card/InteractableView';
import ListScroller from '../../../ui/uiElements/ListScroller';
import LocationButton from './LocationButton';
import MainScreenModal from '../MainScreenModal';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import signals from 'signals';

export default class LocationContainer extends MainScreenModal {
    constructor() {
        super();

        this.scroller = new ListScroller({ w: 500, h: 600 }, { width: 75, height: 75 }, { x: 0, y: 0 })
        this.scroller.itemHeight = 500
        this.scroller.y = 20;
        
        this.onRedirectToGame = new signals.Signal();

        this.container.addChild(this.scroller)

        this.mapList = new UIList();

        this.mapList.w = 500
        this.mapList.h = 800

        this.levelSkip = 1
        this.levelDataList = [];
        for (let index = 0; index < GameStaticData.instance.totalLevels; index++) {
            const element = new LocationButton();
            if(index >= this.levelSkip){
                this.mapList.addElement(element)
            }
            element.onStageSelected.add((element, level)=>{
                this.onRedirectToGame.dispatch(this.levelDataList[index], level)
            })
            this.levelDataList.push({ view: element, id: index })

        }
        this.mapList.updateVerticalList();
        this.scroller.addItens([this.mapList])

        this.updateButtonsData();
    }
    updateButtonsData() {
        for (let index = 0; index < this.levelDataList.length; index++) {
            const element = this.levelDataList[index].view;
            element.setData(GameStaticData.instance.getLevels(index))
        }
    }
    addBackgroundShape() {
        this.modalTexture = 'modal_container0002';
        super.addBackgroundShape();
        this.infoBackContainer.alpha = 0

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
        this.mapList.h = (this.levelDataList.length - 0) * 180
        this.mapList.updateVerticalList();

        this.scroller.resize({ w: this.infoBackContainer.width, h: this.infoBackContainer.height }, { w: this.mapList.width, h: this.mapList.height -20})
        this.scroller.itemHeight = this.mapList.height + 80
        this.scroller.containerBackground.alpha = 0;


        this.levelDataList.forEach(element => {
            element.view.updateSize(this.mapList.w, 200)
        });
        this.recenterContainer()

        this.mapList.x = -this.infoBackContainer.width / 2
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

        this.scroller.resetPosition()

        for (let index = 0; index < this.levelDataList.length; index++) {
            const element = this.levelDataList[index].view;
            element.updateData()
        }
    }
}