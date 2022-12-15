
export default class Pool {
    constructor() {
        this.pool = {};
    }
    static Debug = false;
    getElement(constructor) {

        if (this.pool[constructor.name]) {
            let elements = this.pool[constructor.name];
            if (elements.length > 0) {
                let element = elements.pop();
                return element;
            }
        } else {
            this.pool[constructor.name] = []
        }

        let newElement = new constructor();
        if (Pool.Debug) {
            if (newElement.setDebug) {
                newElement.setDebug()
            }
        }
        return newElement;

    }

    returnElement(element) {
        if (!this.pool[element.constructor.name]) {
            this.pool[element.constructor.name] = []
        }

        this.pool[element.constructor.name].push(element)
    }
}