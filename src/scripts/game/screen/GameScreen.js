import * as PIXI from 'pixi.js';
import Screen from '../../screenManager/Screen'
import Signals from 'signals';
import Matter from 'matter-js';
import config from '../../config';
import Engine from '../core/Engine';
import PhysicsModule from '../modules/PhysicsModule';
import CameraModule from '../modules/CameraModule';
import RenderModule from '../modules/RenderModule';
import GameAgent from '../modules/GameAgent';

import * as dat from 'dat.gui';
import StandardZombie from '../entity/StandardZombie';
import Player from '../entity/Player';
import InputModule from '../modules/InputModule';


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

        this.debugContainer = new PIXI.Container();
        this.shadowContainer = new PIXI.ParticleContainer();
        this.entitiesContainer = new PIXI.Container();

        this.container.addChild(this.shadowContainer)
        this.container.addChild(this.entitiesContainer)
        this.container.addChild(this.debugContainer)


        this.gameEngine = new Engine();
        this.physics = this.gameEngine.addGameObject(new PhysicsModule())
        this.camera = this.gameEngine.addGameObject(new CameraModule())
        this.renderModule = this.gameEngine.addGameObject(new RenderModule(this.entitiesContainer, this.shadowContainer, this.debugContainer))
        this.inputModule = this.gameEngine.addGameObject(new InputModule())


        this.debug = {
            removeRandomPiece: () => {

                for (let index = 0; index < 100; index++) {
                    setTimeout(() => {                        
                        this.physics.destroyRandom(2);
                    }, 5 * index);
                    
                }
            },
            addRandomPiece: () => {
                for (let index = 0; index < 100; index++) {
                    setTimeout(() => {                        
                        this.addRandomAgents(1);
                    }, 5 * index);
                    
                }
            }
        }
        window.GUI.add(this.debug, 'removeRandomPiece');
        window.GUI.add(this.debug, 'addRandomPiece');
    }

    onAdded() {


    }
    addRandomAgents(quant) {
        for (let index = 0; index < quant; index++) {
            let agent = new StandardZombie();
            agent.x = Math.random() * (config.width - 50) + 25
            agent.y = Math.random() * (100 - 50) + 25
            this.physics.addAgent(agent)
        }
    }
    build(param) {
        super.build();
        this.addEvents();


        this.gameEngine.start();

                
        for (let index = 0; index < 10; index++) {
            let agent = new StandardZombie();
            agent.x = Math.random() * (config.width - 50) + 25
            agent.y = Math.random() * (config.height - 50) + 25
            this.physics.addAgent(agent)
        }


        let player = new Player();
        player.x =(config.width/2)
        player.y =(config.height/2)
        this.physics.addAgent(player)

        this.physics.staticRect(config.width / 2, 0, config.width, 60, { isStatic: true });
        this.physics.staticRect(config.width / 2, config.height, config.width, 60, { isStatic: true });
        this.physics.staticRect(-20, config.height / 2, 30, config.height, { isStatic: true });
        this.physics.staticRect(config.width, config.height / 2, 30, config.height, { isStatic: true });

    }
    update(delta) { 
        this.gameEngine.update(delta)

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
    }
}