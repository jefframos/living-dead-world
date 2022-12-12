import * as PIXI from 'pixi.js';
import CastleBackgroundBase from '../CastleBackgroundBase';

export default class HumanCastleBackground extends CastleBackgroundBase {
    constructor() {
        super();
    }

    build() {


        this.skyColor = 0x9DBEE9
        this.baseColor = new PIXI.Graphics().beginFill(this.skyColor).drawRect(-5000, -5000, 10000, 10000)
        this.baseContainer.addChild(this.baseColor)

        this.baseSky = new PIXI.Sprite.from('sky')
        this.baseSky.anchor.set(0.5, 0.5)
        this.baseSky.scale.set(2)
        this.baseContainer.addChild(this.baseSky)
        this.baseSky.y = 200

        this.tiledBackground = new PIXI.TilingSprite(PIXI.Texture.from('tiledStars', 128, 128))
        this.baseContainer.addChild(this.tiledBackground);
        this.tiledBackground.width = 5000
        this.tiledBackground.height = 5000
        this.tiledBackground.anchor.set(0.5)
        this.tiledBackground.alpha = 0.5


        this.cloud1 = new PIXI.Sprite.from('cloud2')
        this.cloud1.anchor.set(0.5)
        this.baseContainer.addChild(this.cloud1)

        this.cloud3 = new PIXI.Sprite.from('floud3')
        this.cloud3.anchor.set(0.5)
        this.baseContainer.addChild(this.cloud3)

        this.cloud1.x = -250
        this.cloud1.y = -400
        this.cloud3.x = 350
        this.cloud3.y = -400
        this.cloud1.scale.set(2)
        this.cloud3.scale.set(2)


        this.castleBase = new PIXI.Sprite.from('hbase')
        this.castleBase.anchor.set(0.5, 1)
        this.baseContainer.addChild(this.castleBase)
        this.castleBase.y = 130
        this.castleBase.x = -20
        this.castleBase.scale.set(650 / this.castleBase.width)

        
                this.castleContainer = new PIXI.Container();
                this.baseContainer.addChild(this.castleContainer)

        this.leftDetail = new PIXI.Sprite.from('backPinePatch1')
        this.leftDetail.scale.set(0.7)
        this.leftDetail.anchor.set(1, 0)
        this.leftDetail.x = -240
        this.leftDetail.y = -135
        this.baseContainer.addChild(this.leftDetail)


        this.rightDetail = new PIXI.Sprite.from('backPinePatch2')
        this.rightDetail.scale.set(0.7)
        this.rightDetail.x = 200
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
            { src: 'hcore1', order: 5, pos: { x:376,y:600} },
            { src: 'hdoor', order: 5, pos: { x:360,y:786} },
            { src: 'hcore2', order: 5, pos: { x:565,y:606} },
            { src: 'hcore3', order: 5, pos: { x:179,y:606} },
            { src: 'hfront1', order: 4, pos: { x:0,y:777} },
            { src: 'hfront2', order: 4, pos: { x:719,y:784} },
            { src: 'hmidcenter2', order: 8, pos: { x:542,y:448} },
            { src: 'hmidcenter1', order: 8, pos: { x:304,y:446} },
            { src: 'happend1', order: 9, pos: { x:436,y:665} },
            { src: 'htower1', order: 7, pos: { x:751,y:601} },
            { src: 'happend2', order: 7, pos: { x:798,y:658} },
            { src: 'hmidappend2', order: 15, pos: { x:101,y:526} },
            { src: 'happend3', order: 7, pos: { x:21,y:629} },
            { src: 'hmidappend1', order: 16, pos: { x:200,y:414} },
            { src: 'hmaster1', order: 10, pos: { x:325,y:262} },
            { src: 'htower6', order: 50, pos: { x:141,y:254} },
            { src: 'htower2', order: 17, pos: { x:350,y:120} },
            { src: 'htower5', order: 19, pos: { x:481,y:0} },
            { src: 'htower3', order: 15, pos: { x:597,y:240} },
            { src: 'happend4', order: 13, pos: { x:753,y:289} },
            { src: 'htower4', order: 15, pos: { x:477,y:56} },
        ]


        this.castleContainer.x = -250
        this.castleContainer.y = -420
        this.castleContainer.scale.set(0.45)

    }

    resize(innerResolution, scale) {
        if (innerResolution && innerResolution.width && innerResolution.height) {

            this.innerResolution = innerResolution;



            if (window.isPortrait) {
                this.cloud1.x = -250
                this.cloud1.y = -400
                this.cloud3.x = 350
                this.cloud3.y = -430
                this.cloud1.scale.set(2)
                this.cloud3.scale.set(2)
            }else{
                this.cloud1.x = -150
                this.cloud1.y = -430
                this.cloud3.x = 150
                this.cloud3.y = -400
                this.cloud1.scale.set(1)
                this.cloud3.scale.set(1)
            }
        }

    }

    update(delta) {
    }

}