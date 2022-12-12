
import GameObject from "../core/GameObject";
import PhysicsModule from "./PhysicsModule";

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

            if (element.type == 'circle') {
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
    onRender() {
        if(!this.physics) return
        for (let index = 0; index < this.physics.children.length; index++) {
                const element = this.physics.children[index];
                this.views[index].x = element.transform.position.x
                this.views[index].y = element.transform.position.y
            }
    }
}