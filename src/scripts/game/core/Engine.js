export default class Engine {
    constructor() {
        this.gameObjects = []
        window.objectCounter = 0;
    }
    addGameObject(gameObject) {
        gameObject.engine = this;
        gameObject.engineID = ++window.objectCounter;
        gameObject.gameObjectDestroyed.add(this.wipeGameObject.bind(this))
        this.gameObjects.push(gameObject);

        return gameObject;
    }
    destroyGameObject(gameObject) {
        gameObject.destroy()
    }
    wipeGameObject(gameObject) {
        var elementPos = this.gameObjects.map(function (x) { return x.engineID; }).indexOf(gameObject.engineID);
        this.gameObjects.splice(elementPos, 1)
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