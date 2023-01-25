import * as signals from 'signals';

import BaseComponent from "./BaseComponent";
import Pool from '../utils/Pool';
import TagManager from '../TagManager';
import Transform from "./Transform";

export default class GameObject extends BaseComponent {
    static ObjectCounter = 0;
    constructor() {
        super();

        this.tag = TagManager.Tags.Untagged;
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
        this.isDestroyed = false;
    }
    start() {
        this.isDestroyed = false;
    }
    findComponent(type) {
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
        let element = Pool.instance.getElement(constructor)
        this.components.push(element);
        element.gameObject = this;
        element.enable();
        return element;
    }
    removeComponent(component) {
        this.components = this.components.filter(item => item !== component)
        Pool.instance.returnElement(component)
    }
    addChild(gameObject) {
        gameObject.setParent(this)
        this.childAdded.dispatch(gameObject)
        this.children.push(gameObject);
    }
    setActive(value = true) {
        if (value == this.enabled) return;
        if (value) {
            this.enable();
        } else {
            this.disable();
        }
    }
    get forward() {
        let rad = this.transform.angle // 180 * Math.PI
        return { x: Math.cos(rad), y: Math.sin(rad) }
    }
    get facingDirection() {
        let rad = this.transform.angle * 180 * Math.PI
        return rad
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
    set z(value) {
        this.transform.position.z = value
    }
    setPosition(x, y, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }
    setPositionXZ(x, z = 0) {
        this.x = x
        this.z = z
    }
    update(delta) {

        //this was causing double update
        // this.children.forEach(element => {
        //     if (element.enabled) {
        //         element.update(delta);
        //     }
        // });
        this.components.forEach(element => {
            if (element.enabled) {
                element.update(delta);
            }
        });
    }
    enable() {
        this.enabled = true;
        this.isDestroyed = false;
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
        if (this.isDestroyed) {
            console.log("Trying to destroy object that is already destroyed", this);
            // console.trace(this);
            return;
        }

        this.isDestroyed = true;
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
            this.removeComponent(element)
        });
        this.disable();
        Pool.instance.returnElement(this)
        super.destroy();
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
    get destroyed() {
        return this.isDestroyed
    }
    get enabledAndAlive() {
        return this.enabled && !this.isDestroyed
    }
}