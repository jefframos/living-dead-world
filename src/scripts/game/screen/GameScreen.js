import * as PIXI from 'pixi.js';
import Screen from '../../screenManager/Screen'
import Signals from 'signals';
import Matter from 'matter-js';
import config from '../../config';
import Engine from '../core/Engine';
import PhysicsModule from '../modules/PhysicsModule';
import CameraModule from '../modules/CameraModule';
import RenderModule from '../modules/RenderModule';
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

        this.particleContainer = new PIXI.ParticleContainer();
        this.particleContainer.maxSize = 2000
        this.container.addChild(this.particleContainer)


        this.gameEngine = new Engine();
        this.physics = this.gameEngine.addGameObject(new PhysicsModule())
        this.camera = this.gameEngine.addGameObject(new CameraModule())
        this.renderModule = this.gameEngine.addGameObject(new RenderModule(this.particleContainer))
    }

    onAdded() {


    }
    build(param) {
        super.build();
        this.addEvents();


        this.gameEngine.start();

        this.physics.addRect(config.width / 2, 0, config.width, 60, { isStatic: true });
        this.physics.addRect(config.width / 2, config.height, config.width, 60, { isStatic: true });
        this.physics.addRect(-20, config.height / 2, 30, config.height, { isStatic: true });
        this.physics.addRect(config.width, config.height / 2, 30, config.height, { isStatic: true });



         for (let index = 0; index < 100; index++) {
            this.physics.addCircle(config.width * Math.random(), config.height * Math.random(), 10)
        }


        // // module aliases
        // this.Engine = Matter.Engine
        // var Runner = Matter.Runner
        // var Bodies = Matter.Bodies
        // var Composite = Matter.Composite;

        // // create an engine
        // this.engine = this.Engine.create({
        //     gravity: {
        //         scale: 0.001,
        //         x: 0,
        //         y: 0
        //     }
        // });

        // this.bodies = []

        // this.bodies.push(Bodies.circle(30, 800, 20, { friction: 0.00001, restitution: 0.5, density: 0.1 }));

        // this.bodies.push(Bodies.rectangle(config.width / 2, 0, config.width, 60, { isStatic: true }));
        // this.bodies.push(Bodies.rectangle(config.width / 2, config.height, config.width, 60, { isStatic: true }));
        // this.bodies.push(Bodies.rectangle(-20, config.height / 2, 30, config.height, { isStatic: true }));
        // this.bodies.push(Bodies.rectangle(config.width, config.height / 2, 30, config.height, { isStatic: true }));

        // // create two boxes and a ground
        // this.bodies.push(Bodies.circle(200, 50, 20))


        // for (let index = 0; index < 1500; index++) {
        //     this.bodies.push(Bodies.circle(config.width * Math.random(), config.height * Math.random(), 10))
        // }


        // // var stack = Matter.Composites.stack(20, 20, 20, 5, 0, 0, function(x, y) {
        // //     return Bodies.circle(x, y, Matter.Common.random(10, 20), { friction: 0.00001, restitution: 0.5, density: 0.001 });
        // // });
        // //Composite.add(this.engine.world, stack);
        // //

        // // { friction: 0.00001, restitution: 0.5, density: 0.001 }
       

        // this.views = []

        // this.bodies.forEach(element => {


        //     let view

        //     let founds = element.label.toLowerCase().indexOf("circle")
        //     console.log(founds, element.label)
        //     if (founds >= 0) {
        //         view = new PIXI.Sprite.from('new_item')
        //         view.anchor.set(0.5)
        //         view.width = element.circleRadius * 2
        //         view.height = element.circleRadius * 2
        //     } else {
        //         let bounds = {
        //             width: element.bounds.max.x - element.bounds.min.x,
        //             height: element.bounds.max.y - element.bounds.min.y,
        //         }
        //         bounds.x = -bounds.width / 2
        //         bounds.y = -bounds.height / 2
        //         view = new PIXI.Sprite.from('small-no-pattern-white')
        //         view.anchor.set(0.5)
        //         view.width = bounds.width
        //         view.height = bounds.height
        //     }

        //     this.particleContainer.addChild(view)
        //     this.views.push(view)
        // });

        // // add all of the bodies to the world
        // Composite.add(this.engine.world, this.bodies);

        // // create runner
        // var runner = Runner.create();

        // // run the engine
        // Runner.run(runner, this.engine);


    }
    update(delta) {
        // if (this.engine) {

        //     this.Engine.update(this.engine, 1000 / 60);


        //     for (let index = 0; index < this.bodies.length; index++) {
        //         const element = this.bodies[index];

        //         this.views[index].x = element.position.x
        //         this.views[index].y = element.position.y


        //     }
        //     var py = 1000

        //     Matter.Body.applyForce(this.bodies[0], this.bodies[0].position, { x: Math.cos(this.engine.timing.timestamp / 1000) * Math.sin(this.engine.timing.timestamp / 1000) * this.bodies[0].density, y: Math.cos(this.engine.timing.timestamp / 1000) * this.bodies[0].density })
        // }


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