import * as PIXI from 'pixi.js';
import * as dat from 'dat.gui';

import BaseEnemy from '../entity/BaseEnemy';
import BasicFloorRender from '../manager/BasicFloorRender';
import EffectsManager from '../manager/EffectsManager';
import Eugine from '../core/Eugine';
import GameManager from '../manager/GameManager';
import InputModule from '../core/modules/InputModule';
import PerspectiveCamera from '../core/PerspectiveCamera';
import Player from '../entity/Player';
import RenderModule from '../core/modules/RenderModule';
import Screen from '../../screenManager/Screen'
import StaticPhysicObject from '../entity/StaticPhysicObject';
import TouchAxisInput from '../core/modules/TouchAxisInput';
import Trees from '../entity/Trees';
import UIButton1 from '../ui/UIButton1';
import UIList from '../ui/uiElements/UIList';
import config from '../../config';

export default class GameScreen extends Screen {
    constructor(label) {
        super(label);

        this.container = new PIXI.Container()
        this.addChild(this.container);

        //this.particleContainer = new PIXI.ParticleContainer();

        // setTimeout(() => {

        //     PIXI.BitmapFont.from('fredokaone', {
        //         fill: "#333333",
        //         fontFamily:'fredokaone',
        //         fontSize: 40,
        //         fontWeight: 'bold',
        //     });




        PIXI.BitmapFont.from('damage1', {
            fontFamily: 'retro',
            align: "center",
            dropShadow: true,
            dropShadowAngle: 1.5,
            fontSize: 14,
            dropShadowDistance: 3,
            fill: "#ffcd1a",
            fontWeight: "bold",
            letterSpacing: 5,
            strokeThickness: 3,
            wordWrap: true,
            wordWrapWidth: 300
        });
        //     const text = new PIXI.BitmapText("Hello World", { fontName: 'fredokaone' });
        //     this.container.addChild(text)
        // }, 50);
        // const text = new PIXI.BitmapText("150", { fontName: 'damage1' });
        //     this.topUI.addChild(text)

        this.baseContainer = new PIXI.TilingSprite(PIXI.Texture.from('grass'), 45, 45);
        this.gameplayContainer = new PIXI.Container();
        this.effectsContainer = new PIXI.Container();

        this.baseContainer.anchor.set(0.5)
        this.baseContainer.tileScale.set(2.5)
        this.baseContainer.width = 5000
        this.baseContainer.height = 5000
        //this.baseContainer.tint = 0x333333
        //this.container.addChild(this.baseContainer)
        this.container.addChild(this.gameplayContainer)
        this.container.addChild(this.effectsContainer)

        this.gameEngine = new Eugine();


        this.worldTestContainer = new PIXI.Container();
        //this.worldManager = new WorldManager(this.worldTestContainer)
        this.addChild(this.worldTestContainer)



        this.physics = this.gameEngine.physics
        this.renderModule = this.gameEngine.addGameObject(new RenderModule(this.gameplayContainer))
        this.inputModule = this.gameEngine.addGameObject(new InputModule(this))
        this.camera = this.gameEngine.addCamera(new PerspectiveCamera())
        this.effectsManager = this.gameEngine.addGameObject(new EffectsManager(this.effectsContainer, this.gameplayContainer))


        this.followPoint = { x: 0, y: 0 }
        this.camera.setFollowPoint(this.followPoint)

        this.gameManager = new GameManager(this.gameEngine);

        this.debug = {
            timeScale: 1,
            REMOVE_ENEMIES: () => {

                //this.destroyRandom(1);

                //return
                for (let index = 0; index < 50; index++) {
                    setTimeout(() => {
                        this.destroyRandom(1)
                    }, 5 * index);

                }
            },
            ADD_ENEMIES: () => {
                //this.addRandomAgents(1);

                //return
                for (let index = 0; index < 100; index++) {
                    setTimeout(() => {
                        this.addRandomAgents(1)
                    }, 5 * index);

                }
            }
        }
        window.GUI.add(this.debug, 'timeScale', 0.1, 10);
        window.GUI.add(this.debug, 'REMOVE_ENEMIES');
        window.GUI.add(this.debug, 'ADD_ENEMIES');

        //window.GUI.close()

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
        this.stats.style.fontSize = 20
        this.stats.style.align = 'right'
        this.stats.anchor.set(1)
        this.helperButtonList.addElement(this.stats)

        this.helperButtonList.updateVerticalList()
        this.helperButtonList.x = config.width - 50
        this.helperButtonList.y = 80

        if (window.isMobile) {
            window.GUI.close()
            window.GUI.hide()
            this.addChild(this.helperButtonList)
        }

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


            let enemy = GameManager.instance.addEntity(BaseEnemy, true)
            //this.engine.poolAtRandomPosition(BaseEnemy, true, {minX:50, maxX: config.width, minY:50, maxY:config.height})
            let angle = Math.PI * 2 * Math.random();
            enemy.x = this.player.transform.position.x + Math.cos(angle) * config.width + Math.random() * 400
            enemy.y = this.player.transform.position.y + Math.sin(angle) * config.height + Math.random() * 300

        }
    }
    spawnPlayer() {
        this.player = this.gameManager.addEntity(Player, true)

        let angle = Math.PI * 2 * Math.random();
        this.player.setPosition(config.width / 2 + Math.cos(angle) * config.width, config.height / 2 + Math.sin(angle) * config.height)
        //this.debug.ADD_ENEMIES();
        this.player.onDie.add(() => {
            this.spawnPlayer()
            //this.debug.REMOVE_ENEMIES();
        })
    }
    build(param) {
        super.build();
        this.addEvents();
        this.gameEngine.start();

        let i = 5
        let j = 8
        let chunkX = (config.width * 2) / i
        let chunkY = (config.height * 2) / j
        for (let index = 0; index <= i; index++) {
            for (let indexj = 0; indexj <= j; indexj++) {
                let targetPosition = { x: chunkX * index - 500 + (Math.random() * chunkX / 2), y: chunkY * indexj - 500 + (Math.random() * chunkY / 2) }
                if (Math.random() < 0.5) {
                    this.gameManager.addEntity(Trees).build(targetPosition.x, targetPosition.y, 50, 50)
                } else {

                    this.gameManager.addEntity(StaticPhysicObject).build(targetPosition.x, targetPosition.y, 50, 50)
                }
            }
        }

        this.spawnPlayer();
        this.worldRender = this.gameEngine.addGameObject(new BasicFloorRender())


        //let firstNode = WorldManager.instance.getFirstNode();        
        //this.player.setPosition(firstNode.center.x * WorldManager.instance.scale, firstNode.center.y * WorldManager.instance.scale)        
        // WorldManager.instance.setPlayer(this.player);

        setTimeout(() => {
            this.camera.snapFollowPoint()
        }, 1);

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
        //this.addRandomAgents(1)

        for (let index = 0; index < 600; index++) {
            this.addRandomAgents(1)
        }
        // for (let index = 0; index < 100; index++) {
        //     this.addRandomAgents(1)
        // }
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
        delta *= this.debug.timeScale;
        this.gameEngine.update(delta)

        if (window.isMobile) {

            this.inputModule.touchAxisDown = this.touchAxisInput.dragging
            if (this.touchAxisInput.angle) {
            }
            this.inputModule.direction = this.touchAxisInput.angle
            this.touchAxisInput.visible = true;
        } else {
            this.touchAxisInput.visible = false;
        }

        this.stats.text = 'FPS: ' + window.FPS + '\nPhys: ' + this.physics.physicsStats.totalPhysicsEntities
        if (this.player) {
            this.followPoint.x = this.player.gameView.view.position.x
            this.followPoint.y = this.player.gameView.view.position.y
            //this.container.pivot.x = this.player.gameView.view.position.x //- config.width / 2
            //this.container.pivot.y = this.player.gameView.view.position.y //- config.height / 2
        }

        //WorldManager.instance.update(delta);
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