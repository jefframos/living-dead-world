import GameAgent from "./GameAgent";
import GameObject from "../core/GameObject";
import PhysicsEntity from "./PhysicsEntity";
import PhysicsModule from "./PhysicsModule";
import StaticPhysicObject from "../entity/StaticPhysicObject";
import Engine from "../core/Engine";

export default class RenderModule extends GameObject {
    constructor(container, shadowsContainer, debugContainer) {
        super();

        this.container = container;
        this.debugContainer = debugContainer;
        this.shadowsContainer = shadowsContainer;
        this.renderStats = {
            totalRenderEntities: 0
        }
        window.GUI.add(this.renderStats, 'totalRenderEntities').listen();
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
                view.tint = 0
                view.width = bounds.width
                view.height = bounds.height
            } else if (element instanceof PhysicsEntity) {
                element.gameObjectDestroyed.add(this.elementDestroyed.bind(this))
                view = element.view;
            } else if (element.type == 'circle') {
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

            if (element.debug) {
                this.debugContainer.addChild(element.debug)
            }

            if (element.shadow) {
                this.shadowsContainer.addChild(element.shadow)
            }

            if (!view.viewOffset) {
                view.viewOffset = { x: 0, y: 0 }
            }
            this.container.addChild(view)

        });

    }
    elementDestroyed(element) {
        if (element.view) {
            this.container.removeChild(element.view)
        }


        Engine.RemoveFromListById(this.children, element)

        if (element.debug) {
            this.debugContainer.removeChild(element.debug)
        }

        if (element.shadow) {
            this.shadowsContainer.removeChild(element.shadow)
        }
    }
    onRender() {
        if (!this.physics) return

        this.container.children.sort(function (a, b) {
            if (a.y + a.viewOffset.y == b.y + b.viewOffset.y) return a.x - b.x;
            return (a.y + a.viewOffset.y == b.y + b.viewOffset.y);
        });

        this.renderStats.totalRenderEntities = this.container.children.length;
    }
}