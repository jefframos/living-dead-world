import * as signals from 'signals';

import GameObject from "./gameObject/GameObject";
import PhysicsModule from "./modules/PhysicsModule";
import Pool from './utils/Pool';

export default class Eugine {
    constructor() {
        this.entityAdded = new signals.Signal()
        this.gameObjects = []
        this.parentGameObject = new GameObject();
        this.physics = this.addGameObject(new PhysicsModule())

        this.engineStats = {
            totalGameObjects: 0
        }
        window.GUI.add(this.engineStats, 'totalGameObjects').listen();

        this.started = false;

    }
    static RemoveFromListById(list, gameObject) {
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.engineID == gameObject.engineID) {
                list.splice(index, 1)
                break
            }

        }
    }
    addCamera(camera) {
        this.camera = this.addGameObject(camera);

        return this.camera;
    }
    poolGameObject(constructor, rebuild) {
        let element = Pool.instance.getElement(constructor)
        if (element.removeAllSignals) {
            element.removeAllSignals();
        }

        element.engine = this;
        element.enable()
        let go = this.addGameObject(element);
        if (rebuild) {
            element.build();
        }
        return go;
    }
    poolAtRandomPosition(constructor, rebuild, bounds) {
        let element = Pool.instance.getElement(constructor)
        element.engine = this;

        element.enable()
        let go = this.addGameObject(element);
        if (rebuild) {
            go.build();
        }
        go.x = Math.random() * (bounds.maxX - bounds.minX) + bounds.minX
        go.y = Math.random() * (bounds.maxY - bounds.minY) + bounds.minY
        return go;
    }
    addGameObject(gameObject) {
        gameObject.engine = this;

        gameObject.gameObjectDestroyed.add(this.wipeGameObject.bind(this))
        gameObject.childAdded.add(this.addGameObject.bind(this))

        this.gameObjects.push(gameObject);
        this.parentGameObject.addChild(gameObject)

        for (let index = 0; index < gameObject.children.length; index++) {
            const element = gameObject.children[index];
            if (element instanceof GameObject) {
                element.engine = this;
            }
        }

        if (this.started) {

            gameObject.start()
        }

        this.entityAdded.dispatch([gameObject])
        return gameObject;
    }
    addRigidBody(gameObject) {
        this.physics.addAgent(gameObject)
    }
    destroyGameObject(gameObject) {
        gameObject.destroy()
    }
    wipeGameObject(gameObject) {

        Eugine.RemoveFromListById(this.gameObjects, gameObject)

        if (gameObject.rigidBody) {
            this.physics.removeAgent(gameObject)
        }
    }
    findByType(type) {
        let elementFound = null

        for (let index = 0; index < this.gameObjects.length; index++) {
            const element = this.gameObjects[index];
            if (element instanceof type) {
                elementFound = element;
                break
            }
        }
        return elementFound;
    }
    start() {
        if (this.started) {
            return
        }
        this.started = true
        this.gameObjects.forEach(element => {
            element.start();
        })
    }

    update(delta) {
        if (!this.started) {
            return
        }
        this.gameObjects.forEach(element => {
            if (element.update && element.enabled) {
                element.update(delta);
            }
        });

        this.gameObjects.forEach(element => {
            if (element.onRender && element.enabled) {
                element.onRender();
            }
        });

        this.engineStats.totalGameObjects = this.gameObjects.length
    }

}