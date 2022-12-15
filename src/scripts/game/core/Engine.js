import PhysicsModule from "../modules/PhysicsModule";
import GameObject from "./GameObject";

export default class Engine {
    constructor() {
        this.gameObjects = []
        this.parentGameObject = new GameObject();
        this.physics = this.addGameObject(new PhysicsModule())
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
        element.engine = this;
        if(rebuild){
            element.build();
        }
        element.enable()
        return this.addGameObject(element);
    }
    poolAtRandomPosition(constructor, rebuild, bounds){
        let element = GameObject.Pool.getElement(constructor)
        element.engine = this;
        if(rebuild){
            element.build();
        }
        element.enable()
        element.x = Math.random() * (bounds.maxX - bounds.minX) + bounds.minX
        element.y = Math.random() * (bounds.maxY - bounds.minY) + bounds.minY
        return this.addGameObject(element);
    }
    addGameObject(gameObject) {
        gameObject.engine = this;
        gameObject.gameObjectDestroyed.add(this.wipeGameObject.bind(this))

        
        this.gameObjects.push(gameObject);
        this.parentGameObject.addChild(gameObject)
        
        // if(gameObject.body){
        //     this.physics.addAgent(gameObject)
        // }
        
        return gameObject;
    }
    destroyGameObject(gameObject) {
        gameObject.destroy()
    }
    wipeGameObject(gameObject) {

        Engine.RemoveFromListById(this.gameObjects, gameObject)
  
        if(gameObject.body){
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
        this.gameObjects.forEach(element => {
            element.start();
        })
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
    }

}