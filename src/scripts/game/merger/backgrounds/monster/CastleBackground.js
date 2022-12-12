import * as PIXI from 'pixi.js';
import CastleBackgroundBase from '../CastleBackgroundBase';

export default class CastleBackground extends CastleBackgroundBase {
    constructor() {
        super();
    }

    build() {

        this.skyColor = 0x402A77
        this.baseColor = new PIXI.Graphics().beginFill(this.skyColor).drawRect(-5000,-5000,10000,10000)
        this.baseContainer.addChild(this.baseColor)

        this.baseSky = new PIXI.Sprite.from('sky')
        this.baseSky.anchor.set(0.5, 0.5)
        this.baseSky.scale.set(2)
        this.baseContainer.addChild(this.baseSky)
        this.baseSky.y = 200

        this.tiledBackground = new PIXI.TilingSprite(PIXI.Texture.from('tiledStars', 256, 256))
		this.baseContainer.addChild(this.tiledBackground);
		this.tiledBackground.width = 5000
		this.tiledBackground.height = 5000
		this.tiledBackground.anchor.set(0.5)

        this.moon = new PIXI.Sprite.from('moon')
        this.moon.anchor.set(0.5)
        this.baseContainer.addChild(this.moon)
        this.moon.x = 50
        this.moon.y = -220
        this.moon.scale.set(1.8)

        this.castleBase = new PIXI.Sprite.from('castleBase')
        this.castleBase.anchor.set(0.5, 1)
        this.baseContainer.addChild(this.castleBase)
        this.castleBase.y = 180
        this.castleBase.scale.set(650 / this.castleBase.width)

        this.castleContainer = new PIXI.Container();
        this.baseContainer.addChild(this.castleContainer)

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


        this.castleSet = [
            { src: 'stairs', order: 0, pos: { x: 293.7, y: 676.45 } },
            { src: 'door1', order: 7, pos: { x: 282.35, y: 562.95 } },
            { src: 'frontTower1', order: 2, pos: { x: 374.6, y: 467.3 } },
            { src: 'side2', order: 1, pos: { x: 438.1, y: 540.5 } },
            { src: 'side1', order: 3, pos: { x: 115.05, y: 405 } },
            { src: 'side3', order: 4, pos: { x: 546.5, y: 516.5 } },
            { src: 'side4', order: 6, pos: { x: 680, y: 300 } },
            { src: 'sideTower', order: 5, pos: { x: 735.65, y: 340.35 } },
            { src: 'middle1', order: 8, pos: { x: 385.35, y: 387.25 } },
            { src: 'centerHouse1', order: 11, pos: { x: 274.3, y: 350 } },
            { src: 'leftTower', order: 15, pos: { x: 153, y: 110 } },
            { src: 'backforest', order: 20, pos: { x: 50, y: 348 } },
            { src: 'bridgeTower', order: 16, pos: { x: 500, y: 49.4 } },
            { src: 'sideHouse2', order: 10, pos: { x: 420.8, y: 277.15 } },
            { src: 'sideHouse1', order: 9, pos: { x: 535.95, y: 308.35 } },
            { src: 'side5', order: 17, pos: { x: 580.45, y: 0 } },
            { src: 'thinHouse', order: 12, pos: { x: 230.05, y: 250.25 } },
            { src: 'backTower', order: 19, pos: { x: 317.9, y: 0 } },
            { src: 'tower6', order: 15, pos: { x: 448.25, y: 91.7 } },
            { src: 'mainTower', order: 13, pos: { x: 301.1, y: 180 } },
            { src: 'statue1', order: 18, pos: { x: 325.2, y: 130 } },
            { src: 'spare', order: 8, pos: { x: 185.2, y: 360.05 } }
        ]


        this.castleContainer.x = -280
        this.castleContainer.y = -400
        this.castleContainer.scale.set(0.6)
    }
    
    resize(innerResolution, scale) {
        if (innerResolution && innerResolution.width && innerResolution.height) {

            this.innerResolution = innerResolution;

        }

    }

    update(delta) {
    }

}