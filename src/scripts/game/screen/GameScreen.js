import * as PIXI from 'pixi.js';
import * as dat from 'dat.gui';

import BaseEnemy from '../entity/BaseEnemy';
import CameraModule from '../modules/CameraModule';
import Engine from '../core/Engine';
import Game from '../../Game'
import GameAgent from '../modules/GameAgent';
import GameObject from '../core/GameObject';
import InputModule from '../modules/InputModule';
import Matter from 'matter-js';
import PerspectiveCamera from '../core/PerspectiveCamera';
import PhysicsModule from '../modules/PhysicsModule';
import Player from '../entity/Player';
import RenderModule from '../modules/RenderModule';
import Screen from '../../screenManager/Screen'
import Sensor from '../core/Sensor';
import Signals from 'signals';
import StaticPhysicObject from '../entity/StaticPhysicObject';
import TouchAxisInput from '../modules/TouchAxisInput';
import UIButton1 from '../ui/UIButton1';
import UIList from '../ui/uiElements/UIList';
import config from '../../config';

export default class GameScreen extends Screen {
    constructor(label) {
        super(label);

        this.container = new PIXI.Container()
        this.addChild(this.container);

        this.mapContainer = new PIXI.Container();
        this.bottomUI = new PIXI.Container();
        this.topUI = new PIXI.Container();

        this.container.addChild(this.mapContainer)
        this.container.addChild(this.topUI)
        this.container.addChild(this.bottomUI)


        this.labelText = new PIXI.Text('MAIN SCREEN')
        this.container.addChild(this.labelText)
        //this.particleContainer = new PIXI.ParticleContainer();

        // setTimeout(() => {

        //     PIXI.BitmapFont.from('fredokaone', {
        //         fill: "#333333",
        //         fontFamily:'fredokaone',
        //         fontSize: 40,
        //         fontWeight: 'bold',
        //     });


        //     const text = new PIXI.BitmapText("Hello World", { fontName: 'fredokaone' });
        //     this.container.addChild(text)
        // }, 50);


        this.baseContainer = new PIXI.TilingSprite(PIXI.Texture.from('tile_0049'), 16, 16);
        this.gameplayContainer = new PIXI.Container();

        this.baseContainer.anchor.set(0.5)
        this.baseContainer.tileScale.set(0.5)
        this.baseContainer.width = 5000
        this.baseContainer.height = 5000
        //this.baseContainer.tint = 0x333333
        this.container.addChild(this.baseContainer)
        this.container.addChild(this.gameplayContainer)


        this.gameEngine = new Engine();
        this.physics = this.gameEngine.physics
        this.renderModule = this.gameEngine.addGameObject(new RenderModule(this.gameplayContainer))
        this.inputModule = this.gameEngine.addGameObject(new InputModule())
        this.camera = this.gameEngine.addCamera(new PerspectiveCamera())

        this.followPoint = { x: 0, y: 0 }
        this.camera.setFollowPoint(this.followPoint)

        this.debug = {
            removeRandomPiece: () => {

                //this.destroyRandom(1);

                //return
                for (let index = 0; index < 50; index++) {
                    setTimeout(() => {
                        this.destroyRandom(1)
                    }, 5 * index);

                }
            },
            addRandomPiece: () => {
                //this.addRandomAgents(1);

                //return
                for (let index = 0; index < 100; index++) {
                    setTimeout(() => {
                        this.addRandomAgents(1)
                    }, 5 * index);

                }
            }
        }
        window.GUI.add(this.debug, 'removeRandomPiece');
        window.GUI.add(this.debug, 'addRandomPiece');

        window.GUI.close()
        
        // this.zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0,0,10)
        // this.addChild(this.zero)

        //this should be on the input
        this.touchAxisInput = new TouchAxisInput();

        this.addChild(this.touchAxisInput)

        this.touchAxisInput.x = config.width / 2
        this.touchAxisInput.y = config.height - 200


        this.helperButtonList = new UIList();
        this.helperButtonList.h = 200;
        this.helperButtonList.w = 60;
        this.speedUpToggle = new UIButton1(0x002299, 'fast_forward_icon', 0xFFFFFF, 60, 60)
        this.helperButtonList.addElement(this.speedUpToggle)
        this.speedUpToggle.onClick.add(() => {
            for (let index = 0; index < 100; index++) {
                setTimeout(() => {
                    this.addRandomAgents(1)
                }, 5 * index);

            }
        })

        this.removeEntities = new UIButton1(0x002299, 'icon_close', 0xFFFFFF, 60, 60)
        this.helperButtonList.addElement(this.removeEntities)
        this.removeEntities.onClick.add(() => {
            for (let index = 0; index < 100; index++) {
                setTimeout(() => {
                    this.destroyRandom(1)
                }, 5 * index);

            }
        })

        this.stats = new PIXI.Text('fps')
        this.stats.style.fill = 0xFFFFFF
        this.stats.style.fontSize = 14
        this.stats.anchor.set(0.5)
        this.helperButtonList.addElement(this.stats)

        this.helperButtonList.updateVerticalList()
        this.helperButtonList.x = 50
        this.helperButtonList.y = 50

        if (window.isMobile)
            this.addChild(this.helperButtonList)

        this.container.scale.set(1)
    }

