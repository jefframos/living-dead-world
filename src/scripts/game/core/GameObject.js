import * as signals from 'signals';

import Pool from "./Pool";
import Transform from "./Transform";

export default class GameObject {
    static Pool = new Pool();
    static ObjectCounter = 0;
    constructor() {
        this.engineID = ++GameObject.ObjectCounter;
        this.transform = new Transform();
        this.children = []
        this.enabled = true;
        this.parent = null;

        this.gameObjectDestroyed = new signals.Signal();
        this.childAdded = new signals.Signal();
        this.childRemoved = new signals.Signal();
    }

    addChild(gameObject) {
        gameObject.setParent(this)
        gameObject.start();
        this.childAdded.dispatch(this)
        this.children.push(gameObject);
    }
    reset() {

    }
    build() {
    }
    start() {
    }
    onRender() {

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
    }
    enable() {
        this.enabled = true;

    }
    disable() {
        this.enabled = false;

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