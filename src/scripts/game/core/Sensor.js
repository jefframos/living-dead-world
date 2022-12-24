import GameObject from "./GameObject";
import Layer from "./Layer";
import PhysicsEntity from "../modules/PhysicsEntity";
import signals from "signals";

export default class Sensor extends PhysicsEntity {
    constructor() {
        super();
       // this.view = new PIXI.Sprite.from('tile_0085')
       
       this.onTrigger = new signals.Signal();
       
       this.collisionList = []
       
    }
    build(radius = 50) {
        super.build()
        //this.setDebug(radius, 0xFF0000)
        this.buildCircle(0, 0, radius)
        this.rigidBody.isSensor = true;

        this.layerCategory = Layer.Sensor
        this.layerMask = Layer.Enemy - Layer.Player// &! Layer.Environment
        console.log("DOESNT WORK PROPERLY")

    }
    collisionExit(collided) {
        var collidedID = this.collisionList.map(function (x) { return x.engineID; }).indexOf(collided.engineID);
        if (collidedID >= 0) {
            this.collisionList.splice(collidedID, 1)
        }
    }
    collisionStay(collided){
        if(collided.rigidBody.isStatic) return
        //console.log("STAY")
        var collidedID = this.collisionList.map(function (x) { return x.engineID; }).indexOf(collided.engineID);
        if (collidedID < 0) {
            this.collisionList.push(collided)
            this.onTrigger.dispatch(collided)
        }

        //console.log(this.collisionList.length)
    }
    collisionEnter(collided) {
        if(collided.rigidBody.isStatic) return
        //console.log("Enter")

        var collidedID = this.collisionList.map(function (x) { return x.engineID; }).indexOf(collided.engineID);
        if (collidedID < 0) {
            this.collisionList.push(collided)
        }
        this.onTrigger.dispatch(collided)
    }
}