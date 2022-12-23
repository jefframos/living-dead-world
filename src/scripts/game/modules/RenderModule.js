import Engine from "../core/Engine";
import GameAgent from "./GameAgent";
import GameObject from "../core/GameObject";
import PhysicsEntity from "./PhysicsEntity";
import PhysicsModule from "./PhysicsModule";
import StaticPhysicObject from "../entity/StaticPhysicObject";
import config from "../../config";
import Layer from "../core/Layer";

export default class RenderModule extends GameObject {
    static RenderLayers = {
        Base: 'base',
        Debug: 'debug',
        Default: 'default',
        Gameplay: 'gameplay',
        Particles: 'particles'
    }
    constructor(container) {
        super();

        this.container = container;

        this.layers = {};
        this.layersArray = [];
        for (const key in RenderModule.RenderLayers) {
            const element = RenderModule.RenderLayers[key];
            let layer = new Layer(element)
            this.container.addChild(layer)
            this.layers[element] = layer;
            this.layersArray.push(layer)
        }

        this.renderStats = {
            totalRenderEntities: 0
        }
        window.GUI.add(this.renderStats, 'totalRenderEntities').listen();

        // this.cam = {
        //     x: 0, y: 250, z: 0, aspec: 1, fov: 5, near: 0, far: 200
        // }
        // window.GUI.add(this.renderStats, 'totalRenderEntities').listen();
        // for (const key in this.cam) {
        //     if (Object.hasOwnProperty.call(this.cam, key)) {

        //         window.GUI.add(this.cam, key).listen();


        //     }
        // }
    }
    start() {
        this.physics = this.engine.findByType(PhysicsModule)
        this.physics.entityAdded.add(this.newEntityAdded.bind(this))
    }
    newEntityAdded(entities) {
        entities.forEach(element => {
            if (element.gameView) {

                element.gameObjectDestroyed.add(this.elementDestroyed.bind(this))
                element.childAdded.add(this.newEntityAdded.bind(this))

                this.layers[element.gameView.layer].addChild(element.gameView.view)

            }
            if (element.debug) {
                this.layers[RenderModule.RenderLayers.Debug].addChild(element.debug)
            }

            if (element.shadow) {
                this.layers[RenderModule.RenderLayers.Base].addChild(element.shadow)
            }               
        });

    }
    elementDestroyed(element) {
        if (element.gameView) {
            this.layers[element.gameView.layer].removeChild(element.gameView.view)
        }
        //????????? why did i commented this?
        //Engine.RemoveFromListById(this.layers[element.gameView.layer].children, element.gameView.view)

        if (element.debug) {
            this.layers[RenderModule.RenderLayers.Debug].removeChild(element.debug)
        }

        if (element.shadow) {
            this.layers[RenderModule.RenderLayers.Base].removeChild(element.shadow)
        }
    }
    onRender() {
        if (!this.physics) return

        this.layersArray.forEach(element => {
            element.onRender();
        });
        
        this.renderStats.totalRenderEntities = this.layers[RenderModule.RenderLayers.Gameplay].children.length;

        
    }
}