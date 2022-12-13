import Matter from "matter-js";
import GameObject from "../core/GameObject";
import PhysicsProperties from "../core/PhysicsProperties";

export default class PhysicsEntity extends GameObject {
    constructor(radius = 15, showDebug = false) {
        super();
        this.body = null;
        this.type = null;

        
        if (showDebug) {
            this.debug = new PIXI.Sprite.from('debugRound')
            this.debug.anchor.set(0.5)
            this.debug.alpha = 0.1
            this.debug.scale.set(radius / this.debug.width * 2)
        }
        
        this.physics = new PhysicsProperties();
        this.buildCircle(0, 0, radius);
    }

    get bodyID(){
        return this.body.id;
    }
    buildRect(x, y, width, height, isStatic = false) {
        this.body = Matter.Bodies.rectangle(x, y, width, height, { isStatic: isStatic });
        this.body.gameObject = this;
        this.transform.position = this.body.position;
        this.type = 'rect'
        return this.body
    }
    buildCircle(x, y, radius, isStatic = false) {
        this.body = Matter.Bodies.circle(x, y, radius, { isStatic: false, restitution: 1 });
        this.body.gameObject = this;
        this.transform.position = this.body.position;
        this.type = 'circle'
        return this.body
    }
    update(delta) {
        this.transform.position.x = this.body.position.x;
        this.transform.position.y = this.body.position.y;
        
        Matter.Body.setVelocity(this.body, this.physics.velocity)
        this.physics.angle = Math.atan2(this.physics.velocity.y, this.physics.velocity.x);
        
        if (this.debug) {
            this.debug.x = this.transform.position.x
            this.debug.y = this.transform.position.y
            this.debug.rotation = this.physics.angle
        }
    }

    /**
     * @param {number} value
     */
    set x(value) {
        Matter.Body.setPosition(this.body, { x: value, y: this.body.position.y })
        this.transform.position.x = this.body.position.x;
    }
    /**
     * @param {number} value
     */
    set y(value) {
        Matter.Body.setPosition(this.body, { x: this.body.position.x, y: value })
        this.transform.position.y = this.body.position.y;
    }
}