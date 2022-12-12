import * as PIXI from 'pixi.js';
import CastleBackgroundBase from '../CastleBackgroundBase';

export default class FairyCastleBackground extends CastleBackgroundBase {
    constructor() {
        super();
    }

    build() {

        this.skyColor = 0x74CFE3
        this.baseColor = new PIXI.Graphics().beginFill(0x74CFE3).drawRect(-5000,-5000,10000,10000)
        this.baseContainer.addChild(this.baseColor)

        this.baseSky = new PIXI.Sprite.from('sky')
        this.baseSky.anchor.set(0.5, 0.5)
        this.baseSky.scale.set(2)
        this.baseSky.alpha = 0.2
        this.baseContainer.addChild(this.baseSky)
        this.baseSky.y = 200


        this.sun = new PIXI.Sprite.from('sun')
        this.sun.anchor.set(0.5)
        this.baseContainer.addChild(this.sun)
        this.sun.x = 0
        this.sun.y = -320
        this.sun.scale.set(1)

        this.castleBase = new PIXI.Sprite.from('fbase')
        this.castleBase.anchor.set(0.5, 1)
        this.baseContainer.addChild(this.castleBase)
        this.castleBase.y = 180
        this.castleBase.scale.set(650 / this.castleBase.width)


        this.leftDetail = new PIXI.Sprite.from('backPinePatch1')
        this.leftDetail.scale.set(0.7)
        this.leftDetail.anchor.set(1, 0)
        this.leftDetail.x = -190
        this.leftDetail.y = -135
        this.baseContainer.addChild(this.leftDetail)


        this.rightDetail = new PIXI.Sprite.from('backPinePatch2')
        this.rightDetail.scale.set(0.7)
        this.rightDetail.x = 170
        this.rightDetail.y = -155
        this.baseContainer.addChild(this.rightDetail)

        this.bottomTree = new PIXI.Sprite.from('bottomTreePatch')
        this.bottomTree.anchor.set(0.5, 1)
        this.baseContainer.addChild(this.bottomTree)
        this.bottomTree.x = 0
        this.bottomTree.y = 280
        this.bottomTree.scale.set(650 / this.bottomTree.width)

        this.bottomTree2 = new PIXI.Sprite.from('bottomTreePatch')
        this.bottomTree2.anchor.set(0.5, 1)
        this.baseContainer.addChild(this.bottomTree2)
        this.bottomTree2.x = 0
        this.bottomTree2.y = 380
        this.bottomTree2.scale.set(650 / this.bottomTree2.width)


        this.castleContainer = new PIXI.Container();
        this.baseContainer.addChild(this.castleContainer)


        this.castleSet = [
            { src: 'fbase2', order: 0, pos: { x:196, y:433} },
            { src: 'fbase1', order: 0, pos: { x:11, y:425} },
            { src: 'fbase3', order: 2, pos: { x:445, y:456} },
            { src: 'fcore1', order: 1, pos: { x:276, y:296} },
            { src: 'fcore2', order: 3, pos: { x:374, y:293} },
            { src: 'fcore3', order: 4, pos: { x:123, y:293} },
            { src: 'ffrontbushes', order: 0, pos: { x:250, y:500} },
            { src: 'fwell', order: 0, pos: { x:120, y:600 } },
            { src: 'ftower5', order: 6, pos: { x:73, y:256} },
            { src: 'fbackhouse', order: 5, pos: { x:458, y:364} },
            { src: 'ftower1', order: 0, pos: { x:364, y:121} },
            { src: 'ftower2', order: 0, pos: { x:175, y:115} },
            { src: 'ftower4', order: 3, pos: { x:582, y:210} },
            { src: 'fstruct3', order: 2, pos: { x:147, y:145} },
            { src: 'fstruct5', order: 16, pos: { x:108, y:176} },
            { src: 'backforest', order: 100, pos: { x:-50, y:330} },
            { src: 'ftower3', order: 9, pos: { x:466, y:130} },
            { src: 'fstruct1', order: 2, pos: { x:364, y:106} },
            { src: 'fstruct2', order: 8, pos: { x:159, y:92} },
            { src: 'fbacktower', order: 15, pos: { x:418, y:0} },
            { src: 'ftopTower', order: 1, pos: { x:260, y:32} },
        ]


        this.castleContainer.x = -200
        this.castleContainer.y = -380
        this.castleContainer.scale.set(0.55)

    }
    
    resize(innerResolution, scale) {
        if (innerResolution && innerResolution.width && innerResolution.height) {

            this.innerResolution = innerResolution;

        }

    }

    update(delta) {
    }

}