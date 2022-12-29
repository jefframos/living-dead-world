import * as signals from 'signals';

import Pool from "./Pool";
import Transform from "./Transform";
import BaseComponent from "./BaseComponent";

export default class GameObject extends BaseComponent {
    static Pool = new Pool();
    static ObjectCounter = 0;
    constructor() {
        super();
        this.gameObject = this;
        this.engineID = ++GameObject.ObjectCounter;
        this.transform = new Transform();
        this.children = []
        this.components = [];
        this.enabled = true;
        this.parent = null;
        this.gameObjectDestroyed = new signals.Signal();
        this.childAdded = new signals.Signal();
        this.childRemoved = new signals.Signal();
        this.rigidbodyAdded = new signals.Signal();
    }
    findComponent(type){
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
    addComponent(constructor) {
        let element = GameObject.Pool.getElement(constructor)
        this.components.push(element);
        element.gameObject = this;

        return element;
    }
    removeComponent(component) {
        this.components = this.components.filter(item => item !== component)
        GameObject.Pool.returnElement(component)
    }
    addChild(gameObject) {
        gameObject.setParent(this)
        this.childAdded.dispatch(this)
        this.children.push(gameObject);
    }
    get forward() {
        let rad = this.transform.angle // 180 * Math.PI
        return { x: Math.cos(rad), y: Math.sin(rad) }
    }
    /**
     * @param {number} value
     */
    set x(value) {
        this.transform.position.x = value
    }
    /**
     * @param {number} value
     */
    set y(value) {
        this.transform.position.y = value
    }
    setPosition(x, y) {
        this.x = x
        this.y = y
    }
    update(delta) {
        //console.log(this.children.length)
        this.children.forEach(element => {
            if (element.enabled) {
                element.update(delta);
            }
        });

        this.components.forEach(element => {
            if (element.enabled) {
                element.update(delta);
            }
        });
    }
    enable() {
        this.enabled = true;
        this.components.forEach(element => {
            element.enable();
        });
    }
    disable() {
        this.enabled = false;
        this.components.forEach(element => {
            element.disable();
        });
    }
    destroy() {
        this.gameObjectDestroyed.dispatch(this);

        if (this.parent) {
            this.parent.removeChild(this)
        }

        if (this.children.length) {
            for (let index = this.children.length - 1; index >= 0; index--) {
                const element = this.children[index];
                this.childRemoved.dispatch(element)
                element.destroy();
                this.children.splice(index, 1);
            }
        }
        this.components.forEach(element => {
            element.destroy();
            //element.removeAllSignals();
        });
        this.disable();
        GameObject.Pool.returnElement(this)
    }
    
    removeChild(child) {

        for (let index = 0; index < this.children.length; index++) {
            const element = this.children[index];
            if (element.engineID == child.engineID) {
                this.children.splice(index, 1)
                break
            }

        }
    }
    setParent(newParent) {
        if (this.parent && this.parent != newParent) {
            this.parent.removeChild(this)
        }
        this.parent = newParent;

    }
}