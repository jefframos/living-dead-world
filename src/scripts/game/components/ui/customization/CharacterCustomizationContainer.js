import * as PIXI from 'pixi.js';

import BodyPartsListScroller from '../../../ui/buildCharacter/BodyPartsListScroller';
import Game from '../../../../Game';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../core/utils/UIUtils';
import Utils from '../../../core/utils/Utils';

export default class CharacterCustomizationContainer extends PIXI.Container {
    constructor() {
        super();

         this.container = new PIXI.Container();
         this.addChild(this.container)
        this.piecesScroller = new BodyPartsListScroller({ w: 300, h: 450 }, { width: 100, height: 100 }, { x: 7.5, y: 7.5 });
        this.container.addChild(this.piecesScroller);
        // this.piecesScroller.addBaseGradient('base-gradient', 300)



        this.colorContainerScroller = new BodyPartsListScroller({ w: 300, h: 200 }, { width: 100, height: 100 }, { x: 7.5, y: 7.5 });
        this.container.addChild(this.colorContainerScroller);
        // this.colorContainerScroller.addBaseGradient('base-gradient', 300)

        this.torsosData = {
            _1: {
                colorset: UIUtils.colorset.clothes,
                parts: [{
                    param: 'sleeves',
                    frame: 0,
                    colorParam: 'sleevesColor',
                    color: -1
                }]
            },
            _2: {
                colorset: UIUtils.colorset.clothes,
                parts: [{
                    param: 'sleeves',
                    frame: 1,
                    colorParam: 'sleevesColor',
                    color: 0xFF0000
                }]
            },
            _3: {
                colorset: UIUtils.colorset.clothes,
                parts: [{
                    param: 'sleeves',
                    frame: 2,
                    colorParam: 'sleevesColor',
                    color: -1
                }]
            }
        }

        this.legsData = {
            _1: {
                colorset: UIUtils.colorset.clothes,
                parts: [{
                    param: 'sleeves',
                    frame: 0,
                    colorParam: 'sleevesColor',
                    color: -1
                }]
            }

        }

        this.areas = [
            { label: 'Skin', param: 'skin', colorParam: 'skinColor', area: "skin", type: "colors", colorset: UIUtils.colorset.skin },

            { label: 'Torso', param: 'chest', colorParam: 'topClothColor', area: "chest", anchor: { x: 0.43, y: 0.6 }, mainIconId: '01', iconSize: 150, range: [1, 21], src: "chest-00{frame}", animated: false, colorsetData: this.torsosData },

            // { label: 'Sleves', param: 'sleeves', colorParam: 'sleevesColor', area: "sleeve", pivot: { x: 35, y: 140 }, mainIconId: '02', iconSize: 150, range: [0, 2], src: ["sleeve-00{frame}"] , colorset: UIUtils.colorset.clothes},
            //{ label: 'skin', param: 'arms', colorParam: null, area: "arms", subs: ["backArm", "frontArm"], pivot: { x: 35, y: 140 }, mainIconId: '01', iconSize: 150, range: [1, 1], src: ["front-arm00{frame}", "front-arm00{frame}"], animated: false },

            { label: 'Legs', param: 'leg', colorParam: 'botomColor', area: "legs", subs: ["backLeg", "frontLeg"], pivot: { x: 65, y: 180 }, mainIconId: '1', iconSize: 150, range: [1, 1], src: ["back-leg{frame}-00", "front-leg{frame}-00"], animated: true, colorsetData: this.legsData },
            { label: 'Shoes', param: 'shoe', colorParam: 'shoeColor', area: "shoes", subs: ["backShoes", "frontShoes"], pivot: { x: 65, y: 180 }, mainIconId: '1', iconSize: 150, range: [1, 1], src: ["back-shoe{frame}00", "front-shoe{frame}00"], animated: true, colorset: UIUtils.colorset.clothes },


            { label: 'Head', param: 'head', colorParam: null, area: "head", anchor: { x: 0.45, y: 0.42 }, mainIconId: '01', iconSize: 150, range: [1, 4], src: "head-00{frame}", animated: false },
            { label: 'Eyes', param: 'eyes', colorParam: null, area: "eyes", anchor: { x: 0.57, y: 0.43 }, mainIconId: '01', iconSize: 200, range: [1, 19], src: "eyes-00{frame}", animated: false },
            { label: 'Ears', param: 'ears', colorParam: null, area: "ears", anchor: { x: 0.30, y: 0.48 }, mainIconId: '01', iconSize: 220, range: [1, 4], src: "ear-00{frame}", animated: false },
            { label: 'Mouth', param: 'mouth', colorParam: null, area: "mouth", anchor: { x: 0.57, y: 0.52 }, mainIconId: '11', iconSize: 250, range: [1, 20], src: "mouth-00{frame}", animated: false },
            { label: 'Face', param: 'frontFace', colorParam: 'faceHairColor', area: "frontFace", anchor: { x: 0.57, y: 0.5 }, mainIconId: '01', iconSize: 200, range: [0, 13], src: "front-face-00{frame}", animated: false, colorset: UIUtils.colorset.hair },
            { label: 'Hair', param: 'topHead', colorParam: 'hairColor', area: "hair", subs: ["topHead", "backHead"], pivot: { x: 65, y: 70 }, mainIconId: '01', iconSize: 150, range: [0, 28], src: ["top-head-00{frame}", 'head-0001', "back-head-00{frame}"], animated: false, colorset: UIUtils.colorset.hair },
            { label: 'Hat', param: 'hat', colorParam: null, area: "hat", anchor: { x: 0.47, y: 0.35 }, mainIconId: '01', iconSize: 150, range: [0, 16], src: "hat-00{frame}", animated: false }]



        this.sectionListBottom = new UIList();
        this.container.addChild(this.sectionListBottom);
        this.sectionListBottom.w = 0
        this.sectionListBottom.h = 0;

        this.sectionList = new UIList();
        this.container.addChild(this.sectionList);
        this.sectionList.w = 0
        this.sectionList.h = 0;

        this.allButtons = [];

        let count = 0;
        this.areas.forEach(element => {
            const button = UIUtils.getBodyTypeLabelButton((button) => {
                this.openSection(element);
                button.setActive();
            }, element.label)
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
            this.allButtons.push(button);
            this.sectionList.addElement(button, { align: 0, vAlign: 0 })
            this.sectionList.h += 70;
        });
        this.sectionList.updateVerticalList();
        this.sectionListBottom.updateVerticalList();
        this.openSection(this.areas[0])
        this.allButtons[0].setActive()
    }
    setPlayer(viewStructure){
        this.playerViewStructure = viewStructure;

        
    }
    buildColorListOnly(colorset, colorParam) {
        for (let index = 0; index < colorset.length; index++) {
            const slot = UIUtils.getColorSlot(this.updateSlotColor.bind(this), colorset[index])
            if (Array.isArray(colorParam)) {
                slot.colorParam = colorParam
            } else {
                slot.colorParam = [colorParam]
            }
            this.currentShowingItems.push(slot)

        }
        this.piecesScroller.addItens(this.currentShowingItems)
    }
    buildAltColorList(colorset, colorParam) {
        this.currentShowingColors = [];
        this.colorContainerScroller.setTitle('Color')
        for (let index = 0; index < colorset.length; index++) {
            const slot = UIUtils.getColorSlot(this.updateSlotColor.bind(this), colorset[index])

            if (Array.isArray(colorParam)) {
                slot.colorParam = colorParam
            } else {
                slot.colorParam = [colorParam]
            }
            this.currentShowingColors.push(slot)
        }
        this.colorContainerScroller.removeAllItems();
        this.colorContainerScroller.addItens(this.currentShowingColors)
        console.log(this.colorContainerScroller)
    }
    updateSlotColor(slot) {
        slot.colorParam.forEach(element => {
            this.playerViewStructure[element] = slot.color;
        });
    }
    selectNewPiece(slot) {

        if (slot.region.colorsetData) {
            const colorsetData = slot.region.colorsetData['_' + slot.itemId]

            if (colorsetData) {
                let params = [slot.region.colorParam];
                colorsetData.parts.forEach(element => {
                    if (element.param) {
                        this.playerViewStructure[element.param] = element.frame
                    }
                    if (element.color < 0 && element.colorParam) {
                        params.push(element.colorParam)
                        this.playerViewStructure[element.colorParam] = this.playerViewStructure[slot.region.colorParam];
                    } else if (element.color >= 0 && element.colorParam) {
                        this.playerViewStructure[element.colorParam] = element.color;
                    }
                });
                this.buildAltColorList(colorsetData.colorset, params)
            } else {
                this.playerViewStructure[slot.region.colorParam] = 0xFFFFFF
                this.resetColorPieces();
            }
        } else {

        }

        this.playerViewStructure[slot.itemParam] = slot.itemId;
    }
    resetColorPieces() {
        this.currentShowingColors.forEach(element => {
            element.colorParam = [];
        });
        this.currentShowingColors = []
        this.colorContainerScroller.removeAllItems();
    }
    openSection(region, value) {


        this.allButtons.forEach(element => {
            element.setDefault();
        });
        this.currentRegion = region;
        this.currentShowingItems = []
        this.piecesScroller.removeAllItems();
        this.currentShowingColors = []
        this.colorContainerScroller.removeAllItems();

        this.piecesScroller.setTitle(this.currentRegion.label)

        if (this.currentRegion.type == 'colors') {
            this.buildColorListOnly(this.currentRegion.colorset, this.currentRegion.colorParam)
            return
        }
        if (this.currentRegion.colorParam && this.currentRegion.colorset) {
            this.buildAltColorList(this.currentRegion.colorset, this.currentRegion.colorParam)
        }
        if (this.currentRegion.range) {

            for (let index = this.currentRegion.range[0]; index <= this.currentRegion.range[1]; index++) {

                const frame = (this.currentRegion.animated ? index : Utils.formatNumber(index, 1))
                const slot = UIUtils.getBodyPartySlot(this.selectNewPiece.bind(this))

                slot.itemId = index;
                slot.itemParam = this.currentRegion.param;
                slot.region = region;
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
    resize(res, newRes){
        this.sectionList.x = 20;

        if (Game.IsPortrait) {

            this.rebuildPortraitScrollers()

            this.piecesScroller.x = Game.Borders.width / 2 - this.piecesScroller.rect.w / 2 + 80

            this.colorContainerScroller.y = 120
            this.piecesScroller.y = Game.Borders.height - (this.piecesScroller.rect.h * this.piecesScroller.scale.y) - 20
            // this.piecesScroller.y = this.colorContainerScroller.y - this.piecesScroller.rect.h - 40
            this.sectionList.y = Game.Borders.height - this.sectionList.height - 20


        } else {
            this.piecesScroller.x = Game.Borders.width - this.piecesScroller.rect.w - 20

            this.colorContainerScroller.y = Game.Borders.height - this.colorContainerScroller.rect.h - 20
            this.piecesScroller.y = this.colorContainerScroller.y - this.piecesScroller.rect.h - 40

            this.sectionList.y = 80

        }


        this.colorContainerScroller.x = this.piecesScroller.x;

        this.sectionListBottom.x = Game.Borders.width / 2 + 150;
        this.sectionListBottom.y = Game.Borders.height / 2 - this.sectionListBottom.height / 2;
    }
    rebuildPortraitScrollers() {

        this.piecesScroller.removeAllItems();
        this.piecesScroller.scale.set(1.5)
        this.piecesScroller.gridDimensions.j = Math.floor((Game.Borders.width - 90) / this.piecesScroller.scale.x / 100)
        this.piecesScroller.resize({ w: Game.Borders.width - 80, h: ((Game.Borders.height / 2) / this.piecesScroller.scale.y - 50) }, { width: 100, height: 100 })
        this.piecesScroller.addItens(this.currentShowingItems)

        this.colorContainerScroller.removeAllItems();
        this.colorContainerScroller.gridDimensions.j = this.piecesScroller.gridDimensions.j
        this.colorContainerScroller.resize({ w: Game.Borders.width - 80, h: 100 }, { width: 100, height: 100 })
        this.colorContainerScroller.addItens(this.currentShowingColors)
    }
    aspectChange(isPortrait) {

        if (isPortrait) {
            this.sectionList.scale.set(0.8)

            this.rebuildPortraitScrollers();
        } else {
            this.piecesScroller.scale.set(1)

            this.piecesScroller.removeAllItems();
            this.piecesScroller.gridDimensions.j = 3
            this.piecesScroller.resize({ w: 300, h: 450 }, { width: 100, height: 100 }, { x: 7.5, y: 7.5 })
            this.piecesScroller.addItens(this.currentShowingItems)

            this.colorContainerScroller.removeAllItems();
            this.colorContainerScroller.gridDimensions.j = 3
            this.colorContainerScroller.resize({ w: 300, h: 200 }, { width: 100, height: 100 }, { x: 7.5, y: 7.5 })
            this.colorContainerScroller.addItens(this.currentShowingColors)

            this.sectionList.scale.set(0.75)
        }
    }
}
