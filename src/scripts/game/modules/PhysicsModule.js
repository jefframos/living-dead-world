import Matter from "matter-js";
import GameObject from "../core/GameObject";
import * as signals from 'signals';
import PhysicsEntity from "./PhysicsEntity";

export default class PhysicsModule extends GameObject {
    constructor() {
        super();

        this.bodies = [];
        this.physicsEngine = Matter.Engine.create({
            gravity: {
                scale: 10,
                x: 0,
                y: 9.8
            }
        });

        this.entityAdded = new signals.Signal()
        this.entityRemoved = new signals.Signal()
    }
    addPhysicBody(physicBody){
        this.addChild(physicBody)        
        this.bodies.push(physicBody)
        this.latest = physicBody.body
        console.log(this.physicsEngine.world, physicBody.body)
        Matter.Composite.add(this.physicsEngine.world, physicBody.body);
        this.entityAdded.dispatch([physicBody])
    }
    addRect(x,y,width,height,isStatic = false){
        
        let physicBody = new PhysicsEntity()       
        physicBody.buildRect(x,y,width,height, { isStatic: isStatic })
        this.addPhysicBody(physicBody)
        
    }
    addCircle(x,y,radius,isStatic = false){
        
        let physicBody = new PhysicsEntity()   
        physicBody.buildCircle(x,y,radius, { isStatic: isStatic })
        this.addPhysicBody(physicBody)
        
    }
    update(delta) {
        super.update(delta)
        if (this.physicsEngine) {
            Matter.Engine.update(this.physicsEngine, delta);
        }

    }

}