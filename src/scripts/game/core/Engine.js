import GameObject from "./GameObject";
import PhysicsModule from "../modules/PhysicsModule";

export default class Engine {
    constructor() {
        this.gameObjects = []
        this.parentGameObject = new GameObject();
        this.physics = this.addGameObject(new PhysicsModule())

        this.engineStats = {
            totalGameObjects: 0
        }
        window.GUI.add(this.engineStats, 'totalGameObjects').listen();

    }
    static RemoveFromListById(list, gameObject){
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if(element.engineID == gameObject.engineID){
                list.splice(index, 1)
                break
            }
            
        }
    }
    poolGameObject(constructor, rebuild){
        let element = GameObject.Pool.getElement(constructor)
        if(element.removeAllSignals){
            element.removeAllSignals();
        }

        element.engine = this;
        element.enable()
        let go = this.addGameObject(element);
        if(rebuild){
            element.build();
        }
        return go;
    }
    poolAtRandomPosition(constructor, rebuild, bounds){
        let element = GameObject.Pool.getElement(constructor)
        element.engine = this;
     
        element.enable()
        let go = this.addGameObject(element);
        if(rebuild){
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
        //gameObject.rigidbodyAdded.add(this.addRigidBody.bind(this))

        this.gameObjects.push(gameObject);
        this.parentGameObject.addChild(gameObject)
        
        // if(gameObject.rigidBody){
        //     this.addRigidBody(gameObject)
        // }

        for (let index = 0; index < gameObject.children.length; index++) {
            const element = gameObject.children[index];
            if(element instanceof GameObject){
                element.engine = this;
                console.log("CHILD ADD ", element)
                //this.addGameObject(element)
            }
        }

        gameObject.start()
        return gameObject;
    }
    addRigidBody(gameObject){
        this.physics.addAgent(gameObject)
    }
    destroyGameObject(gameObject) {
        gameObject.destroy()
    }
    wipeGameObject(gameObject) {

        Engine.RemoveFromListById(this.gameObjects, gameObject)
        
        if(gameObject.rigidBody){
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
        // this.gameObjects.forEach(element => {
        //     element.start();
        // })
    }

    update(delta) {
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