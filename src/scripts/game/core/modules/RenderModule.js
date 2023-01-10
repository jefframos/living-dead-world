import GameObject from "../gameObject/GameObject";
import Layer from "../Layer";
import PhysicsModule from "./PhysicsModule";

export default class RenderModule extends GameObject {
    static RenderLayers = {
        Base: 'base',
        Debug: 'debug',
        Default: 'default',
        Floor: '_p_floor',
        Building: 'building',
        Gameplay: 'gameplay',
        Particles: 'particles'
    }
    static UILayer = 'UI';
    constructor(container, uiContainer) {
        super();

        this.container = container;
        this.uiContainer = uiContainer;

        this.views = [];

        this.layers = {};
        this.layersArray = [];
        for (const key in RenderModule.RenderLayers) {
            const element = RenderModule.RenderLayers[key];
            let container = null;
            let sortable = true;
            if(element.indexOf('_p_')>=0){
                container = new PIXI.ParticleContainer(800, {tint:true});
                sortable = false;
            }else{
                container = new PIXI.Container()
            }
            let layer = new Layer(element, container, sortable)
            this.container.addChild(layer.container)
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
        //this.physics.entityAdded.add(this.newEntityAdded.bind(this))
        this.engine.entityAdded.add(this.newEntityAdded.bind(this))
    }
    newEntityAdded(entities) {
        entities.forEach(element => {
            if (element.gameView) {
                
                element.gameObjectDestroyed.add(this.elementDestroyed.bind(this))
                //element.childAdded.add(this.newEntityAdded.bind(this))
                if (element.gameView.layer == RenderModule.UILayer) {
                    this.uiContainer.addChild(element.gameView.view)

                } else {
                    this.layers[element.gameView.layer].addGameView(element.gameView)
                }

            }
            if (element.debug) {
                this.layers[RenderModule.RenderLayers.Debug].addChild(element.debug)
            }

            if (element.shadow) {
                this.layers[RenderModule.RenderLayers.Floor].addChild(element.shadow)
            }
        });

    }
    elementDestroyed(element) {
        if (element.gameView.layer == RenderModule.UILayer) {
            this.uiContainer.removeChild(element.gameView.view)

        } else if (element.gameView) {
            this.layers[element.gameView.layer].removeGameView(element.gameView)

        }
        //????????? why did i commented this?
        //Engine.RemoveFromListById(this.layers[element.gameView.layer].children, element.gameView.view)

        if (element.debug) {
            this.layers[RenderModule.RenderLayers.Debug].removeChild(element.debug)
        }

        if (element.shadow) {
            this.layers[RenderModule.RenderLayers.Floor].removeChild(element.shadow)
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