    onAdded() {


    }
    destroyRandom(quant) {
        for (let index = 0; index < quant; index++) {
            if (this.gameEngine.gameObjects.length <= 0) continue;
            this.gameEngine.destroyGameObject(this.gameEngine.gameObjects[this.gameEngine.gameObjects.length - 1])
        }
    }
    addRandomAgents(quant) {
        for (let index = 0; index < quant; index++) {
            this.gameEngine.poolGameObject(BaseEnemy, true).setPosition(Math.random() * (config.width - 50) + 25, Math.random() * (config.height - 50) + 25)
        }
    }
    build(param) {
        super.build();
        this.addEvents();


        this.gameEngine.start();


        let i = 5
        let j = 8
        let chunkX = config.width / i
        let chunkY = config.height / j
        for (let index = 0; index <= i; index++) {
            for (let indexj = 0; indexj <= j; indexj++) {
                this.gameEngine.poolGameObject(StaticPhysicObject).build(chunkX * index, chunkY * indexj, 50, 50)
            }
        }




        this.player = this.gameEngine.poolGameObject(Player, true)
        this.player.setPosition(config.width / 2, config.height / 2)

console.log("TODO: improve naming, add bitmap text particle, world, investigate the island")

        // this.gameEngine.poolGameObject(StaticPhysicObject).build(config.width / 2, config.height, config.width, 60)
        // this.gameEngine.poolGameObject(StaticPhysicObject).build(-20, config.height / 2, 30, config.height)
        // this.gameEngine.poolGameObject(StaticPhysicObject).build(config.width, config.height / 2, 30, config.height)


        // let a = this.gameEngine.poolGameObject(BaseEnemy, true)
        // a.setPosition(config.width / 2, config.height / 2 - 100)
        // console.log(a)
        // this.gameEngine.poolGameObject(BaseEnemy, true).setPosition(config.width / 2, config.height / 2 - 100)
        // this.gameEngine.poolGameObject(BaseEnemy, true).position = { x: config.width / 2, y: config.height / 2 - 100 }
        // this.gameEngine.poolGameObject(BaseEnemy, true).position = { x: config.width / 2, y: config.height / 2 - 100 }
        // this.gameEngine.poolGameObject(BaseEnemy, true).position = { x: config.width / 2, y: config.height / 2 - 100 }
        // this.gameEngine.poolGameObject(BaseEnemy, true).position = { x: config.width / 2, y: config.height / 2 - 100 }
        this.addRandomAgents(1)

        for (let index = 0; index < 100; index++) {
            this.addRandomAgents(1)
        }
        for (let index = 0; index < 100; index++) {
            this.addRandomAgents(1)
        }
        // console.log(GameObject.Pool.pool)

        // setTimeout(() => {
        //     this.destroyRandom(50)
        //     console.log(GameObject.Pool.pool)
        // }, 100);

        // setTimeout(() => {
        //     this.addRandomAgents(30)
        //     console.log(GameObject.Pool.pool)
        // }, 500);

    }
    update(delta) {
        this.gameEngine.update(delta)
        this.inputModule.touchAxisDown = this.touchAxisInput.dragging
        if (this.touchAxisInput.angle) {
        }
        this.inputModule.direction = this.touchAxisInput.angle

        this.stats.text = window.FPS
        if (this.player) {
            this.followPoint.x = this.player.gameView.view.position.x
            this.followPoint.y = this.player.gameView.view.position.y
            //this.container.pivot.x = this.player.gameView.view.position.x //- config.width / 2
            //this.container.pivot.y = this.player.gameView.view.position.y //- config.height / 2
        }
    }
    transitionOut(nextScreen) {
        this.removeEvents();
        this.nextScreen = nextScreen;
        setTimeout(function () {
            this.endTransitionOut();
        }.bind(this), 0);
    }
    transitionIn() {
        super.transitionIn();
    }
    destroy() {

    }
    removeEvents() {
    }
    addEvents() {
        this.removeEvents();

    }
    resize(resolution, innerResolution) {
        if (!innerResolution || !innerResolution.height) return

        this.latestInner = innerResolution;
        if (!resolution || !resolution.width || !resolution.height || !innerResolution) {
            //return;
        }


        this.container.x = config.width / 2
        this.container.y = config.height / 2
    }
}