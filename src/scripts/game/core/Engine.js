export default class Engine {
    constructor() {
        this.gameObjects = []
    }
    addGameObject(gameObject) {
        gameObject.engine = this;
        this.gameObjects.push(gameObject);

        return gameObject;
    }
    destroyGameObject(gameObject) {

    }
    findByType(type){
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