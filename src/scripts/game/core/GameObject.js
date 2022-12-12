import Transform from "./Transform";
import * as signals from 'signals';

export default class GameObject {
    constructor() {
        this.transform = new Transform();
        this.children = []
        this.enabled = true;
        this.parent = null;

        this.gameObjectDestroyed = new signals.Signal();

    }
    addChild(gameObject) {
        gameObject.engineID = ++this.objectCounter;
        gameObject.setParent(this)
        this.children.push(gameObject);
    }
    start() {

    }
    onRender() {

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
    update(delta) {
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
    destroy(){
        this.gameObjectDestroyed.dispatch(this);

        if(this.parent){
            console.log('destroy')
            this.parent.removeChild(this)
        }
    }
    removeChild(child) {
        var elementPos = this.children.map(function (x) { return x.engineID; }).indexOf(child.engineID);
        this.children.splice(elementPos, 1)
    }
    setParent(newParent) {
        if (this.parent && this.parent != newParent) {
            this.parent.removeChild(this)
        }
        this.parent = newParent;

    }
}