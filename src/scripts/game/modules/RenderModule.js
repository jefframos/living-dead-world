
import GameObject from "../core/GameObject";
import GameAgent from "./GameAgent";
import PhysicsModule from "./PhysicsModule";
import StaticPhysicObject from "./StaticPhysicObject";

export default class RenderModule extends GameObject {
    constructor(container) {
        super();

        this.container = container;
        this.views = [];
    }
    start() {
        this.physics = this.engine.findByType(PhysicsModule)
        this.physics.entityAdded.add(this.newEntityAdded.bind(this))
    }
    newEntityAdded(entities) {
        entities.forEach(element => {
            let view

            if (element instanceof GameAgent) {
                element.gameObjectDestroyed.add(this.elementDestroyed.bind(this))
                view = element.view;
                view.anchor.set(0.5)
                view.width = element.body.circleRadius * 2
                view.height = element.body.circleRadius * 2
            } else if (element instanceof StaticPhysicObject) {
                element.gameObjectDestroyed.add(this.elementDestroyed.bind(this))

                let bounds = {
                    width: element.body.bounds.max.x - element.body.bounds.min.x,
                    height: element.body.bounds.max.y - element.body.bounds.min.y,
                }
                bounds.x = -bounds.width / 2
                bounds.y = -bounds.height / 2

                view = element.view;
                view.anchor.set(0.5)
                view.width = bounds.width
                view.height = bounds.height
            }
            else if (element.type == 'circle') {
                view = new PIXI.Sprite.from('new_item')
                view.anchor.set(0.5)
                view.width = element.body.circleRadius * 2
                view.height = element.body.circleRadius * 2
            } else {
                let bounds = {
                    width: element.body.bounds.max.x - element.body.bounds.min.x,
                    height: element.body.bounds.max.y - element.body.bounds.min.y,
                }
                bounds.x = -bounds.width / 2
                bounds.y = -bounds.height / 2
                view = new PIXI.Sprite.from('small-no-pattern-white')
                view.anchor.set(0.5)
                view.width = bounds.width
                view.height = bounds.height
            }

            this.container.addChild(view)
            this.views.push(view)

        });

    }
    elementDestroyed(element) {
        if (element.view) {
            this.container.removeChild(element.view)
        }

        var elementPos = this.children.map(function (x) { return x.engineID; }).indexOf(element.engineID);
        this.children.splice(elementPos, 1)
    }
    onRender() {
        if (!this.physics) return
    }
}