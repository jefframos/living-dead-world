import * as signals from 'signals';

import GameObject from "../core/GameObject";
import Matter from "matter-js";

export default class PhysicsModule extends GameObject {
    constructor() {
        super();

        this.physicsEngine = Matter.Engine.create({
            gravity: {
                scale: 10,
                x: 0,
                y: 0
            }
        });

        this.entityAdded = new signals.Signal()
        this.entityRemoved = new signals.Signal()

        this.nonStaticList = []
        this.collisionList = []


        this.physicsStats = {
            totalPhysicsEntities: 0
        }
        window.GUI.add(this.physicsStats, 'totalPhysicsEntities').listen();

        Matter.Events.on(this.physicsEngine, 'collisionStart', (event) => {
            event.pairs.forEach((collision) => {
                var elementPosA = this.collisionList.map(function (x) { return x.bodyID; }).indexOf(collision.bodyA.id);
                if (elementPosA >= 0) {
                    this.collisionList[elementPosA].collisionEnter(collision.bodyB.gameObject)
                }
                var elementPosB = this.collisionList.map(function (x) { return x.bodyID; }).indexOf(collision.bodyB.id);
                if (elementPosB >= 0) {
                    this.collisionList[elementPosB].collisionEnter(collision.bodyA.gameObject)
                }
            });
        });
    }
    addPhysicBody(physicBody) {
        this.addChild(physicBody)
        if (physicBody.collisionEnter) {
            this.collisionList.push(physicBody);
        }
        Matter.Composite.add(this.physicsEngine.world, physicBody.body);
        this.entityAdded.dispatch([physicBody])
    }
    destroyRandom(quant = 5) {
        for (let index = 0; index < quant; index++) {
            if (this.nonStaticList.length <= 0) return;

            this.removeAgent(this.nonStaticList[this.nonStaticList.length - 1]);
        }
    }
    
    removeAgent(agent) {
        var elementPos = this.children.map(function (x) { return x.engineID; }).indexOf(agent.engineID);
        this.nonStaticList.splice(elementPos, 1)

        var elementPosCollision = this.collisionList.map(function (x) { return x.engineID; }).indexOf(agent.engineID);
        if(elementPosCollision >= 0){
            this.collisionList.splice(elementPosCollision, 1)
        }

        Matter.World.remove(this.physicsEngine.world, agent.body)
    }

    addAgent(agent) {
        this.addPhysicBody(agent)

        if (!agent.body.isStatic) {
            this.nonStaticList.push(agent)
        }
    }
    update(delta) {
        super.update(delta)
        if (this.physicsEngine) {
            Matter.Engine.update(this.physicsEngine, delta);
        }
        this.physicsStats.totalPhysicsEntities = this.physicsEngine.detector.bodies.length

    }

}