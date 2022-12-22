import GameObject from "./GameObject";
import Layer from "./Layer";
import PhysicsEntity from "../modules/PhysicsEntity";
import signals from "signals";

export default class Sensor extends PhysicsEntity {
    constructor() {
        super();
        this.view = new PIXI.Sprite.from('tile_0085')
        this.setDebug(80, 0xFF0000)

        this.onTrigger = new signals.Signal();

        this.collisionList = []

    }
    build() {
        super.build()
        this.buildCircle(0, 0, 80)
        this.body.isSensor = true;

        this.layerCategory = Layer.Player
        this.layerMask = Layer.PlayerCollision - Layer.Player

    }
    collisionExit(collided) {
        var collidedID = this.collisionList.map(function (x) { return x.engineID; }).indexOf(collided.engineID);
        if (collidedID >= 0) {
            this.collisionList.splice(collidedID, 1)
        }
    }
    collisionEnter(collided) {

        var collidedID = this.collisionList.map(function (x) { return x.engineID; }).indexOf(collided.engineID);
        if (collidedID < 0) {
            this.collisionList.push(collided)
        }
        this.onTrigger.dispatch(collided)
    }
}