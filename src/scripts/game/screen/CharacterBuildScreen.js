import * as PIXI from 'pixi.js';

import BaseButton from '../components/ui/BaseButton';
import BodyPartsListScroller from '../ui/buildCharacter/BodyPartsListScroller';
import Game from '../../Game';
import InteractableView from '../view/card/InteractableView';
import PlayerGameViewSpriteSheet from '../components/PlayerGameViewSpriteSheet';
import PlayerViewStructure from '../entity/PlayerViewStructure';
import Pool from '../core/utils/Pool';
import Screen from '../../screenManager/Screen';
import UIList from '../ui/uiElements/UIList';
import UIUtils from '../core/utils/UIUtils';
import Utils from '../core/utils/Utils';
import signals from "signals";

export default class CharacterBuildScreen extends Screen {
    constructor(label, targetContainer) {
        super(label, targetContainer);


        this.container = new PIXI.Container()
        this.addChild(this.container);


        this.piecesScroller = new BodyPartsListScroller({ w: 300, h: 450 }, { width: 100, height: 100 }, { x: 7.5, y: 7.5 });
        this.container.addChild(this.piecesScroller);
        this.piecesScroller.addBaseGradient('base-gradient', 300)



        this.colorContainer = new BodyPartsListScroller({ w: 300, h: 200 }, { width: 100, height: 100 }, { x: 7.5, y: 7.5 });
        this.container.addChild(this.colorContainer);
        this.colorContainer.addBaseGradient('base-gradient', 300)


        this.skinColorScroller = new BodyPartsListScroller({ w: 300, h: 200 }, { width: 100, height: 100 }, { x: 7.5, y: 7.5 });
        //this.container.addChild(this.skinColorScroller);
        this.skinColorScroller.addBaseGradient('base-gradient', 300)



        this.buttonsList = new UIList();
        this.container.addChild(this.buttonsList);


        this.buttonsList.addElement(UIUtils.getCloseButton(() => { this.screenManager.backScreen() }), { align: 0 })
        this.buttonsList.addElement(UIUtils.getPrimaryButton(() => { this.randomize() }), { align: 0 })

        this.buttonsList.w = 250
        this.buttonsList.h = 100;

        this.buttonsList.updateHorizontalList();




        this.playerPreview = new PIXI.Sprite();
        this.playerPreviewStructure = new PlayerGameViewSpriteSheet();

        this.playerPreviewStructure.enable();
        this.playerPreviewStructure.baseScale = 1
        this.playerPreviewStructure.sinSpeed = 2


        this.areas = [
            { param: 'skin', colorParam: 'skinColor', area: "skin", type: "colors", colorset: UIUtils.colorset.skin },
            { param: 'chest', colorParam: 'topClothColor', area: "chest", anchor: { x: 0.43, y: 0.6 }, mainIconId: '01', iconSize: 150, range: [1, 21], src: "chest-00{frame}", animated: false , colorset: UIUtils.colorset.clothes},
            { param: 'sleeves', colorParam: 'sleevesColor', area: "sleeve", pivot: { x: 35, y: 140 }, mainIconId: '02', iconSize: 150, range: [0, 2], src: ["sleeve-00{frame}"] , colorset: UIUtils.colorset.clothes},
            //{ param: 'arms', colorParam: null, area: "arms", subs: ["backArm", "frontArm"], pivot: { x: 35, y: 140 }, mainIconId: '01', iconSize: 150, range: [1, 1], src: ["front-arm00{frame}", "front-arm00{frame}"], animated: false },

            { param: 'leg', colorParam: 'botomColor', area: "legs", subs: ["backLeg", "frontLeg"], pivot: { x: 65, y: 180 }, mainIconId: '1', iconSize: 150, range: [1, 1], src: ["back-leg{frame}-00", "front-leg{frame}-00"], animated: true, colorset: UIUtils.colorset.clothes },
            { param: 'shoe', colorParam: 'shoeColor', area: "shoes", subs: ["backShoes", "frontShoes"], pivot: { x: 65, y: 180 }, mainIconId: '1', iconSize: 150, range: [1, 1], src: ["back-shoe{frame}00", "front-shoe{frame}00"], animated: true, colorset: UIUtils.colorset.clothes },
            
            
            { param: 'head', colorParam: null, area: "head", anchor: { x: 0.45, y: 0.42 }, mainIconId: '01', iconSize: 150, range: [1, 4], src: "head-00{frame}", animated: false },
            { param: 'eyes', colorParam: null, area: "eyes", anchor: { x: 0.57, y: 0.43 }, mainIconId: '01', iconSize: 200, range: [1, 19], src: "eyes-00{frame}", animated: false },
            { param: 'ears', colorParam: null, area: "ears", anchor: { x: 0.30, y: 0.48 }, mainIconId: '01', iconSize: 220, range: [1, 4], src: "ear-00{frame}", animated: false },
            { param: 'mouth', colorParam: null, area: "mouth", anchor: { x: 0.57, y: 0.52 }, mainIconId: '11', iconSize: 250, range: [1, 20], src: "mouth-00{frame}", animated: false },
            { param: 'frontFace', colorParam: 'faceHairColor', area: "frontFace", anchor: { x: 0.57, y: 0.5 }, mainIconId: '01', iconSize: 200, range: [0, 13], src: "front-face-00{frame}", animated: false, colorset: UIUtils.colorset.hair  },
            { param: 'topHead', colorParam: 'hairColor', area: "hair", subs: ["topHead", "backHead"], pivot: { x: 65, y: 70 }, mainIconId: '01', iconSize: 150, range: [0, 28], src: ["top-head-00{frame}", 'head-0001', "back-head-00{frame}"], animated: false, colorset: UIUtils.colorset.hair },
            { param: 'hat', colorParam: null, area: "hat", anchor: { x: 0.47, y: 0.35 }, mainIconId: '01', iconSize: 150, range: [0, 16], src: "hat-00{frame}", animated: false }]



        this.sectionListBottom = new UIList();
        this.container.addChild(this.sectionListBottom);
        this.sectionListBottom.w = 0
        this.sectionListBottom.h = 0;

        this.sectionList = new UIList();
        this.container.addChild(this.sectionList);
        this.sectionList.w = 0
        this.sectionList.h = 0;


        let count = 0;
        this.areas.forEach(element => {
            const button = UIUtils.getBodyTypeLabelButton(() => { this.openSection(element) }, element.area)
            // if (!Array.isArray(element.src)) {
            //     const src = element.src.replace('{frame}', element.mainIconId)
            //     button.addIcon(src, element.iconSize, element.anchor)
            // } else {
            //     const iconContainer = new PIXI.Container();
            //     element.src.forEach(srcSub => {
            //         const src = srcSub.replace('{frame}', element.mainIconId) + (element.animated ? '01' : '')
            //         const sprite = new PIXI.Sprite.from(src);
            //         iconContainer.addChild(sprite)
            //     });
            //     button.addIconContainer(iconContainer, element.iconSize, element.pivot)

            // }

            // if (count >= 5) {
            //     this.sectionListBottom.addElement(button, { align: 0, vAlign: 0 })
            //     this.sectionListBottom.h += 100;
            // } else {

            //     count++
            // }
            this.sectionList.addElement(button, { align: 0, vAlign: 0 })
            this.sectionList.h += 70;
        });
        this.sectionList.updateVerticalList();
        this.sectionListBottom.updateVerticalList();

        this.playerPreviewStructure.view = this.playerPreview
        this.playerPreviewStructure.setData({})

        this.playerViewStructure = new PlayerViewStructure();
        this.playerPreviewStructure.buildSpritesheet(this.playerViewStructure)
        this.container.addChild(this.playerPreview);

        this.playerViewStructure.onStructureUpdate.add(this.structureUpdate.bind(this))
        this.openSection(this.areas[0])

        //this.playerViewStructure.skinColor = 0xFF0000


        this.currentSkinColors = []
        for (let index = 0; index < 6; index++) {
            const slot = UIUtils.getColorSlot((slot) => {
                this.playerViewStructure.skinColor = slot.color;
            }, 0xffffff * Math.random())
            this.currentSkinColors.push(slot)

        }
        this.skinColorScroller.addItens(this.currentSkinColors)

    }
    randomize() {
        this.playerViewStructure.face = Math.ceil(Math.random() * 10)
        this.playerViewStructure.chest = Math.ceil(Math.random() * 10)
        this.playerViewStructure.frontFace = Math.ceil(Math.random() * 5)
        this.playerViewStructure.hat = Math.ceil(Math.random() * 5)
        this.playerViewStructure.sleevesColor = 0xFFFFFF * Math.random();
        this.playerViewStructure.botomColor = 0xFFFFFF * Math.random();
        this.playerViewStructure.topClothColor = 0xFFFFFF * Math.random();
        this.playerViewStructure.shoeColor = 0xFFFFFF * Math.random();
        this.playerViewStructure.faceHairColor = 0xFFFFFF * Math.random();

    }
    build() {

    }
    aspectChange(isPortrait) {

        if (isPortrait) {
            this.buttonsList.scale.set(1)
            this.sectionList.scale.set(0.8)
        } else {

            this.buttonsList.scale.set(0.5)
            this.sectionList.scale.set(0.75)
        }
    }
    structureUpdate(region, value) {

    }
    openSection(region, value) {

        this.currentRegion = region;
        this.currentShowingItems = []
        this.piecesScroller.removeAllItems();
        this.currentShowingColors = []
        this.colorContainer.removeAllItems();

        if (this.currentRegion.type == 'colors') {
            for (let index = 0; index < this.currentRegion.colorset.length; index++) {
                const slot = UIUtils.getColorSlot((slot) => {
                    this.playerViewStructure[this.currentRegion.colorParam] = slot.color;
                }, this.currentRegion.colorset[index])
                this.currentShowingItems.push(slot)

            }
            this.piecesScroller.addItens(this.currentShowingItems)
            return
        }
        if (this.currentRegion.colorParam && this.currentRegion.colorset) {

            for (let index = 0; index < this.currentRegion.colorset.length; index++) {
                const slot = UIUtils.getColorSlot((slot) => {
                    this.playerViewStructure[this.currentRegion.colorParam] = slot.color;
                }, this.currentRegion.colorset[index])
                this.currentShowingColors.push(slot)

            }
            this.colorContainer.addItens(this.currentShowingColors)
        }
        if (this.currentRegion.range) {

            for (let index = this.currentRegion.range[0]; index <= this.currentRegion.range[1]; index++) {

                const frame = (this.currentRegion.animated ? index : Utils.formatNumber(index, 1))
                const slot = UIUtils.getBodyPartySlot((slot) => {
                    this.playerViewStructure[slot.itemParam] = slot.itemId;
                })

                slot.itemId = index;
                slot.itemParam = this.currentRegion.param;
                if (index <= 0) {
                    slot.addIcon('icon_close', 50)

                } else if (!Array.isArray(this.currentRegion.src)) {
                    const src = this.currentRegion.src.replace('{frame}', frame)
                    slot.addIcon(src, this.currentRegion.iconSize, this.currentRegion.anchor)
                } else {
                    const iconContainer = new PIXI.Container();
                    this.currentRegion.src.forEach(srcSub => {
                        const src = srcSub.replace('{frame}', frame) + (this.currentRegion.animated ? "01" : "")

                        const sprite = new PIXI.Sprite.from(src);
                        iconContainer.addChildAt(sprite, 0)
                    });
                    slot.addIconContainer(iconContainer, this.currentRegion.iconSize, this.currentRegion.pivot)

                }


                this.currentShowingItems.push(slot)

            }

        }

        this.piecesScroller.addItens(this.currentShowingItems)
    }
    resize(res, newRes) {
        this.buttonsList.x = 20;
        this.buttonsList.y = 20;
        this.sectionList.x = 20;

        if (Game.IsPortrait) {
            this.piecesScroller.x = Game.Borders.width - this.piecesScroller.width - 20

            this.colorContainer.y = Game.Borders.height - this.colorContainer.height - 20
            this.piecesScroller.y = this.colorContainer.y - this.piecesScroller.height - 20

            this.sectionList.y = Game.Borders.height - this.sectionList.height - 20

            this.skinColorScroller.x = Game.Borders.width / 2 - this.skinColorScroller.width / 2;
            this.skinColorScroller.y = 20

        } else {
            this.piecesScroller.x = Game.Borders.width - this.piecesScroller.width - 20

            this.colorContainer.y = Game.Borders.height - this.colorContainer.height - 20
            this.piecesScroller.y = this.colorContainer.y - this.piecesScroller.height - 20

            this.sectionList.y = 80

            this.skinColorScroller.x = Game.Borders.width / 2 - this.skinColorScroller.width / 2;
            this.skinColorScroller.y = Game.Borders.height - this.skinColorScroller.height - 20
        }


        this.colorContainer.x = this.piecesScroller.x;

        this.playerPreview.x = Game.Borders.width / 2;
        this.playerPreview.y = Game.Borders.height / 2;

        // this.piecesScroller.x = Game.Borders.width / 2 - this.piecesScroller.width/2;
        // this.piecesScroller.y = this.playerPreview.y;


        this.sectionListBottom.x = Game.Borders.width / 2 + 150;
        this.sectionListBottom.y = Game.Borders.height / 2 - this.sectionListBottom.height / 2;

        var min = Game.GlobalScale.max;
        this.playerPreviewStructure.baseScale = Math.min(1.5, min);
    }

    update(delta) {
        this.playerPreviewStructure.update(delta)
    }
}