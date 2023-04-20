import * as PIXI from 'pixi.js';

import BaseButton from '../components/ui/BaseButton';
import Game from '../../Game';
import InteractableView from '../view/card/InteractableView';
import PlayerGameViewSpriteSheet from '../components/PlayerGameViewSpriteSheet';
import PlayerViewStructure from '../entity/PlayerViewStructure';
import Screen from '../../screenManager/Screen';
import UIList from '../ui/uiElements/UIList';
import Utils from '../core/utils/Utils';
import signals from "signals";

export default class CharacterBuildScreen extends Screen {
    constructor(label, targetContainer) {
        super(label, targetContainer);


        this.container = new PIXI.Container()
        this.addChild(this.container);

        this.buttonsList = new UIList();
        this.container.addChild(this.buttonsList);


        this.buttonsList.addElement(Utils.getCloseButton(() => { this.screenManager.backScreen() }), { align: 0 })
        this.buttonsList.addElement(Utils.getPrimaryButton(() => { this.randomize() }), { align: 0 })

        this.buttonsList.w = 250
        this.buttonsList.h = 100;

        this.buttonsList.updateHorizontalList();




        this.playerPreview = new PIXI.Sprite();
        this.playerPreviewStructure = new PlayerGameViewSpriteSheet();

        this.playerPreviewStructure.enable();
        this.playerPreviewStructure.baseScale = 1
        this.playerPreviewStructure.sinSpeed = 2

        this.areas = [
            { param: 'arms', area: "arms", subs: ["backArm", "frontArm"], pivot: { x: 35, y: 140 }, mainIconId: '01', iconSize: 150, range: [1, 1], src: ["front-arm00{frame}", "front-arm00{frame}"], animated: false },

            { param: 'leg', area: "legs", subs: ["backLeg", "frontLeg"], pivot: { x: 65, y: 180 }, mainIconId: '1', iconSize: 150, range: [1, 1], src: ["back-leg{frame}-00", "front-leg{frame}-00"], animated: true },
            { param: 'shoe', area: "shoes", subs: ["backShoes", "frontShoes"], pivot: { x: 65, y: 180 }, mainIconId: '1', iconSize: 150, range: [1, 1], src: ["back-shoe{frame}00", "front-shoe{frame}00"], animated: true },
            { param: 'topHead', area: "hair", subs: ["topHead", "backHead"], pivot: { x: 65, y: 70 }, mainIconId: '01', iconSize: 150, range: [0, 28], src: ["top-head-00{frame}", "back-head-00{frame}"], animated: false },


            { param: 'sleeves', area: "sleeve", pivot: { x: 35, y: 140 }, mainIconId: '02', iconSize: 150, range: [1, 2], src: ["sleeve-00{frame}"] },
            { param: 'chest', area: "chest", anchor: { x: 0.43, y: 0.6 }, mainIconId: '01', iconSize: 150, range: [1, 21], src: "chest-00{frame}", animated: false },
            { param: 'head', area: "head", anchor: { x: 0.45, y: 0.42 }, mainIconId: '01', iconSize: 150, range: [1, 4], src: "head-00{frame}", animated: false },
            { param: 'eyes', area: "eyes", anchor: { x: 0.57, y: 0.43 }, mainIconId: '01', iconSize: 200, range: [1, 19], src: "eyes-00{frame}", animated: false },
            { param: 'mouth', area: "mouth", anchor: { x: 0.57, y: 0.52 }, mainIconId: '11', iconSize: 250, range: [1, 20], src: "mouth-00{frame}", animated: false },
            { param: 'frontFace', area: "frontFace", anchor: { x: 0.57, y: 0.5 }, mainIconId: '01', iconSize: 200, range: [0, 8], src: "front-face-00{frame}", animated: false },
            { param: 'hat', area: "hat", anchor: { x: 0.47, y: 0.35 }, mainIconId: '01', iconSize: 150, range: [0, 21], src: "hat-00{frame}", animated: false }]



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
            const button = Utils.getPrimaryButton(() => { this.openSection(element) })
            if (!Array.isArray(element.src)) {
                const src = element.src.replace('{frame}', element.mainIconId)
                button.addIcon(src, element.iconSize, element.anchor)
            } else {
                const iconContainer = new PIXI.Container();
                element.src.forEach(srcSub => {
                    const src = srcSub.replace('{frame}', element.mainIconId) + (element.animated ? '01' : '')
                    const sprite = new PIXI.Sprite.from(src);
                    iconContainer.addChild(sprite)
                });
                button.addIconContainer(iconContainer, element.iconSize, element.pivot)

            }

            if (count >= 5) {
                this.sectionListBottom.addElement(button, { align: 0, vAlign: 0 })
                this.sectionListBottom.h += 100;
            } else {

                this.sectionList.addElement(button, { align: 0, vAlign: 0 })
                this.sectionList.h += 100;
                count++
            }
        });
        this.sectionList.updateVerticalList();
        this.sectionListBottom.updateVerticalList();

        this.playerPreviewStructure.view = this.playerPreview
        this.playerPreviewStructure.setData({})

        this.playerViewStructure = new PlayerViewStructure();
        this.playerPreviewStructure.buildSpritesheet(this.playerViewStructure)
        this.container.addChild(this.playerPreview);

        this.playerViewStructure.onStructureUpdate.add(this.structureUpdate.bind(this))

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
    structureUpdate(region, value) {

    }
    openSection(region, value) {
        this.playerViewStructure[region.param] = Math.round(Utils.randomRange(region.range[0], region.range[1]))
    }

    update(delta) {
        this.buttonsList.x = 20;
        this.buttonsList.y = 20;

        this.playerPreview.x = Game.Borders.width / 2;
        this.playerPreview.y = Game.Borders.height / 2;

        this.sectionList.x =  Game.Borders.width / 2 - 250;
        this.sectionList.y = Game.Borders.height / 2 - this.sectionList.height / 2;

        this.sectionListBottom.x = Game.Borders.width / 2 + 150;
        this.sectionListBottom.y = Game.Borders.height / 2 - this.sectionListBottom.height / 2;

        var min = Game.GlobalScale.max;
        this.playerPreviewStructure.baseScale = Math.min(1.5, min);

        this.playerPreviewStructure.update(delta)
    }
}