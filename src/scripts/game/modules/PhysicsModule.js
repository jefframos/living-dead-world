import Matter from "matter-js";
import GameObject from "../core/GameObject";
import * as signals from 'signals';
import PhysicsEntity from "./PhysicsEntity";
import StaticPhysicObject from "./StaticPhysicObject";

export default class PhysicsModule extends GameObject {
    constructor() {
        super();

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
    addPhysicBody(physicBody) {
        this.addChild(physicBody)
        Matter.Composite.add(this.physicsEngine.world, physicBody.body);
        this.entityAdded.dispatch([physicBody])
    }
    destroyRandom(quant = 5){
        for (let index = 0; index < quant; index++) {
            this.removeAgent(this.children[this.children.length - 1])            
        }
    }
    addRect(x, y, width, height, isStatic = false) {

        let physicBody = new PhysicsEntity()
        physicBody.buildRect(x, y, width, height, { isStatic: isStatic })
        this.addPhysicBody(physicBody)

    }
    addCircle(x, y, radius, isStatic = false) {

        let physicBody = new PhysicsEntity()
        physicBody.buildCircle(x, y, radius, { isStatic: isStatic })
        this.addPhysicBody(physicBody)

    }
    staticRect(x, y, width, height, isStatic = false){
        let staticObject = new StaticPhysicObject(x,y,width,height)
        this.addPhysicBody(staticObject)
    }
    removeAgent(agent) {
        agent.destroy();
        Matter.World.remove(this.physicsEngine.world, agent.body)
    }

    addAgent(agent) {
        this.addPhysicBody(agent)
    }
    update(delta) {
        super.update(delta)
        if (this.physicsEngine) {
            Matter.Engine.update(this.physicsEngine, delta);
        }

    }

}